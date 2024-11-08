"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRouter = void 0;
const express_1 = require("express");
const BlogController_1 = __importDefault(require("../controllers/BlogController"));
const BlogMiddleware_1 = __importDefault(require("../middlewares/BlogMiddleware"));
const AuthMiddleware_1 = __importDefault(require("../middlewares/AuthMiddleware"));
const { createBlog, deleteBlog, getBlog, getBlogById, getRecommendedBlog, updateBlog, createComment, deleteComent, getCommentByBlogId, } = BlogController_1.default;
const { checkBlogField, checkBlogOwnership, checkBlogQuery, checkCommentField, checkBlogExists, } = BlogMiddleware_1.default;
const { authMiddleware } = AuthMiddleware_1.default;
exports.blogRouter = (0, express_1.Router)();
exports.blogRouter.get("/", checkBlogQuery, getBlog);
exports.blogRouter.post("/", authMiddleware, checkBlogField, createBlog);
exports.blogRouter.get("/recommended/:category", getRecommendedBlog);
exports.blogRouter.get("/:id", getBlogById);
exports.blogRouter.put("/:id", authMiddleware, checkBlogField, checkBlogOwnership, updateBlog);
exports.blogRouter.delete("/:id", authMiddleware, checkBlogOwnership, deleteBlog);
exports.blogRouter.get("/:id/comment", checkBlogExists, getCommentByBlogId);
exports.blogRouter.post("/:id/comment", authMiddleware, checkBlogExists, checkCommentField, createComment);
exports.blogRouter.delete("/:id/comment/:commentId", authMiddleware, checkBlogExists, deleteComent);
