
import { get } from "@vercel/blob";
import { Readable } from "node:stream";

const EVENTS = new Set(["engagement", "reception", "muhurtham"]);
const ID_PATTERN = /^[a-f0-9-]{36}$/i;
const MAX_RECORDS = 1000;

function json(res, status, data) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  return res.status(status).json(data);
}

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error("Redis is not configured");
  }

  return { url: url.replace(/\/$/, ""), token };
}

async function redis(command) {
  const { url, token } = redisConfig();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Redis request failed");
  }

  const data = await response.json();

  if (data.error) {
    throw new Error("Redis command failed");
  }

  return data.result;
}

function parseRecord(raw) {
  let record = raw;

  for (let i = 0; i < 2 && typeof record === "string"; i++) {
    try {
      record = JSON.parse(record);
    } catch {
      return null;
    }
  }

  if (!record || typeof record !== "object") return null;
  if (!ID_PATTERN.test(String(record.uploadId || ""))) return null;
  if (!EVENTS.has(record.event)) return null;
  if (record.status !== "approved") return null;

  if (
    typeof record.pathname !== "string" ||
    !record.pathname.startsWith(`wedding-pov/${record.event}/`)
  ) {
    return null;
  }

  return record;
}

async function getApprovedPhoto(id) {
  if (!ID_PATTERN.test(id)) return null;

  const raw = await redis(["GET", `ns:pov:photo:${id}`]);
  return parseRecord(raw);
}

async function getApprovedPhotos() {
  const keys = [];
  let cursor = "0";
  let scans = 0;

  do {
    const result = await redis([
      "SCAN",
      cursor,
      "MATCH",
      "ns:pov:photo:*",
      "COUNT",
      "100"
    ]);

    if (!Array.isArray(result) || !Array.isArray(result[1])) {
      throw new Error("Invalid Redis scan response");
    }

    cursor = String(result[0]);

    for (const key of result[1]) {
      if (keys.length < MAX_RECORDS) keys.push(key);
    }

    scans++;
  } while (cursor !== "0" && scans < 100 && keys.length < MAX_RECORDS);

  const records = [];
  const uniqueKeys = [...new Set(keys)];

  for (let i = 0; i < uniqueKeys.length; i += 100) {
    const batch = uniqueKeys.slice(i, i + 100);
    const values = await redis(["MGET", ...batch]);

    for (const raw of values || []) {
      const photo = parseRecord(raw);

      if (photo) {
        records.push({
          id: photo.uploadId,
          guestName: String(photo.guestName || "Guest").slice(0, 60),
          event: photo.event,
          uploadedAt: photo.uploadedAt || null,
          imageUrl: `/api/wedding-wall?action=image&id=${encodeURIComponent(photo.uploadId)}`
        });
      }
    }
  }

  records.sort((a, b) =>
    String(b.uploadedAt).localeCompare(String(a.uploadedAt))
  );

  return {
    photos: records,
    hasMoreRecords: cursor !== "0" || uniqueKeys.length >= MAX_RECORDS
  };
}

async function serveImage(req, res) {
  const id = String(req.query.id || "");
  const photo = await getApprovedPhoto(id);

  if (!photo) {
    return json(res, 404, { error: "Photo unavailable" });
  }

  const blob = await get(photo.pathname, { access: "private" });

  if (!blob || blob.statusCode !== 200 || !blob.stream) {
    return json(res, 404, { error: "Image unavailable" });
  }

  const type = String(blob.blob?.contentType || "");

  const allowedTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif"
  ]);

  res.setHeader(
    "Content-Type",
    allowedTypes.has(type) ? type : "application/octet-stream"
  );
  res.setHeader("Content-Disposition", "inline");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Security-Policy", "default-src 'none'; sandbox");

  return Readable.fromWeb(blob.stream).pipe(res);
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return json(res, 405, { error: "Method not allowed" });
  }

  if (
    !process.env.BLOB_READ_WRITE_TOKEN ||
    !process.env.UPSTASH_REDIS_REST_KV_REST_API_URL ||
    !process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN
  ) {
    return json(res, 503, { error: "Gallery unavailable" });
  }

  try {
    const action = String(req.query.action || "list");

    if (action === "list") {
      return json(res, 200, await getApprovedPhotos());
    }

    if (action === "image") {
      return await serveImage(req, res);
    }

    return json(res, 400, { error: "Unknown action" });
  } catch (error) {
    console.error("Wedding Wall error:", error?.message);
    return json(res, 500, { error: "Could not load gallery" });
  }
}
