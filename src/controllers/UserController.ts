import { Request, Response } from "express-serve-static-core";
import { prisma } from "../config/prisma";
import Success from "../util/Success";
import Throw from "../util/ThrowError";
import { client } from "../config/redis";

export default class UserController {
  /**
   * Get authenticated user's info
   *
   */
  public static async getUserInfo(req: Request, res: Response) {
    try {
      // Check if user is cached
      const cachedUser = await client.get("/user/" + req.user);

      // If user is not cached
      if (!cachedUser) {
        const user = await prisma.user.findUnique({
          where: {
            id: req.user as string,
          },
        });
        if (!user) {
          throw new Error("User not found");
        }

        await client.set("/user/" + req.user, JSON.stringify(user));

        return Success.ok(res, "User found...", {
          id: user.id,
          username: user.username,
          email: user.email,
          joinDate: user.createdAt,
        });
      }

      return Success.ok(res, "User found...", JSON.parse(cachedUser));
    } catch (error) {
      return Throw.error500(res, error);
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
      // Check if user is cached
      const cachedUser = await client.get("/user/" + req.params.username);

      // If user is not cached
      if (!cachedUser) {
        const user = await prisma.user.findUnique({
          where: { username: req.params.username },
        });
        if (!user) {
          return Throw.error404(res, "User not found...");
        }

        await client.set("/user/" + req.params.username, JSON.stringify(user));

        return Success.ok(res, "User found...", {
          id: user.id,
          username: user.username,
          joinDate: user.createdAt,
        });
      }

      return Success.ok(res, "User found...", JSON.parse(cachedUser));
    } catch (error) {
      return Throw.error500(res, error);
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
      const user = await prisma.user.update({
        where: { id: req.user as string },
        data: { username: req.body.username },
      });

      // Update public user info in cache
      await client.set(
        "/user/" + user.username,
        JSON.stringify({
          id: user.id,
          username: user.username,
          joinDate: user.createdAt,
        })
      );

      // Update private user info in cache
      await client.set(
        "/user/" + user.id,
        JSON.stringify({
          id: user.id,
          username: user.username,
          email: user.email,
          joinDate: user.createdAt,
        })
      );

      return Success.noContent(res);
    } catch (error) {
      return Throw.error500(res, error);
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
      const user = await prisma.user.update({
        where: { id: req.user as string },
        data: { email: req.body.email },
      });

      // Update private user info in cache
      await client.set(
        "/user/" + user.id,
        JSON.stringify({
          id: user.id,
          username: user.username,
          email: user.email,
          joinDate: user.createdAt,
        })
      );

      return Success.noContent(res);
    } catch (error) {
      return Throw.error500(res, error);
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
        password: string;
        newPassword: string;
      }
    >,
    res: Response
  ) {
    try {
      await prisma.user.update({
        where: { id: req.user as string },
        data: { password: req.body.newPassword },
      });

      await prisma.session.deleteMany({
        where: {
          data: {
            contains: req.user as string,
          },
          sid: {
            not: req.sessionID,
          },
        },
      });

      return Success.noContent(res);
    } catch (error) {
      return Throw.error500(res, error);
    }
  }
}
