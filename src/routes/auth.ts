import { Router } from "express";
import passport from "passport";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import AuthController from "../controllers/authController";

export const authRouter = Router();

authRouter.post("/sign-in", passport.authenticate("local"), (req, res) => {
  res.status(200).send({
    message: "AUTHENTICATED",
    status: "success",
    data: null,
    error: null,
  });
});

authRouter.post(
  "/sign-up",
  AuthMiddleware.signUpMiddleware,
  AuthController.signUp,
  passport.authenticate("local"),
  (req, res) => {
    return res.status(201).send({
      status: "success",
      message: "User created and authenticated...",
      data: null,
      error: null,
    });
  }
);

authRouter.delete("/sign-out", AuthMiddleware.authMiddleware, (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send({
        status: "error",
        message: "Internal server error...",
        data: null,
        error: err,
      });
    }

    return res.status(204).send({});
  });
});
authRouter.get("/status", AuthController.sessionStatus);
