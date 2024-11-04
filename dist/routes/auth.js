"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const AuthMiddleware_1 = __importDefault(require("../middlewares/AuthMiddleware"));
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/sign-in", passport_1.default.authenticate("local"), (req, res) => {
    res.status(200).send({
        message: "AUTHENTICATED",
        status: "success",
        data: null,
        error: null,
    });
});
exports.authRouter.post("/sign-up", AuthMiddleware_1.default.signUpMiddleware, AuthController_1.default.signUp, passport_1.default.authenticate("local"), (req, res) => {
    return res.status(201).send({
        status: "success",
        message: "User created and authenticated...",
        data: null,
        error: null,
    });
});
exports.authRouter.delete("/sign-out", AuthMiddleware_1.default.authMiddleware, (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).send({
                status: "error",
                message: "Internal server error...",
                data: null,
                error: err,
            });
        }
        return res.status(204).send({});
    });
});
exports.authRouter.get("/status", AuthController_1.default.sessionStatus);
