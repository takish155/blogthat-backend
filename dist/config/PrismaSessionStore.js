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
const prisma_1 = require("./prisma");
class PrismaSessionStore extends express_session_1.Store {
    constructor() {
        super();
    }
    get(sid, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield prisma_1.prisma.session.findUnique({
                    where: { sid },
                });
                if (session) {
                    return callback(null, JSON.parse(session.data));
                }
                callback(null, null);
            }
            catch (error) {
                callback(error);
            }
        });
    }
    set(sid, session, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const expiresAt = session.cookie.expires
                    ? new Date(session.cookie.expires)
                    : null;
                yield prisma_1.prisma.session.upsert({
                    where: { sid },
                    create: {
                        sid,
                        data: JSON.stringify(session),
                        expiresAt,
                    },
                    update: {
                        data: JSON.stringify(session),
                        expiresAt,
                    },
                });
                if (callback)
                    callback();
            }
            catch (error) {
                if (callback)
                    callback(error);
            }
        });
    }
    destroy(sid, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield prisma_1.prisma.session.findUnique({
                    where: { sid },
                });
                if (!session) {
                    console.log(`Session ${sid} not found`);
                    callback === null || callback === void 0 ? void 0 : callback();
                    return;
                }
                yield prisma_1.prisma.session.delete({
                    where: { sid },
                });
                callback === null || callback === void 0 ? void 0 : callback();
            }
            catch (error) {
                callback === null || callback === void 0 ? void 0 : callback(error);
            }
        });
    }
}
exports.default = PrismaSessionStore;
