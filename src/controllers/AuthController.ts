import { NextFunction, Request, Response } from "express-serve-static-core";
import { SignUpType } from "../validation/AuthValidation";
import { prisma } from "../config/prisma";
import bcrypt from "bcryptjs";
import { checkSession } from "../util/checkSession";
import passport from "passport";
import Success from "../util/Success";
import Throw from "../util/ThrowError";

export default class AuthController {
  /*
   * Signs in a user and creates a session
   *
   */
  public static signIn = passport.authenticate(
    "local",
    (req: Request, res: Response) => {
      return Success.ok(res, "Sign in successful", req.user);
    }
  );

  /**
   * Signs up a user and creates a session
   */
  public static async signUp(
    req: Request<{}, {}, SignUpType>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password, username } = req.body;

      const usernameExist = await prisma.user.findUnique({
        where: { username: username },
      });
      if (usernameExist) {
        return Throw.error400(res, "Username already exist...");
      }

      const emailExist = await prisma.user.findUnique({
        where: { email: email },
      });
      if (emailExist) {
        return Throw.error400(res, "Email already exist...");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: { email, username, password: hashedPassword },
      });

      next();
    } catch (error) {
      console.log(error);
      return Throw.error500(res, error);
    }
  }

  /**
   * Checks if a session is active
   */
  public static sessionStatus(req: Request, res: Response) {
    try {
      const session = checkSession(req);
      if (!session) {
        return Throw.error401(res, "Unauthorized");
      }

      return Success.ok(res, "Session active", session);
    } catch (error) {
      console.log(error);
      return Throw.error500(res, error);
    }
  }

  /**
   * Signs out a user
   */
  public static signOut(req: Request, res: Response) {
    req.logout((err) => {
      if (err) {
        return Throw.error500(res, err);
      }

      return Success.noContent(res);
    });
  }
}
