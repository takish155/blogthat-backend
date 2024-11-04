"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BlogValidation_1 = __importDefault(require("../validation/BlogValidation"));
const prisma_1 = require("../config/prisma");
const ThrowError_1 = __importDefault(require("../util/ThrowError"));
const { blogQueryValidation, blogFieldValidation } = BlogValidation_1.default;
class BlogMiddleware {
    /**
     *  Check if query params is valid for getting blog
     */
    static checkBlogQuery(req, res, next) {
        const validation = blogQueryValidation.safeParse(req.query);
        if (!validation.success) {
            return ThrowError_1.default.error400(res, "Invalid query", validation.error.errors);
        }
        next();
    }
    /**
     * Check if blog field is valid for creating or updating blog
     */
    static checkBlogField(req, res, next) {
        const validation = blogFieldValidation.safeParse(req.body);
        if (!validation.success) {
            return ThrowError_1.default.error400(res, "Invalid blog field", validation.error.errors);
        }
        next();
    }
    /**
     * Check if blog exists
     */
    static checkBlogExists(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const blog = yield prisma_1.prisma.blog.findUnique({
                    where: {
                        id,
                    },
                });
                if (!blog) {
                    return ThrowError_1.default.error400(res, "Blog not found", null);
                }
                next();
            }
            catch (error) {
                return ThrowError_1.default.error500(res, error);
            }
        });
    }
    /**
     * Check if blog is owned by user
     */
    static checkBlogOwnership(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const blog = yield prisma_1.prisma.blog.findUnique({
                    where: {
                        id,
                    },
                });
                if ((blog === null || blog === void 0 ? void 0 : blog.authorId) !== req.user) {
                    return ThrowError_1.default.error403(res, "You are not authorized to perform this action");
                }
                next();
            }
            catch (error) {
                return ThrowError_1.default.error500(res, error);
            }
        });
    }
}
exports.default = BlogMiddleware;
