"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
class AuthValidation {
}
_a = AuthValidation;
AuthValidation.authValidation = {
    username: zod_1.z
        .string()
        .min(3)
        .max(20)
        .regex(/^[a-zA-Z0-9_-]+$/, { message: "KEYWORD_INVALID" }),
    password: zod_1.z.string().min(6).max(100),
    email: zod_1.z.string().email().max(100),
};
AuthValidation.signInValidation = zod_1.z.object({
    username: _a.authValidation.username,
    password: _a.authValidation.password,
});
AuthValidation.signUpValidation = zod_1.z.object({
    username: _a.authValidation.username,
    email: _a.authValidation.email,
    password: _a.authValidation.password,
    confirmPassword: _a.authValidation.password,
});
exports.default = AuthValidation;
