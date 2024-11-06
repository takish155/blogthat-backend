import { z } from "zod";

type CategoryList =
  | "tips"
  | "funny"
  | "bussiness"
  | "celebrity"
  | "politics"
  | "other";
type SortByType = "desc" | "asc" | "newest" | "oldest";

type BlogQuery = {
  category: CategoryList | null;
  sortBy: SortByType | null;
  page: number | null; // 1, 2, 3, 4, 5, 6, 7, etc
};

export default class BlogValidation {
  public static blogQueryValidation = z.object({
    category: z
      .enum(["tips", "funny", "bussiness", "celebrity", "politics", "other"])
      .optional(),
    orderBy: z.enum(["asc", "desc"]).optional(),
    cursor: z.string().optional(),
    query: z.string().optional(),
  });

  public static blogFieldValidation = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(3).max(255),
    body: z.string().min(3).max(3000),
    category: z.enum([
      "tips",
      "funny",
      "bussiness",
      "celebrity",
      "politics",
      "other",
    ]),
    thumbnail: z.string().max(255).optional(),
  });

  public static createCommentValidation = z.object({
    body: z.string().min(3).max(255),
  });
}

export type BlogQueryType = z.infer<typeof BlogValidation.blogQueryValidation>;
export type BlogFieldType = z.infer<typeof BlogValidation.blogFieldValidation>;
export type CreateCommentType = z.infer<
  typeof BlogValidation.createCommentValidation
>;
