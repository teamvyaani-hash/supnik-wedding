
import { Redis } from "@upstash/redis";
import { createHash } from "node:crypto";

const PREFIX = "supnik:wedding-control:v2:";
const MAX_DEVICES = 5;

function key(type, id = "") {
  return PREFIX + type + (id ? ":" + id : "");
}

function hash(value) {
  return createHash("sha256")
    .update(value)
    .digest("hex");
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
    throw new Error("Redis configuration missing");
  }

  return new Redis({ url, token });
}

async function authenticate(req, redis) {
  const authorization = req.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.slice(7);

  if (!/^[a-f0-9]{64}$/.test(token)) {
    return null;
  }

  const session = await redis.get(
    key("session", hash(token))
  );

  if (!session) return null;

  const userId =
    typeof session === "string"
      ? session
      : session.userId;

  if (!userId) return null;

  const user = await redis.get(key("user", userId));

  if (!user) return null;

  const version = Number(user.sessionVersion || 0);

  if (typeof session === "string") {
    if (version !== 0) return null;
  } else if (Number(session.version) !== version) {
    return null;
  }

  return user;
}

function validSubscription(subscription) {
  if (!subscription ||
      typeof subscription !== "object" ||
      Array.isArray(subscription)) {
    return false;
  }

  const { endpoint, keys } = subscription;

  if (typeof endpoint !== "string" ||
      endpoint.length > 2048) {
    return false;
  }

  try {
    const url = new URL(endpoint);

    if (url.protocol !== "https:" ||
        url.username ||
        url.password ||
        url.port ||
        !url.hostname.includes(".")) {
      return false;
    }
  } catch {
    return false;
  }

  if (!keys ||
      typeof keys.p256dh !== "string" ||
      typeof keys.auth !== "string") {
    return false;
  }

  if (!/^[A-Za-z0-9_-]{80,120}$/.test(keys.p256dh) ||
      !/^[A-Za-z0-9_-]{15,40}$/.test(keys.auth)) {
    return false;
  }

  return true;
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

  try {
    const redis = redisClient();
    const user = await authenticate(req, redis);

    if (!user) {
      return send(res, 401, {
        error: "Please sign in again."
      });
    }

    const action = req.body?.action;

    if (action === "config") {
      const publicKey = process.env.VAPID_PUBLIC_KEY;

      if (!publicKey) {
        return send(res, 503, {
          error: "Push notifications are not configured"
        });
      }

      return send(res, 200, {
        publicKey
      });
    }

    if (action === "subscribe") {
      const subscription = req.body?.subscription;

      if (!validSubscription(subscription)) {
        return send(res, 400, {
          error: "Invalid push subscription"
        });
      }

      const deviceId = hash(subscription.endpoint);
      const setKey = key("pushDevices", user.id);
      const deviceKey = key(
        "pushSubscription",
        user.id + ":" + deviceId
      );

      const existing = await redis.smembers(setKey);

      if (!existing.includes(deviceId) &&
          existing.length >= MAX_DEVICES) {
        return send(res, 409, {
          error: "Maximum of five devices per account"
        });
      }

      await redis.set(deviceKey, {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth
        },
        createdAt: new Date().toISOString()
      });

      await redis.sadd(setKey, deviceId);

      return send(res, 200, {
        success: true,
        message: "This device is registered for notifications."
      });
    }

    if (action === "unsubscribe") {
      const endpoint = req.body?.endpoint;

      if (typeof endpoint !== "string" ||
          endpoint.length > 2048) {
        return send(res, 400, {
          error: "Invalid endpoint"
        });
      }

      const deviceId = hash(endpoint);

      await redis.del(
        key(
          "pushSubscription",
          user.id + ":" + deviceId
        )
      );

      await redis.srem(
        key("pushDevices", user.id),
        deviceId
      );

      return send(res, 200, {
        success: true
      });
    }

    return send(res, 400, {
      error: "Unknown action"
    });

  } catch (error) {
    console.error(
      "Wedding push error:",
      error.message
    );

    return send(res, 500, {
      error: "Push service temporarily unavailable"
    });
  }
}
