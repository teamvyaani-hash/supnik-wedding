
import { Redis } from "@upstash/redis";
import {
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
  createHash
} from "node:crypto";

const PREFIX = "supnik:command:v1:";
const SESSION_SECONDS = 60 * 60 * 12;

const DEPARTMENTS = [
  "Decor",
  "Photographer",
  "DJ",
  "Caterers",
  "Hotel Staff"
];

const INITIAL_TASKS = {
  Decor: [
    "Confirm final decoration design",
    "Confirm stage and floral requirements",
    "Verify engagement setup at Lake Lawn",
    "Complete reception stage decoration",
    "Check lighting and entrance decoration",
    "Complete muhurtham decoration at Palm Beach Lawn"
  ],
  Photographer: [
    "Confirm photography and video crew",
    "Finalize family and couple shot list",
    "Confirm crew arrival and equipment",
    "Cover engagement ceremony",
    "Cover reception and couple portraits",
    "Cover muhurtham ceremony",
    "Confirm backup and delivery of footage"
  ],
  DJ: [
    "Confirm DJ team and equipment",
    "Finalize reception playlist",
    "Confirm sound system requirements",
    "Complete sound check at Lake Lawn",
    "Coordinate reception entry music",
    "Manage reception music and announcements"
  ],
  Caterers: [
    "Confirm final guest count",
    "Approve food menu and service plan",
    "Confirm dietary requirements",
    "Verify kitchen and serving staff",
    "Confirm engagement food service",
    "Confirm reception food counter readiness",
    "Confirm muhurtham breakfast service"
  ],
  "Hotel Staff": [
    "Confirm guest room allocation",
    "Confirm guest check-in arrangements",
    "Coordinate vendor entry and loading",
    "Confirm event lawn availability",
    "Coordinate parking and guest arrivals",
    "Verify engagement venue readiness",
    "Verify reception venue readiness",
    "Coordinate overnight venue transition",
    "Verify muhurtham venue readiness"
  ]
};

function clean(value, max = 200) {
  return typeof value === "string"
    ? value.trim().slice(0, max)
    : "";
}

function reply(res, status, data) {
  return res.status(status).json(data);
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
    throw new Error("Redis credentials missing");
  }

  return new Redis({ url, token });
}

function hashPassword(password, salt) {
  return scryptSync(password, salt, 64).toString("hex");
}

function checkPassword(password, record) {
  if (!record?.salt || !record?.hash) return false;

  try {
    const actual = Buffer.from(
      hashPassword(password, record.salt),
      "hex"
    );

    const expected = Buffer.from(record.hash, "hex");

    return actual.length === expected.length &&
      timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

function tokenHash(token) {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

function taskKey(id) {
  return PREFIX + "task:" + id;
}

function userKey(id) {
  return PREFIX + "user:" + id;
}

function sessionKey(token) {
  return PREFIX + "session:" + tokenHash(token);
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    vendor: user.vendor || ""
  };
}

async function getUser(redis, id) {
  return await redis.get(userKey(id));
}

async function authenticate(req, redis) {
  const auth = req.headers.authorization || "";

  if (!auth.startsWith("Bearer ")) return null;

  const token = auth.slice(7);

  if (!/^[a-f0-9]{64}$/.test(token)) return null;

  const id = await redis.get(sessionKey(token));

  if (!id) return null;

  return await getUser(redis, id);
}

async function seedTasks(redis) {
  const seeded = await redis.set(
    PREFIX + "seeded",
    "1",
    { nx: true }
  );

  if (seeded !== "OK" && seeded !== true) return;

  try {
    for (const [department, titles] of Object.entries(INITIAL_TASKS)) {
      for (const title of titles) {
        const id = randomUUID();

        const task = {
          id,
          department,
          title,
          owner: "",
          due: "",
          status: "Pending",
          notes: "",
          updatedBy: "",
          updatedAt: "",
          verifiedBy: ""
        };

        await redis.set(taskKey(id), task);
        await redis.sadd(PREFIX + "taskIds", id);
      }
    }
  } catch (error) {
    await redis.del(PREFIX + "seeded");
    throw error;
  }
}

async function listTasks(redis) {
  const ids = await redis.smembers(PREFIX + "taskIds");

  if (!ids?.length) return [];

  const results = await Promise.all(
    ids.map(id => redis.get(taskKey(id)))
  );

  return results.filter(Boolean).sort(
    (a, b) =>
      a.department.localeCompare(b.department) ||
      a.title.localeCompare(b.title)
  );
}

async function getPeople(redis) {
  const ids = await redis.smembers(PREFIX + "userIds");

  const users = await Promise.all(
    (ids || []).map(id => getUser(redis, id))
  );

  return users
    .filter(u => u && u.role !== "vendor")
    .map(publicUser);
}

async function ensureAdmin(redis) {
  const id = clean(process.env.CC_ADMIN_USER, 80);
  const password = process.env.CC_ADMIN_PASSWORD || "";

  if (!id || password.length < 16) {
    throw new Error(
      "CC_ADMIN_USER and CC_ADMIN_PASSWORD must be configured. " +
      "Admin password must contain at least 16 characters."
    );
  }

  const existing = await getUser(redis, id);

  if (existing) return;

  const salt = randomBytes(16).toString("hex");

  await redis.set(userKey(id), {
    id,
    name: "Wedding Admin",
    role: "admin",
    vendor: "",
    salt,
    hash: hashPassword(password, salt)
  });

  await redis.sadd(PREFIX + "userIds", id);
}

function permitted(user, task) {
  return user.role !== "vendor" ||
    task.department === user.vendor;
}

function validDepartment(department) {
  return DEPARTMENTS.includes(department);
}

function validDue(due) {
  return !due ||
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(due);
}

function validStatus(status) {
  return [
    "Pending",
    "In progress",
    "Blocked",
    "Awaiting verification",
    "Verified"
  ].includes(status);
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method !== "POST") {
    return reply(res, 405, { error: "POST required" });
  }

  const origin = req.headers.origin;

  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.host) {
        return reply(res, 403, { error: "Origin rejected" });
      }
    } catch {
      return reply(res, 403, { error: "Origin rejected" });
    }
  }

  const action = clean(req.body?.action, 40);

  try {
    const redis = redisClient();

    if (action === "login") {
      const id = clean(req.body?.id, 80);
      const password = req.body?.password;

      if (typeof password !== "string" ||
          password.length > 256) {
        return reply(res, 400, {
          error: "Invalid credentials"
        });
      }

      const ip = clean(
        String(req.headers["x-forwarded-for"] || "")
          .split(",")[0],
        100
      );

      const rateKey = PREFIX + "loginRate:" +
        tokenHash(ip + ":" + id);

      const attempts = await redis.incr(rateKey);

      if (attempts === 1) {
        await redis.expire(rateKey, 900);
      }

      if (attempts > 10) {
        return reply(res, 429, {
          error: "Too many attempts. Try again later."
        });
      }

      await ensureAdmin(redis);

      const user = await getUser(redis, id);

      if (!user || !checkPassword(password, user)) {
        return reply(res, 401, {
          error: "Invalid username or password"
        });
      }

      const token = randomBytes(32).toString("hex");

      await redis.set(
        sessionKey(token),
        user.id,
        { ex: SESSION_SECONDS }
      );

      return reply(res, 200, {
        token,
        user: publicUser(user)
      });
    }

    const user = await authenticate(req, redis);

    if (!user) {
      return reply(res, 401, {
        error: "Please sign in again"
      });
    }

    if (action === "list") {
      await seedTasks(redis);

      const allTasks = await listTasks(redis);

      const tasks = allTasks.filter(
        task => permitted(user, task)
      );

      const allPocs =
        (await redis.get(PREFIX + "pocs")) || {};

      const pocs = user.role === "vendor"
        ? {
            [user.vendor]: {
              internal: "",
              vendor: ""
            }
          }
        : allPocs;

      return reply(res, 200, {
        user: publicUser(user),
        tasks,
        pocs,
        people: user.role === "vendor"
          ? []
          : await getPeople(redis)
      });
    }

    if (action === "addTask") {
      if (user.role === "vendor") {
        return reply(res, 403, {
          error: "Only coordinators can add tasks"
        });
      }

      const department = clean(req.body?.department, 60);
      const title = clean(req.body?.title);
      const due = clean(req.body?.due, 30);

      if (!validDepartment(department) ||
          !title || !validDue(due)) {
        return reply(res, 400, {
          error: "Invalid task details"
        });
      }

      const id = randomUUID();

      const task = {
        id,
        department,
        title,
        owner: "",
        due,
        status: "Pending",
        notes: "",
        updatedBy: user.name,
        updatedAt: new Date().toISOString(),
        verifiedBy: ""
      };

      await redis.set(taskKey(id), task);
      await redis.sadd(PREFIX + "taskIds", id);

      return reply(res, 200, { task });
    }

    if (action === "updateTask") {
      const id = clean(req.body?.id, 80);
      const patch = req.body?.patch;

      if (!patch || typeof patch !== "object" ||
          Array.isArray(patch)) {
        return reply(res, 400, {
          error: "Invalid update"
        });
      }

      const task = await redis.get(taskKey(id));

      if (!task) {
        return reply(res, 404, {
          error: "Task not found"
        });
      }

      if (!permitted(user, task)) {
        return reply(res, 403, {
          error: "Access denied"
        });
      }

      const allowed = user.role === "vendor"
        ? ["status", "notes"]
        : ["status", "notes", "owner", "due"];

      for (const key of Object.keys(patch)) {
        if (!allowed.includes(key)) {
          return reply(res, 403, {
            error: "Field cannot be changed"
          });
        }
      }

      const status = clean(
        patch.status ?? task.status,
        40
      );

      if (!validStatus(status)) {
        return reply(res, 400, {
          error: "Invalid status"
        });
      }

      if (status === "Verified" &&
          user.role !== "admin") {
        return reply(res, 403, {
          error: "Only admins can verify completion"
        });
      }

      if (user.role === "vendor" &&
          task.status === "Verified" &&
          status !== "Verified") {
        return reply(res, 403, {
          error: "Verified tasks cannot be reopened by vendors"
        });
      }

      const due = clean(patch.due ?? task.due, 30);

      if (!validDue(due)) {
        return reply(res, 400, {
          error: "Invalid deadline"
        });
      }

      const owner = clean(
        patch.owner ?? task.owner,
        80
      );

      if (owner) {
        const ownerUser = await getUser(redis, owner);

        if (!ownerUser || ownerUser.role === "vendor") {
          return reply(res, 400, {
            error: "Choose a valid family or friend"
          });
        }
      }

      const updated = {
        ...task,
        status,
        notes: clean(
          patch.notes ?? task.notes,
          2000
        ),
        owner,
        due,
        updatedBy: user.name,
        updatedAt: new Date().toISOString(),
        verifiedBy: status === "Verified"
          ? user.name
          : ""
      };

      await redis.set(taskKey(id), updated);

      return reply(res, 200, {
        task: updated
      });
    }

    if (action === "setPoc") {
      if (user.role === "vendor") {
        return reply(res, 403, {
          error: "Access denied"
        });
      }

      const department = clean(
        req.body?.department,
        60
      );

      const internal = clean(
        req.body?.internal,
        80
      );

      const vendor = clean(
        req.body?.vendor,
        120
      );

      if (!validDepartment(department)) {
        return reply(res, 400, {
          error: "Invalid vendor category"
        });
      }

      if (internal) {
        const person = await getUser(redis, internal);

        if (!person || person.role === "vendor") {
          return reply(res, 400, {
            error: "Invalid internal POC"
          });
        }
      }

      const pocs =
        (await redis.get(PREFIX + "pocs")) || {};

      pocs[department] = {
        internal,
        vendor
      };

      await redis.set(PREFIX + "pocs", pocs);

      return reply(res, 200, {
        success: true
      });
    }

    return reply(res, 400, {
      error: "Unknown action"
    });

  } catch (error) {
    console.error("Command Center:", error.message);

    return reply(res, 500, {
      error: "Command Center is not configured or temporarily unavailable"
    });
  }
}
