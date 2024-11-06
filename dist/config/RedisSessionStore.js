"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_session_1 = require("express-session");
const redis_1 = require("redis");
class RedisSessionStore extends express_session_1.Store {
    constructor() {
        super();
        this.client = (0, redis_1.createClient)({
            url: process.env.REDIS_URL,
            socket: {
                reconnectStrategy: (retries) => Math.min(retries * 500, 5000), // Retry logic with exponential backoff
            },
        });
        this.client.connect();
    }
    get(sid, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield this.client.get(`sid:${sid}`);
                callback(null, session ? JSON.parse(session) : null);
            }
            catch (error) {
                callback(error);
            }
        });
    }
    set(sid_1, session_1) {
        return __awaiter(this, arguments, void 0, function* (sid, session, callback = () => { }) {
            try {
                const ttl = session.cookie.maxAge ? session.cookie.maxAge / 1000 : 86400; // default to 1 day
                yield this.client.set(`sid:${sid}`, JSON.stringify(session), { EX: ttl });
                callback();
            }
            catch (error) {
                callback(error);
            }
        });
    }
    destroy(sid_1) {
        return __awaiter(this, arguments, void 0, function* (sid, callback = () => { }) {
            try {
                yield this.client.del(`sid:${sid}`);
                callback();
            }
            catch (error) {
                callback(error);
            }
        });
    }
}
exports.default = RedisSessionStore;
