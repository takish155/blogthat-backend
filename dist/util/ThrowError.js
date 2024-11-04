"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Throw {
    /**
     * Throw 500 Internal server error
     *
     */
    static error500(res, error) {
        console.log(error);
        return res.status(500).send({
            status: "error",
            message: "Internal server error",
            data: null,
            error: null,
        });
    }
    /**
     * Throw 401 Unauthorized error
     *
     */
    static error401(res, message) {
        return res.status(401).send({
            status: "error",
            message: message !== null && message !== void 0 ? message : "Unauthorized",
            data: null,
            error: null,
        });
    }
    /**
     * Throw 400 Bad Request error
     *
     */
    static error400(res, message, error) {
        return res.status(400).send({
            status: "error",
            message,
            data: null,
            error,
        });
    }
    /**
     * Throw 403 Forbidden error
     *
     */
    static error403(res, message, error) {
        return res.status(403).send({
            status: "error",
            message: message !== null && message !== void 0 ? message : "Your request is forbidden",
            data: null,
            error: null,
        });
    }
    /**
     * Throw 404 Not Found error
     *
     */
    static error404(res, message) {
        return res.status(404).send({
            status: "error",
            message: message !== null && message !== void 0 ? message : "Resource not found",
            data: null,
            error: null,
        });
    }
}
exports.default = Throw;
