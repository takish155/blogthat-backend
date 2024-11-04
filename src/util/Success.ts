import { Response } from "express-serve-static-core";

export default class Success {
  /**
   * Send 200 OK response
   *
   */

  public static ok(res: Response, message: string, data: any | null) {
    return res.status(200).send({
      status: "success",
      message,
      data,
      error: null,
    });
  }

  /**
   * Send 201 Created response
   *
   */
  public static created(res: Response, message: string, data?: any | null) {
    return res.status(201).send({
      status: "success",
      message,
      data,
      error: null,
    });
  }

  /**
   * Send 204 No Content response
   *
   */
  public static noContent(res: Response) {
    return res.status(204).send({});
  }
}
