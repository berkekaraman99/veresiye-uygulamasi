"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpValidator = void 0;
const yup_1 = __importDefault(require("yup"));
exports.signUpValidator = yup_1.default.object().shape({
    id: yup_1.default.string().required().max(255),
    companyName: yup_1.default.string().required().min(8).max(255),
    userName: yup_1.default.string().required().min(6).max(64),
    password: yup_1.default.string().min(6).max(20),
});
