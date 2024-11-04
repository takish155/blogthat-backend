import { Router } from "express";
import UserController from "../controllers/UserController";
import UserMiddleware from "../middlewares/UserMiddleware";
import AuthMiddleware from "../middlewares/AuthMiddleware";

const { authMiddleware } = AuthMiddleware;

const {
  getUserInfo,
  getUserInfoByUsername,
  updateEmail,
  updatePassword,
  updateUsername,
} = UserController;
const {
  updateEmailMiddleware,
  updateUserMiddleware,
  updateUsernameMiddleware,
} = UserMiddleware;

export const userRouter = Router();

// Update user info
userRouter.put(
  "/update/username",
  authMiddleware,
  updateUserMiddleware,
  updateUsernameMiddleware,
  updateUsername
);
userRouter.put(
  "/update/email",
  authMiddleware,
  updateUserMiddleware,
  updateEmailMiddleware,
  updateEmail
);
userRouter.put(
  "/update/password",
  authMiddleware,
  updateUserMiddleware,
  updatePassword
);

// Get user info
userRouter.get("/", authMiddleware, getUserInfo);
userRouter.get("/:username", getUserInfoByUsername);
