// src/config/redis.ts

import { createClient } from "redis";

export const client = createClient({
  url: process.env.REDIS_URL,
});

client.connect();
