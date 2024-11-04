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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const checkSession_1 = require("../util/checkSession");
const passport_1 = __importDefault(require("passport"));
const Success_1 = __importDefault(require("../util/Success"));
const ThrowError_1 = __importDefault(require("../util/ThrowError"));
class AuthController {
    /**
     * Signs up a user and creates a session
     */
    static signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, username } = req.body;
                const usernameExist = yield prisma_1.prisma.user.findUnique({
                    where: { username: username },
                });
                if (usernameExist) {
                    return ThrowError_1.default.error400(res, "Username already exist...");
                }
                const emailExist = yield prisma_1.prisma.user.findUnique({
                    where: { email: email },
                });
                if (emailExist) {
                    return ThrowError_1.default.error400(res, "Email already exist...");
                }
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                yield prisma_1.prisma.user.create({
                    data: { email, username, password: hashedPassword },
                });
                next();
            }
            catch (error) {
                console.log(error);
                return ThrowError_1.default.error500(res, error);
            }
        });
    }
    /**
     * Checks if a session is active
     */
    static sessionStatus(req, res) {
        try {
            const session = (0, checkSession_1.checkSession)(req);
            if (!session) {
                return ThrowError_1.default.error401(res, "Unauthorized");
            }
            return Success_1.default.ok(res, "Session active", {
                user: req.user,
            });
        }
        catch (error) {
            console.log(error);
            return ThrowError_1.default.error500(res, error);
        }
    }
    /**
     * Signs out a user
     */
    static signOut(req, res) {
        req.logout((err) => {
            if (err) {
                return ThrowError_1.default.error500(res, err);
            }
            return Success_1.default.noContent(res);
        });
    }
}
/*
 * Signs in a user and creates a session
 *
 */
AuthController.signIn = passport_1.default.authenticate("local", (req, res) => {
    return Success_1.default.ok(res, "Sign in successful", req.user);
});
exports.default = AuthController;
