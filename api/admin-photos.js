
import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { Readable } from "node:stream";
import { get } from "@vercel/blob";

const COOKIE = "ns_photo_admin";
const SESSION_SECONDS = 8 * 60 * 60;
const MAX_LOGIN_ATTEMPTS = 8;
const EVENTS = new Set(["engagement", "reception", "muhurtham"]);
const STATUSES = new Set(["pending", "approved", "rejected"]);
const ID_PATTERN = /^[a-f0-9-]{36}$/i;

function respond(res, status, data) {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  return res.status(status).json(data);
}

function configured() {
  return Boolean(
    process.env.WEDDING_ADMIN_PASSWORD &&
    process.env.WEDDING_ADMIN_SESSION_SECRET?.length >= 32 &&
    process.env.UPSTASH_REDIS_REST_KV_REST_API_URL &&
    process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN &&
    process.env.BLOB_READ_WRITE_TOKEN
  );
}

function redisSettings() {
  return {
    url: process.env.UPSTASH_REDIS_REST_KV_REST_API_URL.replace(/\/$/, ""),
    token: process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN
  };
}

async function redis(command) {
  const { url, token } = redisSettings();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command),
    cache: "no-store"
  });

  if (!response.ok) throw new Error("Redis request failed");

  const data = await response.json();
  if (data.error) throw new Error("Redis command failed");

  return data.result;
}

function secureCompare(a, b) {
  const first = createHash("sha256").update(String(a)).digest();
  const second = createHash("sha256").update(String(b)).digest();
  return timingSafeEqual(first, second);
}

function signature(value) {
  return createHmac(
    "sha256",
    process.env.WEDDING_ADMIN_SESSION_SECRET
  ).update(value).digest("hex");
}

function makeSession() {
  const expires = String(Date.now() + SESSION_SECONDS * 1000);
  return `${expires}.${signature(expires)}`;
}

function parseCookies(req) {
  const cookies = {};

  for (const entry of String(req.headers.cookie || "").split(";")) {
    const index = entry.indexOf("=");
    if (index < 0) continue;

    cookies[entry.slice(0, index).trim()] = entry.slice(index + 1).trim();
  }

  return cookies;
}

function authenticated(req) {
  const value = parseCookies(req)[COOKIE];
  if (!value) return false;

  const separator = value.indexOf(".");
  if (separator < 1) return false;

  const expires = value.slice(0, separator);
  const suppliedSignature = value.slice(separator + 1);

  if (!/^\d{13}$/.test(expires)) return false;
  if (Number(expires) <= Date.now()) return false;
  if (Number(expires) > Date.now() + SESSION_SECONDS * 1000) return false;

  return secureCompare(suppliedSignature, signature(expires));
}

function setSessionCookie(res, value, maxAge) {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE}=${value}; Path=/api/admin-photos; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`
  );
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  const host = req.headers.host;

  if (typeof origin !== "string" || typeof host !== "string") return false;

  try {
    const parsed = new URL(origin);
    return parsed.protocol === "https:" && parsed.host === host;
  } catch {
    return false;
  }
}

function ipAddress(req) {
  const forwarded = req.headers["x-forwarded-for"];

  return String(
    Array.isArray(forwarded) ? forwarded[0] : forwarded || "unknown"
  ).split(",")[0].trim().slice(0, 100);
}

async function loginAllowed(req) {
  const key = `ns:admin:login:${createHash("sha256")
    .update(ipAddress(req)).digest("hex")}`;

  const attempts = Number(await redis(["INCR", key]));

  if (attempts === 1) {
    await redis(["EXPIRE", key, 900]);
  }

  return attempts <= MAX_LOGIN_ATTEMPTS;
}

function parseRecord(raw) {
  if (raw == null) return null;

  let value = raw;

  for (let i = 0; i < 2 && typeof value === "string"; i++) {
    try {
      value = JSON.parse(value);
    } catch {
      return null;
    }
  }

  if (!value || typeof value !== "object") return null;
  if (!ID_PATTERN.test(String(value.uploadId || ""))) return null;
  if (!EVENTS.has(value.event)) return null;
  if (!STATUSES.has(value.status)) return null;
  if (typeof value.pathname !== "string") return null;

  if (!value.pathname.startsWith(`wedding-pov/${value.event}/`)) {
    return null;
  }

  return value;
}

function recordKey(id) {
  return `ns:pov:photo:${id}`;
}

async function readRecord(id) {
  if (!ID_PATTERN.test(String(id || ""))) return null;

  return parseRecord(await redis(["GET", recordKey(id)]));
}

async function listRecords() {
  const keys = [];
  let cursor = "0";
  let iterations = 0;

  do {
    const result = await redis([
      "SCAN", cursor, "MATCH", "ns:pov:photo:*", "COUNT", "100"
    ]);

    if (!Array.isArray(result) || result.length < 2) {
      throw new Error("Invalid Redis scan result");
    }

    cursor = String(result[0]);

    for (const key of result[1] || []) {
      if (keys.length < 1000) keys.push(key);
    }

    iterations++;
  } while (cursor !== "0" && iterations < 100 && keys.length < 1000);

  const uniqueKeys = [...new Set(keys)];
  const photos = [];

  for (let i = 0; i < uniqueKeys.length; i += 100) {
    const chunk = uniqueKeys.slice(i, i + 100);
    const values = await redis(["MGET", ...chunk]);

    for (const raw of values || []) {
      const record = parseRecord(raw);

      if (record) {
        photos.push({
          uploadId: record.uploadId,
          event: record.event,
          guestName: String(record.guestName || "Guest").slice(0, 60),
          status: record.status,
          featured: record.status === "approved" && record.featured === true,
          uploadedAt: record.uploadedAt || null
        });
      }
    }
  }

  photos.sort((a, b) =>
    String(b.uploadedAt).localeCompare(String(a.uploadedAt))
  );

  return {
    photos,
    truncated: cursor !== "0" || uniqueKeys.length >= 1000
  };
}

export default async function handler(req, res) {
  if (!configured()) {
    return respond(res, 503, {
      error: "Admin service is not configured."
    });
  }

  const action = String(req.query.action || "");

  if (req.method === "POST") {
    if (!sameOrigin(req)) {
      return respond(res, 403, {
        error: "Request origin not allowed."
      });
    }

    if (!String(req.headers["content-type"] || "")
      .toLowerCase().startsWith("application/json")) {
      return respond(res, 415, { error: "JSON required." });
    }
  }

  try {
    if (req.method === "POST" && action === "login") {
      if (!(await loginAllowed(req))) {
        return respond(res, 429, {
          error: "Too many login attempts. Try again in 15 minutes."
        });
      }

      const supplied = req.body?.password;

      if (
        typeof supplied !== "string" ||
        supplied.length > 512 ||
        !secureCompare(supplied, process.env.WEDDING_ADMIN_PASSWORD)
      ) {
        return respond(res, 401, { error: "Incorrect password." });
      }

      setSessionCookie(res, makeSession(), SESSION_SECONDS);
      return respond(res, 200, { ok: true });
    }

    if (req.method === "POST" && action === "logout") {
      setSessionCookie(res, "", 0);
      return respond(res, 200, { ok: true });
    }

    if (!authenticated(req)) {
      return respond(res, 401, { error: "Please sign in." });
    }

    if (req.method === "GET" && action === "session") {
      return respond(res, 200, { authenticated: true });
    }

    if (req.method === "GET" && action === "list") {
      return respond(res, 200, await listRecords());
    }

    if (req.method === "GET" && action === "image") {
      const id = String(req.query.id || "");
      const record = await readRecord(id);

      if (!record) {
        return respond(res, 404, { error: "Photo not found." });
      }

      const result = await get(record.pathname, { access: "private" });

      if (!result || result.statusCode !== 200 || !result.stream) {
        return respond(res, 404, { error: "Image unavailable." });
      }

      const type = String(
        result.blob?.contentType || "application/octet-stream"
      );

      const safeType = [
        "image/jpeg", "image/png", "image/webp",
        "image/heic", "image/heif"
      ].includes(type) ? type : "application/octet-stream";

      res.setHeader("Content-Type", safeType);
      res.setHeader("Cache-Control", "private, no-store");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader(
        "Content-Security-Policy",
        "default-src 'none'; sandbox"
      );
      res.setHeader("Content-Disposition", "inline");

      return Readable.fromWeb(result.stream).pipe(res);
    }

    if (req.method === "POST" && action === "moderate") {
      const id = String(req.body?.id || "");
      const status = String(req.body?.status || "");

      if (!ID_PATTERN.test(id) || !STATUSES.has(status)) {
        return respond(res, 400, {
          error: "Invalid moderation request."
        });
      }

      const record = await readRecord(id);

      if (!record) {
        return respond(res, 404, { error: "Photo not found." });
      }

      const updated = {
        ...record,
        status,
        featured: status === "approved" && record.featured === true,
        reviewedAt: new Date().toISOString()
      };

      await redis(["SET", recordKey(id), JSON.stringify(updated)]);

      return respond(res, 200, {
        ok: true,
        id,
        status,
        featured: updated.featured
      });
    }

    // NEW: Feature or unfeature an approved photo.
    if (req.method === "POST" && action === "feature") {
      const id = String(req.body?.id || "");
      const featured = req.body?.featured;

      if (!ID_PATTERN.test(id) || typeof featured !== "boolean") {
        return respond(res, 400, {
          error: "Invalid featured photo request."
        });
      }

      const record = await readRecord(id);

      if (!record) {
        return respond(res, 404, { error: "Photo not found." });
      }

      if (record.status !== "approved") {
        return respond(res, 400, {
          error: "Only approved photos can be featured."
        });
      }

      const updated = {
        ...record,
        featured,
        featuredAt: featured ? new Date().toISOString() : null
      };

      await redis(["SET", recordKey(id), JSON.stringify(updated)]);

      return respond(res, 200, {
        ok: true,
        id,
        featured
      });
    }

    return respond(res, 405, {
      error: "Unsupported request."
    });
  } catch (error) {
    console.error("Admin photo API failure:", error?.message);

    return respond(res, 500, {
      error: "The request could not be completed. Check Vercel logs."
    });
  }
}
