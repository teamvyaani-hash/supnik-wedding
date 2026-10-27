
import { Redis } from "@upstash/redis";
import { createHash, randomUUID } from "node:crypto";

const PREFIX = "supnik:wedding-control:v2:";
const CATEGORIES = ["Friends", "Family"];

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
    .update(value)
    .digest("hex");
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

async function authenticate(req, redis) {
  const auth = req.headers.authorization || "";

  if (!auth.startsWith("Bearer ")) return null;

  const token = auth.slice(7);

  if (!/^[a-f0-9]{64}$/.test(token)) return null;

  const session = await redis.get(
    key("session", digest(token))
  );

  if (!session) return null;

  const userId = typeof session === "string"
    ? session
    : session.userId;

  if (!userId) return null;

  const user = await redis.get(
    key("user", userId)
  );

  if (!user) return null;

  const version = Number(user.sessionVersion || 0);

  if (typeof session === "string") {
    if (version !== 0) return null;
  } else if (Number(session.version) !== version) {
    return null;
  }

  return user;
}

function validPhone(phone) {
  return /^[+0-9 ()-]{8,25}$/.test(phone);
}

function publicContact(contact) {
  return {
    id: contact.id,
    name: contact.name,
    phone: contact.phone,
    category: contact.category,
    notes: contact.notes || "",
    createdAt: contact.createdAt,
    updatedAt: contact.updatedAt
  };
}

async function listContacts(redis) {
  const ids = await redis.smembers(
    key("whatsappContactIds")
  );

  if (!ids?.length) return [];

  const records = await Promise.all(
    ids.map(id =>
      redis.get(key("whatsappContact", id))
    )
  );

  return records
    .filter(Boolean)
    .map(publicContact)
    .sort((a, b) =>
      a.category.localeCompare(b.category) ||
      a.name.localeCompare(b.name)
    );
}

async function listVendors(redis) {
  const ids = await redis.smembers(key("userIds"));

  if (!ids?.length) return [];

  const users = await Promise.all(
    ids.map(id => redis.get(key("user", id)))
  );

  return users
    .filter(user => user?.role === "vendor")
    .map(user => ({
      id: user.id,
      name: user.name,
      phone: user.phone || "",
      team: user.vendor || "",
      position: user.position || ""
    }))
    .sort((a, b) =>
      a.team.localeCompare(b.team) ||
      a.name.localeCompare(b.name)
    );
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader(
    "X-Content-Type-Options",
    "nosniff"
  );

  if (req.method !== "POST") {
    return send(res, 405, {
      error: "POST requests only."
    });
  }

  const origin = req.headers.origin;

  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.host) {
        return send(res, 403, {
          error: "Request origin rejected."
        });
      }
    } catch {
      return send(res, 403, {
        error: "Request origin rejected."
      });
    }
  }

  try {
    const redis = redisClient();
    const user = await authenticate(req, redis);

    if (!user) {
      return send(res, 401, {
        error: "Please sign in."
      });
    }

    if (
      user.role !== "admin" &&
      user.role !== "family"
    ) {
      return send(res, 403, {
        error: "Access denied."
      });
    }

    const action = clean(req.body?.action, 30);

    // Admin and family coordinators can
    // view contacts for WhatsApp messaging.
    if (action === "list") {
      const [contacts, vendors] = await Promise.all([
        listContacts(redis),
        listVendors(redis)
      ]);

      return send(res, 200, {
        success: true,
        contacts,
        vendors,
        canManage: user.role === "admin"
      });
    }

    // Only admin can change saved contacts.
    if (user.role !== "admin") {
      return send(res, 403, {
        error:
          "Only the administrator can manage contacts."
      });
    }

    if (action === "save") {
      const id = clean(req.body?.id, 80);
      const name = clean(req.body?.name, 120);
      const phone = clean(req.body?.phone, 25);
      const category = clean(req.body?.category, 30);
      const notes = clean(req.body?.notes, 500);

      if (
        !name ||
        !validPhone(phone) ||
        !CATEGORIES.includes(category)
      ) {
        return send(res, 400, {
          error:
            "Enter a valid name, phone number and category."
        });
      }

      let existing = null;

      if (id) {
        existing = await redis.get(
          key("whatsappContact", id)
        );

        if (!existing) {
          return send(res, 404, {
            error: "Contact not found."
          });
        }
      }

      const contactId = id || randomUUID();
      const now = new Date().toISOString();

      const contact = {
        id: contactId,
        name,
        phone,
        category,
        notes,
        createdAt: existing?.createdAt || now,
        updatedAt: now
      };

      await redis.set(
        key("whatsappContact", contactId),
        contact
      );

      await redis.sadd(
        key("whatsappContactIds"),
        contactId
      );

      return send(res, 200, {
        success: true,
        contact: publicContact(contact),
        message: existing
          ? "Contact updated."
          : "Contact added."
      });
    }

    if (action === "delete") {
      const id = clean(req.body?.id, 80);

      if (!id) {
        return send(res, 400, {
          error: "Contact ID required."
        });
      }

      const existing = await redis.get(
        key("whatsappContact", id)
      );

      if (!existing) {
        return send(res, 404, {
          error: "Contact not found."
        });
      }

      await redis.del(
        key("whatsappContact", id)
      );

      await redis.srem(
        key("whatsappContactIds"),
        id
      );

      return send(res, 200, {
        success: true,
        message: "Contact deleted."
      });
    }

    return send(res, 400, {
      error: "Unknown action."
    });

  } catch (error) {
    console.error(
      "Wedding contacts error:",
      error.message
    );

    return send(res, 500, {
      error:
        "Contact directory temporarily unavailable."
    });
  }
}
