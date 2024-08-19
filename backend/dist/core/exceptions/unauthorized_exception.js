"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_status_enum_1 = require("../constants/response_status_enum");
class UnauthorizedException extends Error {
    constructor(message) {
        super(message);
        this.message = message !== null && message !== void 0 ? message : "Unauthorized";
        this.statusCode = response_status_enum_1.ResponseStatus.UNAUTHORIZED;
    }
}
exports.default = UnauthorizedException;
