
import { Redis } from "@upstash/redis";
import {
  randomBytes,
  createHash,
  scryptSync
} from "node:crypto";

const PREFIX = "supnik:wedding-control:v2:";
const TEAMS = [
  "Decor", "Photographer", "DJ",
  "Caterers", "Hotel Staff"
];

function key(type, id = "") {
  return PREFIX + type + (id ? ":" + id : "");
}

function clean(value, max = 200) {
  return typeof value === "string"
    ? value.trim().slice(0, max)
    : "";
}

function send(res, status, data) {
  return res.status(status).json(data);
}

function digest(value) {
  return createHash("sha256")
    .update(value).digest("hex");
}

function redisClient() {
  const url =
    process.env.UPSTASH_REDIS_REST_KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL;

  const token =
    process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw Error("Redis configuration missing");
  }

  return new Redis({ url, token });
}

function validUsername(value) {
  return /^[a-z0-9_.-]{3,40}$/.test(value);
}

function validPassword(value) {
  return typeof value === "string" &&
    value.length >= 8 &&
    value.length <= 256;
}

function validEmail(value) {
  return value.length <= 180 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validPhone(value) {
  return /^[+0-9 ()-]{8,25}$/.test(value);
}

async function authenticate(req, redis) {
  const auth = req.headers.authorization || "";

  if (!auth.startsWith("Bearer ")) return null;

  const token = auth.slice(7);

  if (!/^[a-f0-9]{64}$/.test(token)) return null;

  const session = await redis.get(
    key("session", digest(token))
  );

  if (!session) return null;

  const id = typeof session === "string"
    ? session : session.userId;

  const user = await redis.get(key("user", id));

  if (!user) return null;

  const version = Number(user.sessionVersion || 0);

  if (typeof session === "string") {
    if (version !== 0) return null;
  } else if (Number(session.version) !== version) {
    return null;
  }

  return user;
}

function publicRequest(item) {
  return {
    username: item.username,
    name: item.name,
    email: item.email,
    phone: item.phone,
    team: item.team,
    position: item.position,
    status: item.status,
    createdAt: item.createdAt
  };
}

async function allRequests(redis) {
  const ids = await redis.smembers(
    key("vendorRegistrationIds")
  );

  if (!ids?.length) return [];

  const records = await Promise.all(
    ids.map(id =>
      redis.get(key("vendorRegistration", id))
    )
  );

  return records.filter(Boolean);
}

async function rateLimit(redis, req) {
  const ip = String(
    req.headers["x-forwarded-for"] ||
    req.socket?.remoteAddress ||
    "unknown"
  ).split(",")[0].trim();

  const rateKey = key(
    "vendorRegistrationRate",
    digest(ip)
  );

  const count = await redis.incr(rateKey);

  if (count === 1) {
    await redis.expire(rateKey, 3600);
  }

  return count <= 10;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader(
    "X-Content-Type-Options", "nosniff"
  );

  if (req.method !== "POST") {
    return send(res, 405, {
      error: "POST requests only"
    });
  }

  const origin = req.headers.origin;

  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.host) {
        return send(res, 403, {
          error: "Request origin rejected"
        });
      }
    } catch {
      return send(res, 403, {
        error: "Request origin rejected"
      });
    }
  }

  const action = clean(req.body?.action, 40);

  try {
    const redis = redisClient();

    // PUBLIC: SUBMIT REGISTRATION
    if (action === "register") {
      if (!(await rateLimit(redis, req))) {
        return send(res, 429, {
          error: "Too many attempts. Try again later."
        });
      }

      const username = clean(
        req.body?.username, 40
      ).toLowerCase();

      const name = clean(req.body?.name, 120);
      const email = clean(
        req.body?.email, 180
      ).toLowerCase();
      const phone = clean(req.body?.phone, 25);
      const team = clean(req.body?.team, 60);
      const position = clean(
        req.body?.position, 100
      );
      const password = req.body?.password;

      if (
        !validUsername(username) ||
        !name ||
        !validEmail(email) ||
        !validPhone(phone) ||
        !TEAMS.includes(team) ||
        !position ||
        !validPassword(password)
      ) {
        return send(res, 400, {
          error: "Please enter valid registration details."
        });
      }

      const existing = await Promise.all([
        redis.get(key("user", username)),
        redis.get(key("vendorRegistration", username))
      ]);

      if (existing.some(Boolean)) {
        return send(res, 409, {
          error: "Username already exists."
        });
      }

      const salt = randomBytes(16).toString("hex");

      const record = {
        username,
        name,
        email,
        phone,
        team,
        position,
        salt,
        hash: scryptSync(
          password, salt, 64
        ).toString("hex"),
        status: "pending",
        createdAt: new Date().toISOString()
      };

      const created = await redis.set(
        key("vendorRegistration", username),
        record,
        { nx: true }
      );

      if (created !== "OK" && created !== true) {
        return send(res, 409, {
          error: "Username already exists."
        });
      }

      await redis.sadd(
        key("vendorRegistrationIds"),
        username
      );

      return send(res, 200, {
        success: true,
        message:
          "Registration submitted. The wedding administrator will review your request."
      });
    }

    // AUTHENTICATED ACTIONS
    const user = await authenticate(req, redis);

    if (!user) {
      return send(res, 401, {
        error: "Please sign in."
      });
    }

    // ADMIN ONLY FROM HERE
    if (user.role !== "admin") {
      return send(res, 403, {
        error: "Only the wedding administrator can manage registrations."
      });
    }

    // LIST PENDING REQUESTS AND TEAM MEMBERS
    if (action === "list") {
      const requests = (await allRequests(redis))
        .filter(item => item.status === "pending")
        .map(publicRequest)
        .sort((a, b) =>
          a.createdAt.localeCompare(b.createdAt)
        );

      const ids = await redis.smembers(
        key("userIds")
      );

      const users = await Promise.all(
        ids.map(id => redis.get(key("user", id)))
      );

      const members = users
        .filter(item => item?.role === "vendor")
        .map(item => ({
          id: item.id,
          name: item.name,
          team: item.vendor,
          email: item.email || "",
          phone: item.phone || "",
          position: item.position || ""
        }));

      const leads = {};

      for (const team of TEAMS) {
        leads[team] = await redis.get(
          key("vendorLead", team)
        );
      }

      return send(res, 200, {
        requests, members, leads
      });
    }

    // APPROVE REGISTRATION
    if (action === "approve") {
      const username = clean(
        req.body?.username, 40
      ).toLowerCase();

      const record = await redis.get(
        key("vendorRegistration", username)
      );

      if (!record || record.status !== "pending") {
        return send(res, 404, {
          error: "Pending registration not found."
        });
      }

      const account = {
        id: record.username,
        name: record.name,
        role: "vendor",
        vendor: record.team,
        email: record.email,
        phone: record.phone,
        position: record.position,
        salt: record.salt,
        hash: record.hash,
        sessionVersion: 0,
        createdAt: new Date().toISOString()
      };

      const created = await redis.set(
        key("user", username),
        account,
        { nx: true }
      );

      if (created !== "OK" && created !== true) {
        return send(res, 409, {
          error: "Username already has an account."
        });
      }

      await redis.sadd(
        key("userIds"), username
      );

      await redis.del(
        key("vendorRegistration", username)
      );

      await redis.srem(
        key("vendorRegistrationIds"),
        username
      );

      return send(res, 200, {
        success: true,
        message: record.name + " approved."
      });
    }

    // REJECT REGISTRATION
    if (action === "reject") {
      const username = clean(
        req.body?.username, 40
      ).toLowerCase();

      const record = await redis.get(
        key("vendorRegistration", username)
      );

      if (!record || record.status !== "pending") {
        return send(res, 404, {
          error: "Pending registration not found."
        });
      }

      await redis.del(
        key("vendorRegistration", username)
      );

      await redis.srem(
        key("vendorRegistrationIds"),
        username
      );

      return send(res, 200, {
        success: true,
        message: "Registration rejected."
      });
    }

    // SET VENDOR SPOC
    if (action === "setLead") {
      const team = clean(req.body?.team, 60);
      const username = clean(
        req.body?.username, 40
      ).toLowerCase();

      if (!TEAMS.includes(team)) {
        return send(res, 400, {
          error: "Invalid vendor team."
        });
      }

      if (!username) {
        await redis.del(key("vendorLead", team));

        return send(res, 200, {
          success: true
        });
      }

      const target = await redis.get(
        key("user", username)
      );

      if (
        !target ||
        target.role !== "vendor" ||
        target.vendor !== team
      ) {
        return send(res, 400, {
          error:
            "Select an approved member of this vendor team."
        });
      }

      await redis.set(
        key("vendorLead", team),
        username
      );

      return send(res, 200, {
        success: true,
        message: "Vendor SPOC updated."
      });
    }

    return send(res, 400, {
      error: "Unknown action"
    });

  } catch (error) {
    console.error(
      "Vendor registration error:",
      error.message
    );

    return send(res, 500, {
      error:
        "Vendor registration is temporarily unavailable."
    });
  }
}
