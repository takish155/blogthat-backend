import { Request, Response, NextFunction } from "express-serve-static-core";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import UserValidation, {
  UpdateEmailType,
  UpdatePasswordType,
  UpdateUsernameType,
} from "../validation/UserValidation";
import Throw from "../util/ThrowError";

const { updateEmail, updatePassword, updateUsername } = UserValidation;

export default class UserMiddleware {
  /**
   * Middleware for updating username
   *
   */
  public static updateUsernameMiddleware(
    req: Request<{}, {}, UpdateUsernameType>,
    res: Response,
    next: NextFunction
  ) {
    const validation = updateUsername.safeParse(req.body);
    if (!validation.success) {
      return Throw.error400(res, "Validation failed", validation.error.errors);
    }
    next();
  }

  /**
   * Middleware for updating email
   *
   */
  public static updateEmailMiddleware(
    req: Request<{}, {}, UpdateEmailType>,
    res: Response,
    next: NextFunction
  ) {
    const validation = updateEmail.safeParse(req.body);

    if (!validation.success) {
      return Throw.error400(res, "Validation failed", validation.error.errors);
    }
    next();
  }

  /**
   * Middleware for updating something else
   *
   */
  public static async updateUserMiddleware(
    req: Request<{}, {}, UpdatePasswordType>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const validation = updatePassword.safeParse(req.body);

      if (!validation.success) {
        return Throw.error400(
          res,
          "Validation failed",
          validation.error.errors
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user },
      });
      if (!user) {
        return Throw.error400(res, "User not found", null);
      }

      const passwordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!passwordMatch) {
        return Throw.error400(res, "Password does not match", null);
      }

      next();
    } catch (error) {
      return Throw.error500(res, error);
    }
  }
}
