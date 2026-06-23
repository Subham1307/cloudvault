// lib/redis.ts

import { createClient } from "redis";

declare global {
  // eslint-disable-next-line no-var
  var redis: ReturnType<typeof createClient> | undefined;
}

let redis: ReturnType<typeof createClient>;

const getRedisClient = async () => {
  if (globalThis.redis) return globalThis.redis;

  const client = createClient({
    url: process.env.REDIS_URL,
  });

  client.on("error", (err) => console.error("Redis Client Error:", err));
  client.on("connect", () => console.log("Redis Connected"));

  await client.connect();

  globalThis.redis = client as any;  

  return client;
};

export default getRedisClient;