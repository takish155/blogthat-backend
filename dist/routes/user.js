"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const UserMiddleware_1 = __importDefault(require("../middlewares/UserMiddleware"));
const AuthMiddleware_1 = __importDefault(require("../middlewares/AuthMiddleware"));
const { authMiddleware } = AuthMiddleware_1.default;
const { getUserInfo, getUserInfoByUsername, updateEmail, updatePassword, updateUsername, } = UserController_1.default;
const { updateEmailMiddleware, updateUserMiddleware, updateUsernameMiddleware, } = UserMiddleware_1.default;
exports.userRouter = (0, express_1.Router)();
// Update user info
exports.userRouter.put("/update/username", authMiddleware, updateUserMiddleware, updateUsernameMiddleware, updateUsername);
exports.userRouter.put("/update/email", authMiddleware, updateUserMiddleware, updateEmailMiddleware, updateEmail);
exports.userRouter.put("/update/password", authMiddleware, updateUserMiddleware, updatePassword);
// Get user info
exports.userRouter.get("/", authMiddleware, getUserInfo);
exports.userRouter.get("/:username", getUserInfoByUsername);
