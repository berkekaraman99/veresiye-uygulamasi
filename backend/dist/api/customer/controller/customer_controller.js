"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCustomerReceipts = exports.searchCustomers = exports.getCustomers = exports.deleteCustomer = exports.createCustomer = void 0;
const base_response_1 = __importDefault(require("../../../core/response/base_response"));
const mysql_1 = require("../../../core/connection/mysql");
const create_customer_validator_1 = require("../validators/create_customer_validator");
const createCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId, customerName, createdAt } = req.body;
        yield create_customer_validator_1.createCustomerValidator
            .validate({
            customerName,
        })
            .catch((_) => {
            throw new Error("Validation Error");
        });
        const checkIsCustomerUnique = yield mysql_1.db.query({
            sql: "SELECT * FROM customers WHERE customer_id = ?",
            values: [customerId],
        });
        if (checkIsCustomerUnique[0].length !== 0) {
            return res.status(200).json(base_response_1.default.fail("Customer is already exists", 1013));
        }
        yield mysql_1.db.query({
            sql: "INSERT INTO customers (customer_id, customer_name, created_at) VALUES (?, ?, ?)",
            values: [customerId, customerName, createdAt],
        });
        res.status(201).json(base_response_1.default.success("Customer created successfully", 201));
    }
    catch (error) {
        res.status(500).json(base_response_1.default.fail(error.message, error.statusCode));
    }
});
exports.createCustomer = createCustomer;
const deleteCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId } = req.body;
        yield mysql_1.db.query({
            sql: "UPDATE customers SET is_deleted = ? WHERE customer_id = ?",
            values: [1, customerId],
        });
        res.status(200).json(base_response_1.default.success("Customer deleted successfully!", 200));
    }
    catch (error) {
        res.status(500).json(base_response_1.default.fail(error.message, error.statusCode));
    }
});
exports.deleteCustomer = deleteCustomer;
const getCustomers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { offset } = req.query;
        const [customers] = yield mysql_1.db.query({
            sql: `SELECT * FROM customers WHERE is_deleted != 1 ORDER BY customer_name LIMIT 10 OFFSET ${offset}`,
            values: [],
        });
        console.log(customers);
        res.status(200).json(base_response_1.default.success(customers, 200));
    }
    catch (error) {
        res.status(500).json(base_response_1.default.fail(error.message, error.statusCode));
    }
});
exports.getCustomers = getCustomers;
const searchCustomers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text } = req.query;
        const [customers] = yield mysql_1.db.query({
            sql: "SELECT * FROM customers WHERE customer_name LIKE ? AND is_deleted = 0 ORDER BY customer_name LIMIT 10 OFFSET 0",
            values: ["%" + text + "%"],
        });
        res.status(200).json(base_response_1.default.success(customers, 200));
    }
    catch (error) {
        res.status(500).json(base_response_1.default.fail(error.message, error.statusCode));
    }
});
exports.searchCustomers = searchCustomers;
const fetchCustomerReceipts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId } = req.query;
        const [receipts] = yield mysql_1.db.query({
            sql: "SELECT * FROM receipts WHERE customer_id = ? && receipts.is_deleted = ?",
            values: [customerId, 0],
        });
        return res.status(200).json(base_response_1.default.success(receipts, 200));
    }
    catch (e) {
        return res.status(500).json(base_response_1.default.fail(e.message, e.statusCode));
    }
});
exports.fetchCustomerReceipts = fetchCustomerReceipts;
