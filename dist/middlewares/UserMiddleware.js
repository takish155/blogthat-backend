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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../config/prisma");
const UserValidation_1 = __importDefault(require("../validation/UserValidation"));
const ThrowError_1 = __importDefault(require("../util/ThrowError"));
const AuthValidation_1 = __importDefault(require("../validation/AuthValidation"));
const { updateEmail, updatePassword, updateUsername } = UserValidation_1.default;
class UserMiddleware {
    /**
     * Middleware for updating username
     *
     */
    static updateUsernameMiddleware(req, res, next) {
        const validation = updateUsername.safeParse(req.body);
        if (!validation.success) {
            return ThrowError_1.default.error400(res, "Validation failed", validation.error.errors);
        }
        next();
    }
    /**
     * Middleware for updating email
     *
     */
    static updateEmailMiddleware(req, res, next) {
        const validation = updateEmail.safeParse(req.body);
        if (!validation.success) {
            return ThrowError_1.default.error400(res, "Validation failed", validation.error.errors);
        }
        next();
    }
    /**
     * Middleware for updating something else
     *
     */
    static updateUserMiddleware(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validation = AuthValidation_1.default.authValidation.password.safeParse(req.body.password);
                if (!validation.success) {
                    return ThrowError_1.default.error400(res, "Validation failed", validation.error.errors);
                }
                const user = yield prisma_1.prisma.user.findUnique({
                    where: { id: req.user },
                });
                if (!user) {
                    return ThrowError_1.default.error400(res, "User not found", null);
                }
                const passwordMatch = yield bcryptjs_1.default.compare(req.body.password, user.password);
                if (!passwordMatch) {
                    return ThrowError_1.default.error400(res, "Password does not match", null);
                }
                next();
            }
            catch (error) {
                return ThrowError_1.default.error500(res, error);
            }
        });
    }
}
exports.default = UserMiddleware;
