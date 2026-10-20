
import { Redis } from "@upstash/redis";
import { randomUUID, timingSafeEqual } from "node:crypto";

const PREFIX = "ns:reception-wall:v1:";
const LIST = `${PREFIX}all`;
const APPROVED = `${PREFIX}approved`;

function respond(res, status, data) {
  return res.status(status).json(data);
}

function clean(value, max) {
  return typeof value === "string"
    ? value.trim().replace(/\s+/g, " ").slice(0, max)
    : "";
}

function authorized(password) {
  const expected = process.env.RECEPTION_WALL_ADMIN_PASSWORD;

  if (!expected || typeof password !== "string") {
    return false;
  }

  const a = Buffer.from(password);
  const b = Buffer.from(expected);

  return a.length === b.length && timingSafeEqual(a, b);
}

function safeMessage(item) {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    message: item.message,
    createdAt: item.createdAt
  };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return respond(res, 405, { error: "POST required" });
  }

  const origin = req.headers.origin;

  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.host) {
        return respond(res, 403, { error: "Origin rejected" });
      }
    } catch {
      return respond(res, 403, { error: "Origin rejected" });
    }
  }

  const action = clean(req.body?.action, 30);

  try {
    const redis = Redis.fromEnv();

    if (action === "submit") {
      const name = clean(req.body?.name, 35);
      const message = clean(req.body?.message, 500);
      const category = clean(req.body?.category, 30);

      const categories = [
        "advice",
        "memory",
        "funny",
        "wishes"
      ];

      if (
        name.length < 2 ||
        message.length < 8 ||
        !categories.includes(category)
      ) {
        return respond(res, 400, {
          error: "Enter your name, a category, and a message of at least 8 characters."
        });
      }

      const honeypot = clean(req.body?.website, 100);
      if (honeypot) {
        return respond(res, 200, {
          success: true,
          message: "Submitted for approval."
        });
      }

      const ip = String(
        req.headers["x-forwarded-for"] || "unknown"
      ).split(",")[0].trim();

      const rateKey = `${PREFIX}rate:${ip}`;
      const count = await redis.incr(rateKey);

      if (count === 1) {
        await redis.expire(rateKey, 3600);
      }

      if (count > 5) {
        return respond(res, 429, {
          error: "You've reached the hourly message limit. Please try later."
        });
      }

      const item = {
        id: randomUUID(),
        name,
        message,
        category,
        status: "pending",
        createdAt: new Date().toISOString()
      };

      await redis.set(`${PREFIX}item:${item.id}`, item);
      await redis.lpush(LIST, item.id);

      return respond(res, 200, {
        success: true,
        message: "Your message is awaiting approval."
      });
    }

    if (action === "public") {
      const ids = await redis.lrange(APPROVED, 0, 99);

      const items = await Promise.all(
        ids.map(id => redis.get(`${PREFIX}item:${id}`))
      );

      return respond(res, 200, {
        messages: items
          .filter(item => item?.status === "approved")
          .map(safeMessage)
      });
    }

    if (
      !authorized(req.body?.password)
    ) {
      return respond(res, 401, {
        error: "Invalid admin password or missing server configuration."
      });
    }

    if (action === "admin-list") {
      const ids = await redis.lrange(LIST, 0, 499);

      const items = await Promise.all(
        ids.map(id => redis.get(`${PREFIX}item:${id}`))
      );

      return respond(res, 200, {
        messages: items.filter(Boolean)
      });
    }

    if (action === "moderate") {
      const id = clean(req.body?.id, 50);
      const decision = clean(req.body?.decision, 20);

      if (
        !/^[0-9a-f-]{36}$/i.test(id) ||
        !["approve", "reject"].includes(decision)
      ) {
        return respond(res, 400, {
          error: "Invalid moderation request."
        });
      }

      const key = `${PREFIX}item:${id}`;
      const item = await redis.get(key);

      if (!item) {
        return respond(res, 404, {
          error: "Message not found."
        });
      }

      if (decision === "approve") {
        item.status = "approved";
        await redis.set(key, item);
        await redis.lrem(APPROVED, 0, id);
        await redis.lpush(APPROVED, id);
      } else {
        item.status = "rejected";
        await redis.set(key, item);
        await redis.lrem(APPROVED, 0, id);
      }

      return respond(res, 200, {
        success: true,
        status: item.status
      });
    }

    return respond(res, 400, {
      error: "Unknown action."
    });

  } catch (error) {
    console.error("Reception Wall:", error);

    return respond(res, 500, {
      error: "The Reception Wall is temporarily unavailable."
    });
  }
}
