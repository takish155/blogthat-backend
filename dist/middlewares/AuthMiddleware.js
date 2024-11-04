"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthValidation_1 = __importDefault(require("../validation/AuthValidation"));
const checkSession_1 = require("../util/checkSession");
const ThrowError_1 = __importDefault(require("../util/ThrowError"));
class AuthMiddleware {
    static signUpMiddleware(req, res, next) {
        const validation = AuthValidation_1.default.signUpValidation.safeParse(req.body);
        if (!validation.success) {
            return ThrowError_1.default.error400(res, "Invalid sign up", validation.error.errors);
        }
        next();
    }
    /**
     * Checks if user is authenticated
     */
    static authMiddleware(req, res, next) {
        const session = (0, checkSession_1.checkSession)(req);
        if (!session) {
            return ThrowError_1.default.error401(res, "Unauthorized");
        }
        next();
    }
}
exports.default = AuthMiddleware;
