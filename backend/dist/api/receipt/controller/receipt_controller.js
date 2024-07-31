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
exports.getReceiptReport = exports.deleteReceipt = exports.fetchReceipts = exports.createReceipt = void 0;
const base_response_1 = __importDefault(require("../../../core/response/base_response"));
const mysql_1 = require("../../../core/connection/mysql");
const create_receipt_validator_1 = require("../validators/create_receipt_validator");
const createReceipt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { receiptId, customerId, createdDate, documentNo, price, description, receipt_type } = req.body;
        yield create_receipt_validator_1.createReceiptValidator
            .validate({
            price,
            description,
        })
            .catch((_) => {
            throw new Error("Validation Error");
        });
        yield mysql_1.db.query({
            sql: `INSERT INTO receipts 
        (receipt_id, customer_id, user_id, description, document_no, price, created_date, receipt_type, payment_method, is_deleted) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            values: [receiptId, customerId, description, documentNo, price, createdDate, receipt_type, 0],
        });
        return res.status(201).json(base_response_1.default.success("Receipt created successfully!", 201));
    }
    catch (e) {
        return res.status(500).json(base_response_1.default.fail(e.message, e.statusCode));
    }
});
exports.createReceipt = createReceipt;
const fetchReceipts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, offset } = req.query;
        const [receipts] = yield mysql_1.db.query({
            sql: `SELECT * FROM receipts R LEFT JOIN customers C ON R.customer_id = C.customer_id WHERE R.is_deleted = 0 ORDER BY R.created_date DESC LIMIT 10 OFFSET ${offset}`,
            values: [userId],
        });
        return res.status(200).json(base_response_1.default.success(receipts, 200));
    }
    catch (e) {
        return res.status(500).json(base_response_1.default.fail(e.message, e.statusCode));
    }
});
exports.fetchReceipts = fetchReceipts;
const deleteReceipt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { receiptId } = req.body;
        yield mysql_1.db.query({
            sql: "UPDATE receipts SET is_deleted = 1 WHERE receipt_id = ?",
            values: [receiptId],
        });
        res.status(200).json(base_response_1.default.fail("Receipt deleted successfully!", 200));
    }
    catch (error) {
        res.status(500).json(base_response_1.default.fail(error.message, error.statusCode));
    }
});
exports.deleteReceipt = deleteReceipt;
const getReceiptReport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query;
        const [report] = yield mysql_1.db.query({
            sql: `SELECT c.customer_name as customer, SUM(CASE WHEN r.receipt_type = 1 THEN price ELSE 0 END) AS alacak, SUM(CASE WHEN r.receipt_type = 2 THEN price ELSE 0 END) AS borc,
        SUM(CASE WHEN r.receipt_type = 1 THEN price ELSE 0 END) - SUM(CASE WHEN r.receipt_type = 2 THEN price ELSE 0 END) as net 
        FROM receipts r INNER JOIN customers c ON c.customer_id = r.customer_id 
        WHERE r.is_deleted = 0 AND c.is_deleted = 0 AND r.created_date BETWEEN ? AND ? group by c.customer_name ORDER BY c.customer_name`,
            values: [startDate, endDate],
        });
        return res.status(200).json(base_response_1.default.success(report, 200));
    }
    catch (e) {
        return res.status(500).json(base_response_1.default.fail(e.message, e.statusCode));
    }
});
exports.getReceiptReport = getReceiptReport;
