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
exports.getCustomerReceipts = exports.searchCustomers = exports.getCustomerById = exports.getCustomers = exports.updateCustomer = exports.deleteCustomer = exports.createCustomer = void 0;
const base_response_1 = __importDefault(require("../../../core/response/base_response"));
const mysql_1 = require("../../../core/connection/mysql");
const create_customer_validator_1 = require("../validators/create_customer_validator");
const response_status_enum_1 = require("../../../core/constants/response_status_enum");
const createCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customer_name, customer_address, customer_id, created_date } = req.body;
        yield create_customer_validator_1.createCustomerValidator
            .validate({
            customer_name,
        })
            .catch((_) => {
            throw new Error("Validation Error");
        });
        const checkIsCustomerUnique = yield mysql_1.db.query({
            sql: "SELECT * FROM customers WHERE customer_id = ?",
            values: [customer_id],
        });
        if (checkIsCustomerUnique[0].length !== 0) {
            return res.status(200).json(base_response_1.default.fail("Customer is already exists", 1013));
        }
        yield mysql_1.db.query({
            sql: "INSERT INTO customers (customer_id, customer_name, customer_address, created_at) VALUES (?, ?, ?, ?)",
            values: [customer_id, customer_name, customer_address, created_date],
        });
        res.status(200).json(base_response_1.default.success("Customer created successfully", response_status_enum_1.ResponseStatus.SUCCESS));
    }
    catch (error) {
        res.status(500).json(base_response_1.default.fail(error.message, error.statusCode));
    }
});
exports.createCustomer = createCustomer;
const deleteCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customer_id } = req.body;
        yield mysql_1.db.query({
            sql: "UPDATE customers SET is_deleted = ? WHERE customer_id = ?",
            values: [1, customer_id],
        });
        res.status(200).json(base_response_1.default.success("Customer deleted successfully!", response_status_enum_1.ResponseStatus.SUCCESS));
    }
    catch (error) {
        res.status(500).json(base_response_1.default.fail(error.message, error.statusCode));
    }
});
exports.deleteCustomer = deleteCustomer;
const updateCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customer_name, customer_address, customer_id } = req.body;
        yield mysql_1.db.query({
            sql: "UPDATE customers SET customer_name = ?, customer_address = ? WHERE customer_id = ?",
            values: [customer_name, customer_address, customer_id],
        });
        res.status(200).json(base_response_1.default.success("Customer updated successfully!", response_status_enum_1.ResponseStatus.SUCCESS));
    }
    catch (error) {
        res.status(500).json(base_response_1.default.fail(error.message, error.statusCode));
    }
});
exports.updateCustomer = updateCustomer;
const getCustomers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { offset } = req.query;
        const [customers] = yield mysql_1.db.query({
            sql: `SELECT * FROM customers WHERE is_deleted = ? ORDER BY customer_name`,
            values: [0],
        });
        // console.log(customers);
        res.status(200).json(base_response_1.default.success(customers, response_status_enum_1.ResponseStatus.SUCCESS));
    }
    catch (error) {
        res.status(500).json(base_response_1.default.fail(error.message, error.statusCode));
    }
});
exports.getCustomers = getCustomers;
const getCustomerById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customer_id } = req.query;
        const [customer] = yield mysql_1.db.query({
            sql: `SELECT * FROM customers WHERE customer_id = ?`,
            values: [customer_id],
        });
        // console.log(customer);
        res.status(200).json(base_response_1.default.success(customer, response_status_enum_1.ResponseStatus.SUCCESS));
    }
    catch (error) {
        res.status(500).json(base_response_1.default.fail(error.message, error.statusCode));
    }
});
exports.getCustomerById = getCustomerById;
const searchCustomers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text } = req.query;
        const [customers] = yield mysql_1.db.query({
            sql: "SELECT * FROM customers WHERE customer_name LIKE ? AND is_deleted = 0 ORDER BY customer_name LIMIT 10 OFFSET 0",
            values: ["%" + text + "%"],
        });
        res.status(200).json(base_response_1.default.success(customers, response_status_enum_1.ResponseStatus.SUCCESS));
    }
    catch (error) {
        res.status(500).json(base_response_1.default.fail(error.message, error.statusCode));
    }
});
exports.searchCustomers = searchCustomers;
const getCustomerReceipts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customer_id } = req.query;
        const [receipts] = yield mysql_1.db.query({
            sql: "SELECT receipt_id, description, price, receipt_type, created_date FROM receipts WHERE is_deleted = 0 AND customer_id = ?",
            values: [customer_id],
        });
        res.status(200).json(base_response_1.default.success(receipts, response_status_enum_1.ResponseStatus.SUCCESS));
    }
    catch (error) {
        res.status(500).json(base_response_1.default.fail(error.message, error.statusCode));
    }
});
exports.getCustomerReceipts = getCustomerReceipts;
