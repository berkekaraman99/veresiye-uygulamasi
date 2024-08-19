"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.downloadReportExcel = exports.getReceiptReport = exports.getReceiptById = exports.updateReceipt = exports.deleteReceipt = exports.fetchReceipts = exports.createReceipt = void 0;
const base_response_1 = __importDefault(require("../../../core/response/base_response"));
const mysql_1 = require("../../../core/connection/mysql");
const create_receipt_validator_1 = require("../validators/create_receipt_validator");
const ExcelJS = __importStar(require("exceljs"));
const response_status_enum_1 = require("../../../core/constants/response_status_enum");
const createReceipt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { receipt_id, customer_id, created_date, price, description, receipt_type } = req.body;
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
        (receipt_id, customer_id, description, price, created_date, receipt_type)
        VALUES (?, ?, ?, ?, ?, ?)`,
            values: [receipt_id, customer_id, description, price, created_date, receipt_type],
        });
        return res.status(201).json(base_response_1.default.success("Receipt created successfully!", response_status_enum_1.ResponseStatus.SUCCESS));
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
        return res.status(200).json(base_response_1.default.success(receipts, response_status_enum_1.ResponseStatus.SUCCESS));
    }
    catch (e) {
        return res.status(500).json(base_response_1.default.fail(e.message, e.statusCode));
    }
});
exports.fetchReceipts = fetchReceipts;
const deleteReceipt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { receipt_id } = req.body;
        yield mysql_1.db.query({
            sql: "UPDATE receipts SET is_deleted = 1 WHERE receipt_id = ?",
            values: [receipt_id],
        });
        res.status(200).json(base_response_1.default.fail("Receipt deleted successfully!", response_status_enum_1.ResponseStatus.SUCCESS));
    }
    catch (error) {
        res.status(500).json(base_response_1.default.fail(error.message, error.statusCode));
    }
});
exports.deleteReceipt = deleteReceipt;
const updateReceipt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { receipt_id, price, description, receipt_type } = req.body;
        yield mysql_1.db.query({
            sql: "UPDATE receipts SET price = ?, description = ?, receipt_type = ? WHERE  receipt_id = ?",
            values: [price, description, receipt_type, receipt_id],
        });
        res.status(200).json(base_response_1.default.success("Receipt updated successfully!", response_status_enum_1.ResponseStatus.SUCCESS));
    }
    catch (error) {
        res.status(500).json(base_response_1.default.fail(error.message, error.statusCode));
    }
});
exports.updateReceipt = updateReceipt;
const getReceiptById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { receipt_id } = req.query;
        const [receipt] = yield mysql_1.db.query({
            sql: `
      SELECT c.customer_name AS customer_name, r.receipt_id AS receipt_id, r.description AS description, r.price AS price, r.receipt_type AS receipt_type, r.created_date AS created_date
      FROM receipts r LEFT JOIN customers c ON c.customer_id = r.customer_id WHERE r.is_deleted = 0 AND receipt_id = ?`,
            values: [receipt_id],
        });
        res.status(200).json(base_response_1.default.success(receipt[0], response_status_enum_1.ResponseStatus.SUCCESS));
    }
    catch (error) {
        res.status(500).json(base_response_1.default.fail(error.message, error.statusCode));
    }
});
exports.getReceiptById = getReceiptById;
const getReceiptReport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [report] = yield mysql_1.db.query({
            sql: `SELECT c.customer_name as "Müşteri",
		  SUM(CASE WHEN r.receipt_type = 1 THEN price ELSE 0 END) AS "Alacak",
		  SUM(CASE WHEN r.receipt_type = 0 THEN price ELSE 0 END) AS "Borç",
        SUM(CASE WHEN r.receipt_type = 1 THEN price ELSE 0 END) - SUM(CASE WHEN r.receipt_type = 0 THEN price ELSE 0 END) as "Net Bakiye",
        MAX(created_date) as "Son Fatura Tarihi"
        FROM receipts r INNER JOIN customers c ON c.customer_id = r.customer_id
        WHERE r.is_deleted = 0 AND c.is_deleted = 0 group by c.customer_name ORDER BY c.customer_name`,
            values: [],
        });
        return res.status(200).json(base_response_1.default.success(report, response_status_enum_1.ResponseStatus.SUCCESS));
    }
    catch (e) {
        return res.status(500).json(base_response_1.default.fail(e.message, e.statusCode));
    }
});
exports.getReceiptReport = getReceiptReport;
const downloadReportExcel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [_report] = yield mysql_1.db.query({
            sql: `SELECT c.customer_name as "Müşteri",
		  SUM(CASE WHEN r.receipt_type = 1 THEN price ELSE 0 END) AS "Alacak",
		  SUM(CASE WHEN r.receipt_type = 0 THEN price ELSE 0 END) AS "Borç",
        SUM(CASE WHEN r.receipt_type = 1 THEN price ELSE 0 END) - SUM(CASE WHEN r.receipt_type = 0 THEN price ELSE 0 END) as "Net Bakiye",
        MAX(created_date) as "Son Fatura Tarihi"
        FROM receipts r INNER JOIN customers c ON c.customer_id = r.customer_id
        WHERE r.is_deleted = 0 AND c.is_deleted = 0 group by c.customer_name ORDER BY c.customer_name`,
            values: [],
        });
        const report = _report;
        // console.log(report);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Report");
        const font = { name: "Calibri", size: 14 };
        worksheet.columns = [
            { header: "Müşteri", key: "customer", width: 50 },
            // { header: "Alacak", key: "alacak", width: 24 },
            // { header: "Borç", key: "borc", width: 24 },
            { header: "Tarihi", key: "tarih", width: 16 },
            { header: "Bakiye", key: "bakiye", width: 20 },
        ];
        const colA = worksheet.getColumn("customer");
        // const colB = worksheet.getColumn("alacak");
        // const colC = worksheet.getColumn("borc");
        const colD = worksheet.getColumn("tarih");
        const colE = worksheet.getColumn("bakiye");
        const cols = [colA, colD, colE];
        colA.numFmt = "@";
        // colB.numFmt = "₺#,##0.00";
        // colC.numFmt = "₺#,##0.00";
        colD.numFmt = "yyyy-mm-dd";
        colE.numFmt = "₺#,##0.00";
        for (let i = 0; i < report.length; i++) {
            if (report[i]["Net Bakiye"] !== 0) {
                worksheet.addRow({
                    customer: report[i]["Müşteri"],
                    // alacak: report[i]["Alacak"],
                    // borc: report[i]["Borç"],
                    tarih: report[i]["Son Fatura Tarihi"].slice(0, 10),
                    bakiye: report[i]["Net Bakiye"],
                });
            }
        }
        cols.forEach((col) => {
            col.eachCell({ includeEmpty: false }, (cell, rowNumber) => {
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
                cell.font = font;
            });
        });
        worksheet.getCell("A1").alignment = { vertical: "middle", horizontal: "center" };
        worksheet.getCell("B1").alignment = { vertical: "middle", horizontal: "center" };
        worksheet.getCell("C1").alignment = { vertical: "middle", horizontal: "center" };
        worksheet.getCell("A1").font = Object.assign(Object.assign({}, font), { bold: true });
        worksheet.getCell("B1").font = Object.assign(Object.assign({}, font), { bold: true });
        worksheet.getCell("C1").font = Object.assign(Object.assign({}, font), { bold: true });
        const buffer = yield workbook.xlsx.writeBuffer();
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=Report.xlsx");
        res.send(buffer);
    }
    catch (e) {
        return res.status(500).json(base_response_1.default.fail(e.message, e.statusCode));
    }
});
exports.downloadReportExcel = downloadReportExcel;
