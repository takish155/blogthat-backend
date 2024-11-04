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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../config/prisma");
const Success_1 = __importDefault(require("../util/Success"));
const ThrowError_1 = __importDefault(require("../util/ThrowError"));
const redis_1 = require("../config/redis");
class UserController {
    /**
     * Get authenticated user's info
     *
     */
    static getUserInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if user is cached
                const cachedUser = yield redis_1.client.get("/user/" + req.user);
                // If user is not cached
                if (!cachedUser) {
                    const user = yield prisma_1.prisma.user.findUnique({
                        where: {
                            id: req.user,
                        },
                    });
                    if (!user) {
                        throw new Error("User not found");
                    }
                    yield redis_1.client.set("/user/" + req.user, JSON.stringify(user));
                    return Success_1.default.ok(res, "User found...", {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        joinDate: user.createdAt,
                    });
                }
                return Success_1.default.ok(res, "User found...", JSON.parse(cachedUser));
            }
            catch (error) {
                return ThrowError_1.default.error500(res, error);
            }
        });
    }
    /**
     * Get user info by username
     *
     */
    static getUserInfoByUsername(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if user is cached
                const cachedUser = yield redis_1.client.get("/user/" + req.params.username);
                // If user is not cached
                if (!cachedUser) {
                    const user = yield prisma_1.prisma.user.findUnique({
                        where: { username: req.params.username },
                    });
                    if (!user) {
                        return ThrowError_1.default.error404(res, "User not found...");
                    }
                    yield redis_1.client.set("/user/" + req.params.username, JSON.stringify(user));
                    return Success_1.default.ok(res, "User found...", {
                        id: user.id,
                        username: user.username,
                        joinDate: user.createdAt,
                    });
                }
                return Success_1.default.ok(res, "User found...", JSON.parse(cachedUser));
            }
            catch (error) {
                return ThrowError_1.default.error500(res, error);
            }
        });
    }
    /**
     * Update user username
     */
    static updateUsername(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma_1.prisma.user.update({
                    where: { id: req.user },
                    data: { username: req.body.username },
                });
                // Update public user info in cache
                yield redis_1.client.set("/user/" + user.username, JSON.stringify({
                    id: user.id,
                    username: user.username,
                    joinDate: user.createdAt,
                }));
                // Update private user info in cache
                yield redis_1.client.set("/user/" + user.id, JSON.stringify({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    joinDate: user.createdAt,
                }));
                return Success_1.default.noContent(res);
            }
            catch (error) {
                return ThrowError_1.default.error500(res, error);
            }
        });
    }
    /**
     * Update user email
     *
     */
    static updateEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma_1.prisma.user.update({
                    where: { id: req.user },
                    data: { email: req.body.email },
                });
                // Update private user info in cache
                yield redis_1.client.set("/user/" + user.id, JSON.stringify({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    joinDate: user.createdAt,
                }));
                return Success_1.default.noContent(res);
            }
            catch (error) {
                return ThrowError_1.default.error500(res, error);
            }
        });
    }
    /**
     * Update user password
     *
     */
    static updatePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma_1.prisma.user.update({
                    where: { id: req.user },
                    data: { password: req.body.newPassword },
                });
                yield prisma_1.prisma.session.deleteMany({
                    where: {
                        data: {
                            contains: req.user,
                        },
                        sid: {
                            not: req.sessionID,
                        },
                    },
                });
                return Success_1.default.noContent(res);
            }
            catch (error) {
                return ThrowError_1.default.error500(res, error);
            }
        });
    }
}
exports.default = UserController;
