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
const prisma_1 = require("../config/prisma");
const redis_1 = require("../config/redis");
const Success_1 = __importDefault(require("../util/Success"));
const ThrowError_1 = __importDefault(require("../util/ThrowError"));
class BlogController {
    /**
     * Get blog with limit of 10
     */
    static getBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { category, cursor, query, orderBy } = req.query;
                // Get blog with limit of 10 curosor
                if (!cursor) {
                    const blog = yield prisma_1.prisma.blog.findMany({
                        take: 10,
                        where: {
                            category: {
                                equals: category !== null && category !== void 0 ? category : undefined,
                            },
                            title: {
                                contains: query !== null && query !== void 0 ? query : undefined,
                            },
                        },
                        orderBy: {
                            createdAt: orderBy !== null && orderBy !== void 0 ? orderBy : "desc",
                        },
                    });
                    return Success_1.default.ok(res, "Successfully get blog", {
                        cursor: blog.length > 0 ? blog[blog.length - 1].id : null,
                        blog,
                    });
                }
                const blog = yield prisma_1.prisma.blog.findMany({
                    take: 10,
                    skip: 10,
                    where: {
                        category: {
                            equals: category !== null && category !== void 0 ? category : undefined,
                        },
                        title: {
                            contains: query !== null && query !== void 0 ? query : undefined,
                        },
                    },
                });
                return Success_1.default.ok(res, "Successfully get blog", {
                    cursor: blog.length > 0 ? blog[blog.length - 1].id : null,
                    blog,
                });
            }
            catch (error) {
                return ThrowError_1.default.error500(res, error);
            }
        });
    }
    /**
     * Get individual blog by id
     */
    static getBlogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const cachedBlog = null;
                const cachedBlog = yield redis_1.client.get(`/blog/${req.params.id}`);
                if (!cachedBlog) {
                    const blog = yield prisma_1.prisma.blog.findUnique({
                        where: {
                            id: req.params.id,
                        },
                    });
                    if (!blog) {
                        return ThrowError_1.default.error400(res, "Blog not found");
                    }
                    yield redis_1.client.set(`/blog/${req.params.id}`, JSON.stringify(blog));
                    return Success_1.default.ok(res, "Successfully get blog", blog);
                }
                return Success_1.default.ok(res, "Successfully get blog", JSON.parse(cachedBlog));
            }
            catch (error) {
                console.log(error);
                return ThrowError_1.default.error500(res, error);
            }
        });
    }
    /*
     * Get recomended blog relating viewed content
     */
    static getRecommendedBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { category } = req.params;
                const cachedRecommendationBlog = yield redis_1.client.get(`/blog/recommendation/${category}`);
                if (!cachedRecommendationBlog) {
                    const blog = yield prisma_1.prisma.blog.findMany({
                        take: 5,
                        where: {
                            category: {
                                equals: category,
                            },
                        },
                    });
                    // Set caching and expire it after 24 hours
                    yield redis_1.client.set(`/blog/recommendation/${category}`, JSON.stringify(blog));
                    yield redis_1.client.expire(`/blog/recommendation/${category}`, 60 * 60 * 24);
                    return Success_1.default.ok(res, "Successfully get recommended blog", blog);
                }
                return Success_1.default.ok(res, "Successfully get recommended blog", cachedRecommendationBlog);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    status: "error",
                    message: "Internal server error",
                    data: null,
                    error: null,
                });
            }
        });
    }
    /**
     * Create a new blog
     */
    static createBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, description, body, category, thumbnail } = req.body;
                const blog = yield prisma_1.prisma.blog.create({
                    data: {
                        title,
                        description,
                        body,
                        category,
                        thumbnail,
                        author: {
                            connect: {
                                id: req.user,
                            },
                        },
                    },
                });
                yield redis_1.client.set(`/blog/${blog.id}`, JSON.stringify(blog));
                return Success_1.default.created(res, "Successfully created blog");
            }
            catch (error) {
                return ThrowError_1.default.error500(res, error);
            }
        });
    }
    /**
     * Update a blog
     */
    static updateBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body, category, description, title, thumbnail } = req.body;
                const blog = yield prisma_1.prisma.blog.update({
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
                yield redis_1.client.set(`/blog/${req.params.id}`, JSON.stringify(blog));
                return Success_1.default.noContent(res);
            }
            catch (error) {
                return ThrowError_1.default.error500(res, error);
            }
        });
    }
    /**
     *Deletes a blog
     */
    static deleteBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma_1.prisma.blog.delete({
                    where: {
                        id: req.params.id,
                    },
                });
                yield redis_1.client.del(`/blog/${req.params.id}`);
                return Success_1.default.noContent(res);
            }
            catch (error) {
                console.log(error);
                return ThrowError_1.default.error500(res, error);
            }
        });
    }
}
exports.default = BlogController;
