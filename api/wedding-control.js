
import { Redis } from "@upstash/redis";
import webpush from "web-push";
import {
  randomBytes, randomUUID, scryptSync,
  timingSafeEqual, createHash
} from "node:crypto";

const PREFIX = "supnik:wedding-control:v2:";
const SESSION_SECONDS = 12 * 60 * 60;
const TEAMS = [
  "Decor", "Photographer", "DJ",
  "Caterers", "Hotel Staff"
];

const INITIAL_TASKS = {
  Decor: [
    "Confirm final decoration design",
    "Confirm floral and stage requirements",
    "Prepare engagement setup at Lake Lawn",
    "Complete reception stage decoration",
    "Verify entrance and lighting arrangements",
    "Prepare muhurtham decoration at Palm Beach Lawn"
  ],
  Photographer: [
    "Confirm photography and videography crew",
    "Finalize family photography shot list",
    "Confirm camera equipment and backup",
    "Cover engagement ceremony",
    "Cover reception and couple portraits",
    "Cover muhurtham ceremony",
    "Confirm photo and video delivery plan"
  ],
  DJ: [
    "Confirm DJ crew and equipment",
    "Finalize reception playlist",
    "Confirm audio system requirements",
    "Complete sound check at Lake Lawn",
    "Coordinate couple entrance music",
    "Manage reception music and announcements"
  ],
  Caterers: [
    "Confirm final guest count",
    "Finalize food menu",
    "Confirm dietary requirements",
    "Verify kitchen and serving staff",
    "Coordinate engagement food service",
    "Confirm reception counter readiness",
    "Coordinate muhurtham breakfast service"
  ],
  "Hotel Staff": [
    "Confirm guest room allocation",
    "Coordinate guest check-in",
    "Arrange vendor entry and loading",
    "Confirm event lawn availability",
    "Coordinate parking and guest arrivals",
    "Verify engagement venue readiness",
    "Verify reception venue readiness",
    "Coordinate overnight venue transition",
    "Verify muhurtham venue readiness"
  ]
};

const STATUSES = [
  "Pending", "In progress", "Blocked",
  "Awaiting verification", "Verified"
];

const MAX_NOTIFICATIONS = 150;

function clean(value, max = 200) {
  return typeof value === "string"
    ? value.trim().slice(0, max) : "";
}

function send(res, status, body) {
  return res.status(status).json(body);
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

function key(type, id = "") {
  return PREFIX + type + (id ? ":" + id : "");
}

function digest(value) {
  return createHash("sha256").update(value).digest("hex");
}

function passwordHash(password, salt) {
  return scryptSync(password, salt, 64).toString("hex");
}

function secureEqual(a, b) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

function verifyPassword(password, user) {
  if (!user?.salt || !user?.hash) return false;
  try {
    return secureEqual(
      passwordHash(password, user.salt), user.hash
    );
  } catch {
    return false;
  }
}

function makeUser(id, name, role, vendor, password) {
  const salt = randomBytes(16).toString("hex");
  return {
    id, name, role, vendor, salt,
    hash: passwordHash(password, salt),
    sessionVersion: 0,
    createdAt: new Date().toISOString()
  };
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    vendor: user.vendor || ""
  };
}

function validUsername(username) {
  return /^[a-z0-9_.-]{3,40}$/.test(username);
}

function validPassword(password, minimum = 8) {
  return typeof password === "string" &&
    password.length >= minimum &&
    password.length <= 256;
}

function validDue(due) {
  return !due ||
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(due);
}

async function getUser(redis, id) {
  return redis.get(key("user", id));
}

async function allUsers(redis) {
  const ids = await redis.smembers(key("userIds"));
  if (!ids?.length) return [];
  const users = await Promise.all(
    ids.map(id => getUser(redis, id))
  );
  return users.filter(Boolean);
}

async function initializeAdmin(redis) {
  const id = clean(
    process.env.WC_ADMIN_USER, 40
  ).toLowerCase();

  const password = process.env.WC_ADMIN_PASSWORD || "";

  if (!validUsername(id) ||
      !validPassword(password, 16)) {
    throw Error("Admin configuration missing or invalid");
  }

  const created = await redis.set(
    key("adminInitialized"), "1", { nx: true }
  );

  if (created === "OK" || created === true) {
    try {
      const existing = await getUser(redis, id);
      if (!existing) {
        const admin = makeUser(
          id, "Wedding Administrator",
          "admin", "", password
        );
        await redis.set(key("user", id), admin);
        await redis.sadd(key("userIds"), id);
      }
    } catch (error) {
      await redis.del(key("adminInitialized"));
      throw error;
    }
  }
  return id;
}

function bearerToken(req) {
  const authorization = req.headers.authorization || "";
  if (!authorization.startsWith("Bearer ")) return "";
  const token = authorization.slice(7);
  return /^[a-f0-9]{64}$/.test(token) ? token : "";
}

async function authenticate(req, redis) {
  const token = bearerToken(req);
  if (!token) return null;

  const session = await redis.get(
    key("session", digest(token))
  );
  if (!session) return null;

  const userId = typeof session === "string"
    ? session : session.userId;

  const user = await getUser(redis, userId);
  if (!user) return null;

  const version = Number(user.sessionVersion || 0);

  if (typeof session === "string") {
    if (version !== 0) return null;
  } else if (Number(session.version) !== version) {
    return null;
  }

  return user;
}

async function seedTasks(redis) {
  const created = await redis.set(
    key("tasksInitialized"), "1", { nx: true }
  );

  if (created !== "OK" && created !== true) return;

  try {
    for (const [department, titles] of
      Object.entries(INITIAL_TASKS)) {
      for (const title of titles) {
        const id = randomUUID();
        const task = {
          id, department, title,
          owner: "", due: "",
          status: "Pending", notes: "",
          updatedBy: "", updatedAt: "",
          verifiedBy: ""
        };
        await redis.set(key("task", id), task);
        await redis.sadd(key("taskIds"), id);
      }
    }
  } catch (error) {
    await redis.del(key("tasksInitialized"));
    throw error;
  }
}

async function allTasks(redis) {
  const ids = await redis.smembers(key("taskIds"));
  if (!ids?.length) return [];

  const tasks = await Promise.all(
    ids.map(id => redis.get(key("task", id)))
  );

  return tasks.filter(Boolean).sort(
    (a, b) =>
      a.department.localeCompare(b.department) ||
      a.title.localeCompare(b.title)
  );
}

async function getPocs(redis) {
  return (await redis.get(key("pocs"))) || {};
}

function canSeeTask(user, task) {
  return user.role !== "vendor" ||
    user.vendor === task.department;
}

function canVerify(user, task, pocs) {
  return user.role === "admin" ||
    (
      user.role === "family" &&
      (
        task.owner === user.id ||
        pocs[task.department]?.internal === user.id
      )
    );
}

// Browser push is best-effort and does not
// interrupt existing in-app notifications.
let pushConfigured = false;

function configurePush() {
  if (pushConfigured) return true;

  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;

  if (!publicKey || !privateKey || !subject) {
    return false;
  }

  try {
    webpush.setVapidDetails(
      subject, publicKey, privateKey
    );
    pushConfigured = true;
    return true;
  } catch (error) {
    console.error(
      "Wedding push configuration failed:",
      error.message
    );
    return false;
  }
}

async function sendDevicePush(
  redis, userId, title, message, type = "info"
) {
  try {
    if (!configurePush()) return;

    const deviceSet = key("pushDevices", userId);
    const deviceIds = await redis.smembers(deviceSet);

    if (!deviceIds?.length) return;

    const payload = JSON.stringify({
      title,
      body: message,
      tag: type + ":" + randomUUID()
    });

    await Promise.all(deviceIds.map(async deviceId => {
      const deviceKey = key(
        "pushSubscription",
        userId + ":" + deviceId
      );

      try {
        const subscription = await redis.get(deviceKey);

        if (!subscription?.endpoint ||
            !subscription?.keys) {
          await redis.srem(deviceSet, deviceId);
          return;
        }

        await webpush.sendNotification(
          subscription,
          payload,
          {
            TTL: type === "urgent" ? 3600 : 86400,
            timeout: 5000
          }
        );
      } catch (error) {
        if (
          error?.statusCode === 404 ||
          error?.statusCode === 410
        ) {
          await Promise.all([
            redis.del(deviceKey),
            redis.srem(deviceSet, deviceId)
          ]);
        } else {
          console.error(
            "Wedding push delivery failed:",
            error?.statusCode || error?.message
          );
        }
      }
    }));
  } catch (error) {
    console.error(
      "Wedding push unavailable:",
      error.message
    );
  }
}

async function addNotification(
  redis, userId, title, message, type = "info"
) {
  if (!userId) return;

  const notification = {
    id: randomUUID(),
    title: clean(title, 120),
    message: clean(message, 1000),
    type,
    read: false,
    createdAt: new Date().toISOString()
  };

  const listKey = key("notifications", userId);
  await redis.lpush(listKey, notification);
  await redis.ltrim(listKey, 0, MAX_NOTIFICATIONS - 1);

  await sendDevicePush(
    redis,
    userId,
    notification.title,
    notification.message,
    notification.type
  );
}

async function notifyMany(
  redis, recipients, title, message, type = "info"
) {
  const ids = [...new Set(recipients.filter(Boolean))];

  await Promise.all(ids.map(id =>
    addNotification(redis, id, title, message, type)
  ));
}

async function notificationsFor(redis, userId) {
  return (await redis.lrange(
    key("notifications", userId),
    0, MAX_NOTIFICATIONS - 1
  )) || [];
}

async function saveNotifications(redis, userId, list) {
  const listKey = key("notifications", userId);
  await redis.del(listKey);
  if (list.length) await redis.rpush(listKey, ...list);
}

async function taskRecipients(
  redis, task, pocs, includeVendors = true
) {
  const users = await allUsers(redis);
  return users.filter(user =>
    user.role === "admin" ||
    user.id === task.owner ||
    user.id === pocs[task.department]?.internal ||
    (
      includeVendors &&
      user.role === "vendor" &&
      user.vendor === task.department
    )
  ).map(user => user.id);
}

function rateIdentity(req) {
  const ip = String(
    req.headers["x-forwarded-for"] ||
    req.socket?.remoteAddress ||
    "unknown"
  ).split(",")[0].trim();
  return digest(ip);
}

async function checkLoginRate(redis, req, username) {
  const rateKey = key(
    "loginAttempts",
    digest(rateIdentity(req) + ":" + username)
  );

  const count = await redis.incr(rateKey);
  if (count === 1) await redis.expire(rateKey, 900);
  return count <= 10;
}

async function clearLoginRate(redis, req, username) {
  await redis.del(key(
    "loginAttempts",
    digest(rateIdentity(req) + ":" + username)
  ));
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");

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

  const action = clean(req.body?.action, 50);

  try {
    const redis = redisClient();

    // LOGIN
    if (action === "login") {
      const username = clean(
        req.body?.username, 40
      ).toLowerCase();

      const password = req.body?.password;

      if (!validUsername(username) ||
          typeof password !== "string" ||
          password.length > 256) {
        return send(res, 401, {
          error: "Invalid username or password"
        });
      }

      if (!(await checkLoginRate(redis, req, username))) {
        return send(res, 429, {
          error: "Too many attempts. Try again in 15 minutes."
        });
      }

      await initializeAdmin(redis);
      const user = await getUser(redis, username);

      if (!user || !verifyPassword(password, user)) {
        return send(res, 401, {
          error: "Invalid username or password"
        });
      }

      await clearLoginRate(redis, req, username);

      const token = randomBytes(32).toString("hex");

      await redis.set(
        key("session", digest(token)),
        {
          userId: username,
          version: Number(user.sessionVersion || 0)
        },
        { ex: SESSION_SECONDS }
      );

      return send(res, 200, {
        token,
        user: publicUser(user)
      });
    }

    const user = await authenticate(req, redis);

    if (!user) {
      return send(res, 401, {
        error: "Session expired. Please sign in again."
      });
    }

    // LOGOUT
    if (action === "logout") {
      const token = bearerToken(req);
      if (token) {
        await redis.del(key("session", digest(token)));
      }
      return send(res, 200, { success: true });
    }

    // DASHBOARD
    if (action === "dashboard") {
      await seedTasks(redis);

      const tasks = (await allTasks(redis))
        .filter(task => canSeeTask(user, task));

      const users = await allUsers(redis);
      const allPocs = await getPocs(redis);

      const pocs = user.role === "vendor"
        ? {
            [user.vendor]: {
              internal: "",
              vendor: ""
            }
          }
        : allPocs;

      return send(res, 200, {
        user: publicUser(user),
        tasks,
        people: user.role === "vendor"
          ? users.filter(u =>
              u.role !== "vendor"
            ).map(publicUser)
          : users.map(publicUser),
        pocs,
        notifications:
          await notificationsFor(redis, user.id)
      });
    }

    // CREATE ACCOUNT
    if (action === "createAccount") {
      if (user.role !== "admin") {
        return send(res, 403, {
          error: "Only admins can create accounts"
        });
      }

      const name = clean(req.body?.name, 120);
      const username = clean(
        req.body?.username, 40
      ).toLowerCase();
      const role = clean(req.body?.role, 20);
      const vendor = clean(req.body?.vendor, 60);
      const password = req.body?.password;

      if (!name ||
          !validUsername(username) ||
          !["family", "vendor"].includes(role) ||
          !validPassword(password, 8) ||
          (role === "vendor" && !TEAMS.includes(vendor))) {
        return send(res, 400, {
          error: "Invalid account details"
        });
      }

      if (await getUser(redis, username)) {
        return send(res, 409, {
          error: "Username already exists"
        });
      }

      const account = makeUser(
        username, name, role,
        role === "vendor" ? vendor : "",
        password
      );

      const created = await redis.set(
        key("user", username), account, { nx: true }
      );

      if (created !== "OK" && created !== true) {
        return send(res, 409, {
          error: "Username already exists"
        });
      }

      await redis.sadd(key("userIds"), username);

      await addNotification(
        redis, username,
        "Welcome to Wedding Control",
        "Your wedding coordination account is ready."
      );

      return send(res, 200, {
        success: true,
        user: publicUser(account)
      });
    }

    // ADMIN-ONLY PASSWORD RESET
    if (action === "resetAccountPassword") {
      if (user.role !== "admin") {
        return send(res, 403, {
          error: "Only administrators can reset passwords"
        });
      }

      const username = clean(
        req.body?.username, 40
      ).toLowerCase();

      const password = req.body?.password;

      if (!validUsername(username) ||
          !validPassword(password, 8)) {
        return send(res, 400, {
          error: "Choose a password of at least 8 characters"
        });
      }

      const target = await getUser(redis, username);

      if (!target) {
        return send(res, 404, {
          error: "Account not found"
        });
      }

      if (target.role === "admin") {
        return send(res, 403, {
          error: "Admin passwords cannot be reset here"
        });
      }

      const salt = randomBytes(16).toString("hex");

      const updated = {
        ...target,
        salt,
        hash: passwordHash(password, salt),
        sessionVersion:
          Number(target.sessionVersion || 0) + 1,
        passwordUpdatedAt: new Date().toISOString()
      };

      await redis.set(key("user", username), updated);

      await addNotification(
        redis, username,
        "Your password was updated",
        "Your account password was reset by the wedding administrator. Sign in using your new password.",
        "security"
      );

      return send(res, 200, {
        success: true,
        username
      });
    }

    // CREATE TASK
    if (action === "createTask") {
      if (user.role === "vendor") {
        return send(res, 403, {
          error: "Vendors cannot create tasks"
        });
      }

      const department = clean(
        req.body?.department, 60
      );
      const title = clean(req.body?.title, 200);
      const due = clean(req.body?.due, 30);
      const owner = clean(req.body?.owner, 40);

      if (!TEAMS.includes(department) ||
          !title || !validDue(due)) {
        return send(res, 400, {
          error: "Invalid task details"
        });
      }

      if (owner) {
        const assigned = await getUser(redis, owner);
        if (!assigned || assigned.role === "vendor") {
          return send(res, 400, {
            error: "Invalid coordinator"
          });
        }
      }

      const id = randomUUID();
      const task = {
        id, department, title, owner, due,
        status: "Pending", notes: "",
        updatedBy: user.name,
        updatedAt: new Date().toISOString(),
        verifiedBy: ""
      };

      await redis.set(key("task", id), task);
      await redis.sadd(key("taskIds"), id);

      const pocs = await getPocs(redis);
      const recipients = await taskRecipients(
        redis, task, pocs
      );

      await notifyMany(
        redis, recipients,
        "New task: " + title,
        department + " task has been created." +
        (due ? " Deadline: " + due : ""),
        "assignment"
      );

      return send(res, 200, {
        success: true, task
      });
    }

    // UPDATE TASK
    if (action === "updateTask") {
      const id = clean(req.body?.id, 80);
      const patch = req.body?.patch;

      if (!patch ||
          typeof patch !== "object" ||
          Array.isArray(patch)) {
        return send(res, 400, {
          error: "Invalid task update"
        });
      }

      const task = await redis.get(key("task", id));

      if (!task) {
        return send(res, 404, {
          error: "Task not found"
        });
      }

      if (!canSeeTask(user, task)) {
        return send(res, 403, {
          error: "Access denied"
        });
      }

      const allowed = user.role === "vendor"
        ? ["status", "notes"]
        : ["status", "notes", "owner", "due"];

      if (Object.keys(patch).some(
        field => !allowed.includes(field)
      )) {
        return send(res, 403, {
          error: "You cannot edit these fields"
        });
      }

      const pocs = await getPocs(redis);
      const status = clean(
        patch.status ?? task.status, 40
      );
      const owner = clean(
        patch.owner ?? task.owner, 40
      );
      const due = clean(
        patch.due ?? task.due, 30
      );
      const notes = clean(
        patch.notes ?? task.notes, 2000
      );

      if (!STATUSES.includes(status) ||
          !validDue(due)) {
        return send(res, 400, {
          error: "Invalid status or deadline"
        });
      }

      if (owner) {
        const assigned = await getUser(redis, owner);
        if (!assigned || assigned.role === "vendor") {
          return send(res, 400, {
            error: "Invalid task owner"
          });
        }
      }

      if (status === "Verified" &&
          !canVerify(user, task, pocs)) {
        return send(res, 403, {
          error: "Only the assigned coordinator, internal POC or admin can verify"
        });
      }

      if (task.status === "Verified" &&
          user.role === "vendor") {
        return send(res, 403, {
          error: "Verified tasks cannot be edited by vendors"
        });
      }

      const updated = {
        ...task,
        status, owner, due, notes,
        updatedBy: user.name,
        updatedAt: new Date().toISOString(),
        verifiedBy: status === "Verified"
          ? user.name : ""
      };

      await redis.set(key("task", id), updated);

      const recipients = await taskRecipients(
        redis, updated, pocs
      );

      if (owner && owner !== task.owner) {
        await addNotification(
          redis, owner,
          "Task assigned to you",
          updated.title + " — " + updated.department,
          "assignment"
        );
      }

      if (due && due !== task.due) {
        await notifyMany(
          redis, recipients,
          "Deadline updated",
          updated.title + " — " + due,
          "deadline"
        );
      }

      if (status !== task.status) {
        let title = "Task status updated";
        let type = "status";

        if (status === "Blocked") {
          title = "Urgent: Task blocked";
          type = "urgent";
        } else if (status === "Awaiting verification") {
          title = "Task awaiting verification";
          type = "verification";
        } else if (status === "Verified") {
          title = "Task verified";
          type = "verified";
        }

        await notifyMany(
          redis, recipients, title,
          updated.title + " — " +
          updated.department + " — " + status,
          type
        );
      }

      return send(res, 200, {
        success: true, task: updated
      });
    }

    // VENDOR POINTS OF CONTACT
    if (action === "setPoc") {
      if (user.role === "vendor") {
        return send(res, 403, {
          error: "Access denied"
        });
      }

      const department = clean(
        req.body?.department, 60
      );
      const internal = clean(
        req.body?.internal, 40
      );
      const vendor = clean(
        req.body?.vendor, 120
      );

      if (!TEAMS.includes(department)) {
        return send(res, 400, {
          error: "Invalid vendor team"
        });
      }

      if (internal) {
        const person = await getUser(redis, internal);
        if (!person || person.role === "vendor") {
          return send(res, 400, {
            error: "Invalid internal coordinator"
          });
        }
      }

      const pocs = await getPocs(redis);
      pocs[department] = { internal, vendor };
      await redis.set(key("pocs"), pocs);

      return send(res, 200, { success: true });
    }

    // URGENT ALERT
    if (action === "urgentAlert") {
      if (user.role === "vendor") {
        return send(res, 403, {
          error: "Only coordinators can send broadcasts"
        });
      }

      const audience = clean(
        req.body?.audience, 60
      );
      const message = clean(
        req.body?.message, 500
      );

      if (!message ||
          !["all", "family", ...TEAMS].includes(audience)) {
        return send(res, 400, {
          error: "Invalid alert"
        });
      }

      const users = await allUsers(redis);

      const recipients = users.filter(person => {
        if (audience === "all") return true;
        if (audience === "family") {
          return person.role !== "vendor";
        }
        return person.role === "admin" ||
          (
            person.role === "vendor" &&
            person.vendor === audience
          );
      }).map(person => person.id);

      await notifyMany(
        redis, recipients,
        "Urgent wedding update",
        user.name + ": " + message,
        "urgent"
      );

      return send(res, 200, {
        success: true,
        recipients: recipients.length
      });
    }

    // MARK NOTIFICATION READ
    if (action === "markRead") {
      const id = clean(req.body?.id, 80);
      const list = await notificationsFor(
        redis, user.id
      );
      const updated = list.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      );
      await saveNotifications(
        redis, user.id, updated
      );
      return send(res, 200, { success: true });
    }

    // MARK ALL READ
    if (action === "markAllRead") {
      const list = await notificationsFor(
        redis, user.id
      );
      await saveNotifications(
        redis, user.id,
        list.map(notification => ({
          ...notification, read: true
        }))
      );
      return send(res, 200, { success: true });
    }

    return send(res, 400, {
      error: "Unknown action"
    });

  } catch (error) {
    console.error("Wedding Control error:", error.message);
    return send(res, 500, {
      error: "Wedding Control is not configured or temporarily unavailable"
    });
  }
}

