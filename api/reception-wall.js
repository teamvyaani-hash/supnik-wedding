
function getConfig() {
  const url =
    process.env.UPSTASH_REDIS_REST_KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL;

  const token =
    process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error("Redis REST configuration missing");
  }

  if (!url.startsWith("https://")) {
    throw new Error("Redis REST URL must use HTTPS");
  }

  return { url, token };
}
