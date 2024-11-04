import { Response } from "express-serve-static-core";

export default class Throw {
  /**
   * Throw 500 Internal server error
   *
   */
  public static error500(res: Response, error: any) {
    console.log(error);

    return res.status(500).send({
      status: "error",
      message: "Internal server error",
      data: null,
      error: null,
    });
  }

  /**
   * Throw 401 Unauthorized error
   *
   */
  public static error401(res: Response, message: string | null) {
    return res.status(401).send({
      status: "error",
      message: message ?? "Unauthorized",
      data: null,
      error: null,
    });
  }

  /**
   * Throw 400 Bad Request error
   *
   */
  public static error400(res: Response, message: string, error?: any) {
    return res.status(400).send({
      status: "error",
      message,
      data: null,
      error,
    });
  }

  /**
   * Throw 403 Forbidden error
   *
   */
  public static error403(res: Response, message?: string, error?: any) {
    return res.status(403).send({
      status: "error",
      message: message ?? "Your request is forbidden",
      data: null,
      error: null,
    });
  }

  /**
   * Throw 404 Not Found error
   *
   */
  public static error404(res: Response, message: string | null) {
    return res.status(404).send({
      status: "error",
      message: message ?? "Resource not found",
      data: null,
      error: null,
    });
  }
}
