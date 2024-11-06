"use strict";
// src/config/redis.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const redis_1 = require("redis");
exports.client = (0, redis_1.createClient)({
    url: process.env.REDIS_URL,
});
exports.client.connect();
