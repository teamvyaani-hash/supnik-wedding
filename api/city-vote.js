const BANGALORE_KEY = "wedding:city:bangalore";
const CHENNAI_KEY = "wedding:city:chennai";


function getRedisConfig() {
  return {
    url:
      process.env.UPSTASH_REDIS_REST_KV_REST_API_URL ||
      process.env.UPSTASH_REDIS_REST_URL ||
      process.env.KV_REST_API_URL ||
      "",

    token:
      process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN ||
      process.env.UPSTASH_REDIS_REST_TOKEN ||
      process.env.KV_REST_API_TOKEN ||
      ""
  };
}


async function redisCommand(command) {

  const { url, token } =
    getRedisConfig();


  if (!url || !token) {
    throw new Error(
      "Redis environment variables are missing."
    );
  }


  const response =
    await fetch(
      url,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${token}`,

          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(command)
      }
    );


  const data =
    await response.json();


  if (
    !response.ok ||
    data.error
  ) {

    throw new Error(
      data.error ||
      "Redis request failed."
    );
  }


  return data.result;
}


function numberValue(value) {

  const parsed =
    Number(value);


  return (
    Number.isFinite(parsed) &&
    parsed > 0
  )
    ? parsed
    : 0;
}


function validCity(value) {

  return (
    value === "bangalore" ||
    value === "chennai"
  );
}


function validVoterId(value) {

  return (
    typeof value === "string" &&
    /^[a-zA-Z0-9-]{8,100}$/.test(value)
  );
}


async function getCounts() {

  const result =
    await redisCommand([
      "MGET",
      BANGALORE_KEY,
      CHENNAI_KEY
    ]);


  return {
    bangalore:
      numberValue(result?.[0]),

    chennai:
      numberValue(result?.[1])
  };
}


export default async function handler(
  request,
  response
) {

  response.setHeader(
    "Cache-Control",
    "no-store, max-age=0"
  );


  /* OPTIONS */

  if (request.method === "OPTIONS") {

    response
      .status(204)
      .end();

    return;
  }


  /* GET SCORE */

  if (request.method === "GET") {

    try {

      const counts =
        await getCounts();


      response
        .status(200)
        .json(counts);

    } catch (error) {

      console.error(
        "City scoreboard GET failed:",
        error
      );


      response
        .status(503)
        .json({
          error:
            "scoreboard_unavailable"
        });
    }


    return;
  }


  /* ONLY POST AFTER THIS */

  if (request.method !== "POST") {

    response.setHeader(
      "Allow",
      "GET, POST, OPTIONS"
    );


    response
      .status(405)
      .json({
        error:
          "method_not_allowed"
      });


    return;
  }


  let body =
    request.body || {};


  if (
    typeof body === "string"
  ) {

    try {

      body =
        JSON.parse(body);

    } catch (error) {

      body = {};
    }
  }


  const city =
    body.city;

  const voterId =
    body.voterId;


  if (
    !validCity(city) ||
    !validVoterId(voterId)
  ) {

    response
      .status(400)
      .json({
        error:
          "invalid_vote"
      });


    return;
  }


  const voterKey =
    `wedding:city:voter:${voterId}`;


  /*
    Atomic vote update.

    - First vote adds one.
    - Voting for same city again changes nothing.
    - Transfer removes old vote and adds new vote.
  */

  const script = `
    local current = redis.call("GET", KEYS[1])
    local target = ARGV[1]

    if current == target then

      local bangalore =
        tonumber(
          redis.call("GET", KEYS[2]) or "0"
        )

      local chennai =
        tonumber(
          redis.call("GET", KEYS[3]) or "0"
        )

      return {
        bangalore,
        chennai,
        target
      }

    end


    if current == "bangalore" then

      local existing =
        tonumber(
          redis.call("GET", KEYS[2]) or "0"
        )

      if existing > 0 then
        redis.call(
          "DECR",
          KEYS[2]
        )
      end


    elseif current == "chennai" then

      local existing =
        tonumber(
          redis.call("GET", KEYS[3]) or "0"
        )

      if existing > 0 then
        redis.call(
          "DECR",
          KEYS[3]
        )
      end

    end


    redis.call(
      "SET",
      KEYS[1],
      target
    )


    if target == "bangalore" then

      redis.call(
        "INCR",
        KEYS[2]
      )

    else

      redis.call(
        "INCR",
        KEYS[3]
      )

    end


    local bangalore =
      tonumber(
        redis.call("GET", KEYS[2]) or "0"
      )

    local chennai =
      tonumber(
        redis.call("GET", KEYS[3]) or "0"
      )


    return {
      bangalore,
      chennai,
      target
    }
  `;


  try {

    const result =
      await redisCommand([
        "EVAL",
        script,
        3,
        voterKey,
        BANGALORE_KEY,
        CHENNAI_KEY,
        city
      ]);


    response
      .status(200)
      .json({

        bangalore:
          numberValue(
            result?.[0]
          ),

        chennai:
          numberValue(
            result?.[1]
          ),

        city:
          result?.[2] ||
          city
      });


  } catch (error) {

    console.error(
      "City scoreboard POST failed:",
      error
    );


    response
      .status(503)
      .json({
        error:
          "scoreboard_unavailable"
      });
  }
}
