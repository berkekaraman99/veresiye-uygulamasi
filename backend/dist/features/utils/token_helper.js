"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResetPasswordToken = exports.verifyToken = exports.decodeToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const randomstring_1 = __importDefault(require("randomstring"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = `${process.env.JWT_SECRET_KEY}`;
const ACCESS_TOKEN_EXPIRATION = 60 * 60 * 24 * 30; // 1 month
const REFRESH_TOKEN_EXPIRATION = 60 * 60 * 24 * 30 * 2; // 2 months
const generateToken = (payload) => {
    const accessToken = jsonwebtoken_1.default.sign({ id: payload.id }, SECRET_KEY, {
        expiresIn: ACCESS_TOKEN_EXPIRATION,
    });
    return {
        accessToken: accessToken,
        expiration: new Date(Date.now() + ACCESS_TOKEN_EXPIRATION * 1000),
        refreshToken: "",
    };
};
exports.generateToken = generateToken;
const decodeToken = (payload) => {
    const decodedToken = jsonwebtoken_1.default.verify(payload, SECRET_KEY);
    return decodedToken;
};
exports.decodeToken = decodeToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, SECRET_KEY);
};
exports.verifyToken = verifyToken;
const generateResetPasswordToken = () => {
    return randomstring_1.default.generate({
        length: 40,
        charset: "alphanumeric",
    });
};
exports.generateResetPasswordToken = generateResetPasswordToken;
