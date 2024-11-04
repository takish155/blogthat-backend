"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSession = void 0;
const checkSession = (req) => {
    if (!req.user) {
        return false;
    }
    return true;
};
exports.checkSession = checkSession;
