import { Router } from "express";
import BlogController from "../controllers/BlogController";
import BlogMiddleware from "../middlewares/BlogMiddleware";
import AuthMiddleware from "../middlewares/AuthMiddleware";

const {
  createBlog,
  deleteBlog,
  getBlog,
  getBlogById,
  getRecommendedBlog,
  updateBlog,
} = BlogController;

const { checkBlogField, checkBlogOwnership, checkBlogQuery } = BlogMiddleware;

const { authMiddleware } = AuthMiddleware;

export const blogRouter = Router();

blogRouter.get("/", checkBlogQuery, getBlog);
blogRouter.post("/", authMiddleware, checkBlogField, createBlog);

blogRouter.get("/recommended/:category", getRecommendedBlog);

blogRouter.get("/:id", getBlogById);
blogRouter.put(
  "/:id",
  authMiddleware,
  checkBlogField,
  checkBlogOwnership,
  updateBlog
);
blogRouter.delete("/:id", authMiddleware, checkBlogOwnership, deleteBlog);
