import { Request, Response, NextFunction } from "express-serve-static-core";
import AuthValidation from "../validation/AuthValidation";
import { checkSession } from "../util/checkSession";
import Throw from "../util/ThrowError";

export default class AuthMiddleware {
  public static signUpMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const validation = AuthValidation.signUpValidation.safeParse(req.body);
    if (!validation.success) {
      return Throw.error400(res, "Invalid sign up", validation.error.errors);
    }
    next();
  }

  public static authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const session = checkSession(req);

    if (!session) {
      return Throw.error401(res, "Unauthorized");
    }

    next();
  }
}
