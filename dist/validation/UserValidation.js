"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const AuthValidation_1 = __importDefault(require("./AuthValidation"));
const { authValidation } = AuthValidation_1.default;
class UserValidation {
}
UserValidation.updateUsername = zod_1.z.object({
    username: authValidation.username,
    password: authValidation.password,
});
UserValidation.updateEmail = zod_1.z.object({
    email: authValidation.email,
    password: authValidation.password,
});
UserValidation.updatePassword = zod_1.z.object({
    password: authValidation.password,
    newPassword: authValidation.password,
});
exports.default = UserValidation;
