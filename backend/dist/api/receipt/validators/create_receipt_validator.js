"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReceiptValidator = void 0;
const yup_1 = __importDefault(require("yup"));
exports.createReceiptValidator = yup_1.default.object().shape({
    price: yup_1.default.number().required(),
    description: yup_1.default.string().notRequired().max(512),
});
