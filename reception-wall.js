
import { randomUUID } from "node:crypto";

const PREFIX = "ns:reception-wall:v1:";
const INDEX_KEY = `${PREFIX}messages`;

const CATEGORIES = new Set([
  "wishes",
  "advice",
  "funny",
  "memory"
]);

function reply(res, status, data) {
  return res.status(status).json(data);
}

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getConfig() {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.UPSTASH_REDIS_REST_REDIS_URL ||
    process.env.UPSTASH_REDIS_REST_KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_KV_URL;

  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error("Redis configuration missing");
  }

  return { url, token };
}

async function redis(command) {
  const { url, token } = getConfig();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command)
  });

  if (!response.ok) {
    throw new Error("Redis request failed");
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data.result;
}

function messageKey(id) {
  return `${PREFIX}message:${id}`;
}

async function getMessages() {
  const ids = await redis(["LRANGE", INDEX_KEY, 0, 499]);

  if (!Array.isArray(ids) || !ids.length) {
    return [];
  }

  const messages = await Promise.all(
    ids.map(async id => {
      const raw = await redis(["GET", messageKey(id)]);

      if (!raw) return null;

      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    })
  );

  return messages.filter(Boolean);
}

function authorized(password) {
  const expected =
    process.env.RECEPTION_WALL_ADMIN_PASSWORD;

  return Boolean(
    expected &&
    password &&
    password === expected
  );
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method !== "POST") {
    return reply(res, 405, {
      error: "POST required"
    });
  }

  const origin = req.headers.origin;

  if (origin) {
    try {
      const requestOrigin = new URL(origin);
      const expectedHost = req.headers.host;

      if (requestOrigin.host !== expectedHost) {
        return reply(res, 403, {
          error: "Origin rejected"
        });
      }
    } catch {
      return reply(res, 403, {
        error: "Origin rejected"
      });
    }
  }

  const body = req.body || {};
  const action = clean(body.action);

  try {
    if (action === "public") {
      const messages = await getMessages();

      return reply(res, 200, {
        messages: messages
          .filter(item => item.status === "approved")
          .slice(0, 100)
      });
    }

    if (action === "submit") {
      const name = clean(body.name)
        .replace(/\s+/g, " ");

      const category = clean(body.category);
      const message = clean(body.message);
      const website = clean(body.website);

      if (website) {
        return reply(res, 200, {
          message: "Submitted for approval."
        });
      }

      if (name.length < 2 || name.length > 35) {
        return reply(res, 400, {
          error: "Name must contain 2 to 35 characters."
        });
      }

      if (!CATEGORIES.has(category)) {
        return reply(res, 400, {
          error: "Invalid message category."
        });
      }

      if (message.length < 8 || message.length > 500) {
        return reply(res, 400, {
          error: "Message must contain 8 to 500 characters."
        });
      }

      const id = randomUUID();

      const item = {
        id,
        name,
        category,
        message,
        status: "pending",
        createdAt: new Date().toISOString()
      };

      await redis([
        "SET",
        messageKey(id),
        JSON.stringify(item)
      ]);

      await redis([
        "LPUSH",
        INDEX_KEY,
        id
      ]);

      return reply(res, 200, {
        success: true,
        message: "Submitted for approval."
      });
    }

    if (action === "admin-list") {
      if (!authorized(clean(body.password))) {
        return reply(res, 401, {
          error: "Invalid admin password."
        });
      }

      return reply(res, 200, {
        messages: await getMessages()
      });
    }

    if (action === "moderate") {
      if (!authorized(clean(body.password))) {
        return reply(res, 401, {
          error: "Invalid admin password."
        });
      }

      const id = clean(body.id);
      const decision = clean(body.decision);

      if (!/^[0-9a-f-]{36}$/i.test(id)) {
        return reply(res, 400, {
          error: "Invalid message ID."
        });
      }

      if (!["approve", "reject"].includes(decision)) {
        return reply(res, 400, {
          error: "Invalid moderation decision."
        });
      }

      const raw = await redis([
        "GET",
        messageKey(id)
      ]);

      if (!raw) {
        return reply(res, 404, {
          error: "Message not found."
        });
      }

      const item = JSON.parse(raw);

      item.status =
        decision === "approve" ? "approved" : "rejected";

      item.moderatedAt = new Date().toISOString();

      await redis([
        "SET",
        messageKey(id),
        JSON.stringify(item)
      ]);

      return reply(res, 200, {
        success: true,
        message: "Moderation saved."
      });
    }

    return reply(res, 400, {
      error: "Unknown action."
    });
  } catch (error) {
    console.error("Reception Wall API:", error);

    return reply(res, 500, {
      error: "Reception Wall server error."
    });
  }
}
