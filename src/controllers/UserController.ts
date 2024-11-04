import { Request, Response } from "express-serve-static-core";
import { prisma } from "../config/prisma";

export default class UserController {
  /**
   * Get authenticated user's info
   *
   */
  public static async getUserInfo(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: req.user,
        },
      });
      if (!user) {
        throw new Error("User not found");
      }

      return res.status(200).send({
        status: "success",
        message: "User found...",
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          joinDate: user.createdAt,
        },
        error: null,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Internal server error",
        data: null,
        error: error,
      });
    }
  }

  /**
   * Get user info by username
   *
   */
  public static async getUserInfoByUsername(
    req: Request<{ username: string }>,
    res: Response
  ) {
    try {
      const user = await prisma.user.findUnique({
        where: { username: req.params.username },
      });
      if (!user) {
        return res.status(404).send({
          status: "error",
          message: "User not found",
          data: null,
          error: null,
        });
      }

      return res.status(200).send({
        status: "success",
        message: "User found...",
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          joinDate: user.createdAt,
        },
        error: null,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Internal server error",
        data: null,
        error: error,
      });
    }
  }

  /**
   * Update user username
   */

  public static async updateUsername(
    req: Request<{}, {}, { username: string }>,
    res: Response
  ) {
    try {
      await prisma.user.update({
        where: { id: req.user },
        data: { username: req.body.username },
      });

      return res.status(200).send({
        status: "success",
        message: "Username updated...",
        data: null,
        error: null,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Internal server error",
        data: null,
        error: error,
      });
    }
  }

  /**
   * Update user email
   *
   */
  public static async updateEmail(
    req: Request<
      {},
      {},
      {
        email: string;
      }
    >,
    res: Response
  ) {
    try {
      await prisma.user.update({
        where: { id: req.user },
        data: { email: req.body.email },
      });

      return res.status(200).send({
        status: "success",
        message: "Email updated...",
        data: null,
        error: null,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Internal server error",
        data: null,
        error: error,
      });
    }
  }

  /**
   * Update user password
   *
   */
  public static async updatePassword(
    req: Request<
      {},
      {},
      {
        newPassword: string;
      }
    >,
    res: Response
  ) {
    try {
      await prisma.user.update({
        where: { id: req.user },
        data: { password: req.body.newPassword },
      });

      return res.status(200).send({
        status: "success",
        message: "Password updated...",
        data: null,
        error: null,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Internal server error",
        data: null,
        error: error,
      });
    }
  }
}
