"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
class BlogValidation {
}
BlogValidation.blogQueryValidation = zod_1.z.object({
    category: zod_1.z
        .enum(["tips", "funny", "bussiness", "celebrity", "politics", "other"])
        .optional(),
    orderBy: zod_1.z.enum(["asc", "desc"]).optional(),
    cursor: zod_1.z.string().optional(),
    query: zod_1.z.string().optional(),
});
BlogValidation.blogFieldValidation = zod_1.z.object({
    title: zod_1.z.string().min(3).max(100),
    description: zod_1.z.string().min(3).max(255),
    body: zod_1.z.string().min(3).max(3000),
    category: zod_1.z.enum([
        "tips",
        "funny",
        "bussiness",
        "celebrity",
        "politics",
        "other",
    ]),
    thumbnail: zod_1.z.string().max(255).optional(),
});
exports.default = BlogValidation;
