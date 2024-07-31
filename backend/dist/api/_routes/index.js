"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const receipt_routes_1 = __importDefault(require("../receipt/routes/receipt_routes"));
const customer_routes_1 = __importDefault(require("../customer/routes/customer_routes"));
const RootRoutes = express_1.default.Router();
RootRoutes.use("/receipts", receipt_routes_1.default);
RootRoutes.use("/customer", customer_routes_1.default);
exports.default = RootRoutes;
