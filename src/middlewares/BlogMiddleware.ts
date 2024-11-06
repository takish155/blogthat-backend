import { Request, Response, NextFunction } from "express-serve-static-core";
import BlogValidation from "../validation/BlogValidation";
import { prisma } from "../config/prisma";
import Throw from "../util/ThrowError";

const { blogQueryValidation, blogFieldValidation, createCommentValidation } =
  BlogValidation;

export default class BlogMiddleware {
  /**
   *  Check if query params is valid for getting blog
   */

  public static checkBlogQuery(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const validation = blogQueryValidation.safeParse(req.query);
    if (!validation.success) {
      return Throw.error400(res, "Invalid query", validation.error.errors);
    }

    next();
  }

  /**
   * Check if blog field is valid for creating or updating blog
   */
  public static checkBlogField(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const validation = blogFieldValidation.safeParse(req.body);
    if (!validation.success) {
      return Throw.error400(res, "Invalid blog field", validation.error.errors);
    }

    next();
  }

  /**
   * Check if blog exists
   */
  public static async checkBlogExists(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const blog = await prisma.blog.findUnique({
        where: {
          id,
        },
      });

      if (!blog) {
        return Throw.error400(res, "Blog not found", null);
      }

      next();
    } catch (error) {
      return Throw.error500(res, error);
    }
  }

  /**
   * Check if blog is owned by user
   */
  public static async checkBlogOwnership(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const blog = await prisma.blog.findUnique({
        where: {
          id,
        },
      });

      if (blog?.authorId !== req.user) {
        return Throw.error403(
          res,
          "You are not authorized to perform this action"
        );
      }

      next();
    } catch (error) {
      return Throw.error500(res, error);
    }
  }

  /**
   * Check if comment is owned by user
   */
  public static async checkCommentOwnership(
    req: Request<{ id: string; commentId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id, commentId } = req.params;
      const comment = await prisma.blogComment.findUnique({
        where: {
          id: commentId,
        },
      });

      if (comment?.authorId !== req.user) {
        return Throw.error403(
          res,
          "You are not authorized to perform this action"
        );
      }

      next();
    } catch (error) {
      return Throw.error500(res, error);
    }
  }

  /**
   * Check if comment field is valid
   */
  public static checkCommentField(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const validation = createCommentValidation.safeParse(req.body);
    if (!validation.success) {
      return Throw.error400(
        res,
        "Invalid comment field",
        validation.error.errors
      );
    }

    next();
  }
}
