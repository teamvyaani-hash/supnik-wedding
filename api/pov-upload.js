
import {
  handleUpload
} from "@vercel/blob/client";

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

const MAX_FILE_SIZE = 20 * 1024 * 1024;

function send(res, status, data) {
  return res.status(status).json(data);
}

function cleanName(value) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 30);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");

    return send(res, 405, {
      error: "Method not allowed"
    });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return send(res, 503, {
      error: "Photo storage is not configured"
    });
  }

  try {
    const result = await handleUpload({
      body: req.body,
      request: req,

      onBeforeGenerateToken: async (
        pathname,
        clientPayload
      ) => {
        let payload;

        try {
          payload = JSON.parse(
            clientPayload || "{}"
          );
        } catch {
          throw new Error(
            "Invalid upload information"
          );
        }

        const event = payload.event;
        const name = cleanName(payload.name);

        if (!EVENTS.has(event)) {
          throw new Error(
            "Please select a valid celebration"
          );
        }

        if (!name) {
          throw new Error(
            "Please enter your name"
          );
        }

        // Require uploads to use the expected
        // event-specific folder structure.
        const expectedPrefix =
          "wedding-pov/" + event + "/";

        if (
          typeof pathname !== "string" ||
          !pathname.startsWith(expectedPrefix)
        ) {
          throw new Error(
            "Invalid upload destination"
          );
        }

        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_FILE_SIZE,
          addRandomSuffix: true,
          allowOverwrite: false,

          tokenPayload: JSON.stringify({
            event,
            name,
            submissionId: randomUUID()
          })
        };
      },

      onUploadCompleted: async ({
        blob,
        tokenPayload
      }) => {
        // This callback runs after Blob reports
        // an upload completion.
        //
        // In the next step, we will record
        // completed uploads in a private database
        // for moderation and administration.
        //
        // Never publish blob URLs here.
        console.log(
          "Wedding photo upload completed",
          {
            pathname: blob.pathname,
            tokenPayloadPresent:
              Boolean(tokenPayload)
          }
        );
      }
    });

    return send(res, 200, result);

  } catch (error) {
    console.error(
      "Wedding upload error:",
      error
    );

    return send(res, 400, {
      error:
        "Unable to authorize the upload. " +
        "Please try again."
    });
  }
}
