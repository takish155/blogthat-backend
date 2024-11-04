import { Request, Response } from "express-serve-static-core";
import { BlogFieldType, BlogQueryType } from "../validation/BlogValidation";
import { prisma } from "../config/prisma";
import { client } from "../config/redis";
import Success from "../util/Success";
import Throw from "../util/ThrowError";

export default class BlogController {
  /**
   * Get blog with limit of 10
   */
  public static async getBlog(
    req: Request<{}, {}, {}, BlogQueryType>,
    res: Response
  ) {
    try {
      const { category, cursor, query, orderBy } = req.query;

      // Get blog with limit of 10 curosor
      if (!cursor) {
        const blog = await prisma.blog.findMany({
          take: 10,
          where: {
            category: {
              equals: category ?? undefined,
            },
            title: {
              contains: query ?? undefined,
            },
          },
          orderBy: {
            createdAt: orderBy ?? "desc",
          },
        });

        return Success.ok(res, "Successfully get blog", {
          cursor: blog.length > 0 ? blog[blog.length - 1].id : null,
          blog,
        });
      }

      const blog = await prisma.blog.findMany({
        take: 10,
        skip: 10,
        where: {
          category: {
            equals: category ?? undefined,
          },
          title: {
            contains: query ?? undefined,
          },
        },
      });

      return Success.ok(res, "Successfully get blog", {
        cursor: blog.length > 0 ? blog[blog.length - 1].id : null,
        blog,
      });
    } catch (error) {
      return Throw.error500(res, error);
    }
  }

  /**
   * Get individual blog by id
   */
  public static async getBlogById(req: Request<{ id: string }>, res: Response) {
    try {
      // const cachedBlog = null;
      const cachedBlog = await client.get(`/blog/${req.params.id}`);
      if (!cachedBlog) {
        const blog = await prisma.blog.findUnique({
          where: {
            id: req.params.id,
          },
        });

        if (!blog) {
          return Throw.error400(res, "Blog not found");
        }

        await client.set(`/blog/${req.params.id}`, JSON.stringify(blog));

        return Success.ok(res, "Successfully get blog", blog);
      }
      return Success.ok(res, "Successfully get blog", JSON.parse(cachedBlog));
    } catch (error) {
      console.log(error);
      return Throw.error500(res, error);
    }
  }

  /*
   * Get recomended blog relating viewed content
   */
  public static async getRecommendedBlog(
    req: Request<{
      category: string;
    }>,
    res: Response
  ) {
    try {
      const { category } = req.params;

      const cachedRecommendationBlog = await client.get(
        `/blog/recommendation/${category}`
      );

      if (!cachedRecommendationBlog) {
        const blog = await prisma.blog.findMany({
          take: 5,
          where: {
            category: {
              equals: category,
            },
          },
        });

        // Set caching and expire it after 24 hours
        await client.set(
          `/blog/recommendation/${category}`,
          JSON.stringify(blog)
        );
        await client.expire(`/blog/recommendation/${category}`, 60 * 60 * 24);

        return Success.ok(res, "Successfully get recommended blog", blog);
      }

      return Success.ok(
        res,
        "Successfully get recommended blog",
        cachedRecommendationBlog
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
        data: null,
        error: null,
      });
    }
  }

  /**
   * Create a new blog
   */
  public static async createBlog(
    req: Request<{}, {}, BlogFieldType>,
    res: Response
  ) {
    try {
      const { title, description, body, category, thumbnail } = req.body;

      const blog = await prisma.blog.create({
        data: {
          title,
          description,
          body,
          category,
          thumbnail,
          author: {
            connect: {
              id: req.user as string as string,
            },
          },
        },
      });

      await client.set(`/blog/${blog.id}`, JSON.stringify(blog));

      return Success.created(res, "Successfully created blog");
    } catch (error) {
      return Throw.error500(res, error);
    }
  }

  /**
   * Update a blog
   */
  public static async updateBlog(
    req: Request<
      {
        id: string;
      },
      {},
      BlogFieldType
    >,
    res: Response
  ) {
    try {
      const { body, category, description, title, thumbnail } = req.body;

      const blog = await prisma.blog.update({
        where: {
          id: req.params.id,
        },
        data: {
          body,
          category,
          description,
          title,
          thumbnail,
        },
      });

      await client.set(`/blog/${req.params.id}`, JSON.stringify(blog));

      return Success.noContent(res);
    } catch (error) {
      return Throw.error500(res, error);
    }
  }

  /**
   *Deletes a blog
   */
  public static async deleteBlog(req: Request, res: Response) {
    try {
      await prisma.blog.delete({
        where: {
          id: req.params.id,
        },
      });

      await client.del(`/blog/${req.params.id}`);

      return Success.noContent(res);
    } catch (error) {
      console.log(error);
      return Throw.error500(res, error);
    }
  }
}
