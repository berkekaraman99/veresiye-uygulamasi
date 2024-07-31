"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = void 0;
const yup_1 = __importDefault(require("yup"));
exports.loginValidator = yup_1.default.object().shape({
    userName: yup_1.default.string().required().min(6).max(20),
    password: yup_1.default.string().required().min(6).max(32),
});
