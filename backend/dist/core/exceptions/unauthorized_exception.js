"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UnauthorizedException extends Error {
    constructor(message) {
        super(message);
        this.message = message !== null && message !== void 0 ? message : "Unauthorized";
        this.statusCode = 401;
    }
}
exports.default = UnauthorizedException;
