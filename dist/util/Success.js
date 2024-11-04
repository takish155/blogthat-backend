"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Success {
    /**
     * Send 200 OK response
     *
     */
    static ok(res, message, data) {
        return res.status(200).send({
            status: "success",
            message,
            data,
            error: null,
        });
    }
    /**
     * Send 201 Created response
     *
     */
    static created(res, message, data) {
        return res.status(201).send({
            status: "success",
            message,
            data,
            error: null,
        });
    }
    /**
     * Send 204 No Content response
     *
     */
    static noContent(res) {
        return res.status(204).send({});
    }
}
exports.default = Success;
