
import { Redis } from "@upstash/redis";
import { randomUUID, randomInt } from "node:crypto";

const PREFIX = "ns:reception:v1:";

const MISSIONS = [
  {
    id: "meet-other",
    title: "The Stranger Challenge",
    description: "Introduce yourself to someone you have never met before. Learn their name and exchange guest codes.",
    points: 50
  },
  {
    id: "new-friend",
    title: "Make a New Friend",
    description: "Find someone you would genuinely like to stay in touch with. Chat and exchange codes.",
    points: 30
  },
  {
    id: "marriage-wisdom",
    title: "Marriage Survival Advice",
    description: "Ask another guest for their funniest or most useful marriage advice.",
    points: 40
  },
  {
    id: "food-favourite",
    title: "The Food Debate",
    description: "Ask someone what the best dish at the reception is. Defend your own choice.",
    points: 50
  },
  {
    id: "dance-buddy",
    title: "Dance Floor Ally",
    description: "Find someone to join you on the dance floor, then exchange codes.",
    points: 40
  }
];

const playerKey = id => `${PREFIX}player:${id}`;
const codeKey = code => `${PREFIX}code:${code}`;
const scoreKey = `${PREFIX}leaderboard`;

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function reply(res, status, body) {
  return res.status(status).json(body);
}

// Supports both standard Upstash credentials and the
// existing Vercel integration's prefixed credentials.
// No credentials are hardcoded or exposed to the browser.
function getRedis() {
  const url =
    process.env.UPSTASH_REDIS_REST_KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL;

  const token =
    process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Redis REST credentials are missing. Check Vercel environment variables."
    );
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error(
      "Redis REST URL is invalid. Check the configured Vercel environment variable."
    );
  }

  if (parsedUrl.protocol !== "https:") {
    throw new Error(
      "Redis REST URL must use HTTPS."
    );
  }

  return new Redis({
    url,
    token
  });
}

async function getPlayer(redis, token) {
  if (!/^[0-9a-f-]{36}$/i.test(token)) return null;

  const player = await redis.hgetall(playerKey(token));

  return player?.id === token ? player : null;
}

async function publicPlayer(redis, player) {
  return {
    id: player.id,
    name: player.name,
    code: player.code,
    points: Number(
      (await redis.zscore(scoreKey, player.id)) || 0
    )
  };
}

async function getLeaderboard(redis) {
  const ids = await redis.zrange(scoreKey, 0, 19, {
    rev: true
  });

  const players = await Promise.all(
    ids.map(async id => {
      const player = await redis.hgetall(playerKey(id));

      if (!player) return null;

      return {
        name: player.name,
        points: Number(
          (await redis.zscore(scoreKey, id)) || 0
        )
      };
    })
  );

  return {
    players: players.filter(Boolean)
  };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return reply(res, 405, {
      error: "POST required"
    });
  }

  const origin = req.headers.origin;

  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.host) {
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

  const action = clean(req.body?.action);
  const token = clean(req.body?.token);

  try {
    const redis = getRedis();

    if (action === "join") {
      const name = clean(req.body?.name)
        .replace(/\s+/g, " ")
        .slice(0, 30);

      if (name.length < 2) {
        return reply(res, 400, {
          error: "Please enter at least two characters."
        });
      }

      const forwarded = req.headers["x-forwarded-for"];

      const ip = clean(
        typeof forwarded === "string"
          ? forwarded.split(",")[0]
          : ""
      ) || "unknown";

      const rateKey = `${PREFIX}rate:${ip}`;
      const attempts = await redis.incr(rateKey);

      if (attempts === 1) {
        await redis.expire(rateKey, 3600);
      }

      if (attempts > 10) {
        return reply(res, 429, {
          error: "Too many registrations. Try again later."
        });
      }

      const id = randomUUID();
      let code = null;

      for (let attempt = 0; attempt < 10; attempt++) {
        const candidate = String(
          randomInt(100000, 1000000)
        );

        const reserved = await redis.set(
          codeKey(candidate),
          id,
          { nx: true }
        );

        if (reserved === "OK" || reserved === true) {
          code = candidate;
          break;
        }
      }

      if (!code) {
        return reply(res, 503, {
          error: "Could not create a guest code. Please retry."
        });
      }

      const player = { id, name, code };

      await redis.hset(playerKey(id), player);

      await redis.zadd(scoreKey, {
        score: 0,
        member: id
      });

      return reply(res, 200, {
        token: id,
        player: await publicPlayer(redis, player),
        missions: MISSIONS
      });
    }

    const player = await getPlayer(redis, token);

    if (!player) {
      return reply(res, 401, {
        error: "Player not found. Please register again."
      });
    }

    if (action === "state") {
      const completed = await redis.smembers(
        `${PREFIX}done:${player.id}`
      ) || [];

      return reply(res, 200, {
        player: await publicPlayer(redis, player),
        missions: MISSIONS,
        completed,
        leaderboard: await getLeaderboard(redis)
      });
    }

    if (action === "claim") {
      const mission = MISSIONS.find(
        item => item.id === clean(req.body?.missionId)
      );

      const partnerCode = clean(req.body?.partnerCode);

      if (!mission || !/^\d{6}$/.test(partnerCode)) {
        return reply(res, 400, {
          error: "Enter a valid six-digit guest code."
        });
      }

      const partnerId = await redis.get(
        codeKey(partnerCode)
      );

      if (!partnerId || partnerId === player.id) {
        return reply(res, 400, {
          error: "Use another registered guest's code."
        });
      }

      const partner = await redis.hgetall(
        playerKey(partnerId)
      );

      if (!partner) {
        return reply(res, 400, {
          error: "Guest code not found."
        });
      }

      const claimed = await redis.eval(
        `
        local added = redis.call(
          'SADD', KEYS[1], ARGV[1]
        )
        if added == 0 then
          return 0
        end
        redis.call(
          'ZINCRBY', KEYS[2], ARGV[2], ARGV[3]
        )
        return 1
        `,
        [
          `${PREFIX}done:${player.id}`,
          scoreKey
        ],
        [
          mission.id,
          mission.points,
          player.id
        ]
      );

      if (Number(claimed) !== 1) {
        return reply(res, 409, {
          error: "You already completed this mission."
        });
      }

      return reply(res, 200, {
        success: true,
        points: mission.points,
        player: await publicPlayer(redis, player),
        leaderboard: await getLeaderboard(redis)
      });
    }

    return reply(res, 400, {
      error: "Unknown action."
    });

  } catch (error) {
    console.error("Reception API:", error);

    return reply(res, 500, {
      error: "Reception server error. Please try again."
    });
  }
}
