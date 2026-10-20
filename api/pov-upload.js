
import { handleUpload } from "@vercel/blob/client";
import { randomUUID } from "node:crypto";

const EVENTS = new Set([
  "engagement",
  "reception",
  "muhurtham"
]);

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif"
];

const MAX_SIZE = 20 * 1024 * 1024;
const MAX_BATCH = 20;
const MAX_IP_HOURLY = 100;
const MAX_GLOBAL_HOURLY = 3000;

function reply(res, status, message) {
  return res.status(status).json({
    error: message
  });
}

function redisConfig() {
  const url =
    process.env.UPSTASH_REDIS_REST_KV_REST_API_URL;

  const token =
    process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error("Redis is not configured");
  }

  return {
    url: url.replace(/\/$/, ""),
    token
  };
}

async function redisPipeline(commands) {
  const { url, token } = redisConfig();

  const response = await fetch(
    `${url}/pipeline`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(commands)
    }
  );

  if (!response.ok) {
    throw new Error("Redis request failed");
  }

  const results = await response.json();

  if (
    !Array.isArray(results) ||
    results.some(item => item.error)
  ) {
    throw new Error("Redis operation failed");
  }

  return results.map(item => item.result);
}

async function incrementWithExpiry(
  key,
  expirySeconds
) {
  const results = await redisPipeline([
    ["INCR", key],
    ["EXPIRE", key, expirySeconds]
  ]);

  const count = Number(results[0]);

  if (!Number.isFinite(count)) {
    throw new Error("Invalid Redis response");
  }

  return count;
}

function getClientIP(req) {
  const forwarded =
    req.headers["x-forwarded-for"];

  const value = Array.isArray(forwarded)
    ? forwarded[0]
    : forwarded;

  return String(value || "unknown")
    .split(",")[0]
    .trim()
    .slice(0, 100);
}

async function checkLimits(req, batchId) {
  const ip = getClientIP(req);

  const hour = Math.floor(
    Date.now() / 3600000
  );

  const ipCount = await incrementWithExpiry(
    `ns:pov:ip:${hour}:${ip}`,
    7200
  );

  if (ipCount > MAX_IP_HOURLY) {
    throw new Error("Upload limit reached");
  }

  const globalCount =
    await incrementWithExpiry(
      `ns:pov:global:${hour}`,
      7200
    );

  if (globalCount > MAX_GLOBAL_HOURLY) {
    throw new Error(
      "Wedding upload capacity reached"
    );
  }

  const batchCount =
    await incrementWithExpiry(
      `ns:pov:batch:${batchId}`,
      86400
    );

  if (batchCount > MAX_BATCH) {
    throw new Error(
      "Maximum 20 photos per batch"
    );
  }
}

function validatePayload(raw) {
  let payload;

  try {
    payload = JSON.parse(raw || "{}");
  } catch {
    throw new Error(
      "Invalid upload information"
    );
  }

  const event = payload.event;

  const name = String(payload.name || "")
    .trim()
    .replace(/[<>]/g, "")
    .slice(0, 60);

  const batchId =
    String(payload.batchId || "");

  if (!EVENTS.has(event)) {
    throw new Error("Invalid wedding event");
  }

  if (!name) {
    throw new Error("Guest name is required");
  }

  if (
    !/^[a-f0-9-]{36}$/i.test(batchId)
  ) {
    throw new Error("Invalid upload batch");
  }

  return { event, name, batchId };
}

function validatePath(pathname, event) {
  const prefix = `wedding-pov/${event}/`;

  if (
    typeof pathname !== "string" ||
    !pathname.startsWith(prefix)
  ) {
    throw new Error(
      "Invalid upload destination"
    );
  }

  const filename = pathname.slice(
    prefix.length
  );

  if (
    !filename ||
    filename.includes("/") ||
    filename.includes("\\") ||
    filename.includes("..") ||
    filename.length > 180 ||
    !/\.(jpe?g|png|webp|heic|heif)$/i.test(
      filename
    )
  ) {
    throw new Error(
      "Invalid photo filename"
    );
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");

    return reply(
      res,
      405,
      "Method not allowed"
    );
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return reply(
      res,
      503,
      "Private photo storage unavailable"
    );
  }

  try {
    const result = await handleUpload({
      body: req.body,
      request: req,

      onBeforeGenerateToken: async (
        pathname,
        clientPayload
      ) => {
        const {
          event,
          name,
          batchId
        } = validatePayload(clientPayload);

        validatePath(pathname, event);

        await checkLimits(req, batchId);

        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_SIZE,
          addRandomSuffix: true,
          allowOverwrite: false,

          tokenPayload: JSON.stringify({
            event,
            name,
            batchId,
            uploadId: randomUUID()
          })
        };
      },

      onUploadCompleted: async ({
        blob,
        tokenPayload
      }) => {
        const metadata =
          JSON.parse(tokenPayload || "{}");

        if (
          !EVENTS.has(metadata.event) ||
          typeof blob.pathname !== "string" ||
          !blob.pathname.startsWith(
            `wedding-pov/${metadata.event}/`
          )
        ) {
          throw new Error(
            "Invalid upload completion"
          );
        }

        const record = {
          uploadId: metadata.uploadId,
          event: metadata.event,
          guestName: metadata.name,
          batchId: metadata.batchId,
          pathname: blob.pathname,
          status: "pending",
          uploadedAt: new Date().toISOString()
        };

        const { url, token } = redisConfig();

        const response = await fetch(
          `${url}/set/ns:pov:photo:${metadata.uploadId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(
              JSON.stringify(record)
            )
          }
        );

        if (!response.ok) {
          throw new Error(
            "Could not save photo record"
          );
        }

        // Keep the private Blob URL out
        // of all public responses.
      }
    });

    return res.status(200).json(result);

  } catch (error) {
    console.error(
      "POV upload error:",
      error
    );

    return reply(
      res,
      400,
      "Unable to process upload request"
    );
  }
}
