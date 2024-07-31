"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomerValidator = void 0;
const yup_1 = __importDefault(require("yup"));
exports.createCustomerValidator = yup_1.default.object().shape({
    customerName: yup_1.default.string().required().min(8).max(255),
});
