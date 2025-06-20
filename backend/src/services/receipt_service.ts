import BaseResponse from "../utils/base_response";
import { db } from "../config/mysql";
import { NextFunction, Request, Response } from "express";
import { createReceiptValidator } from "../models/create_receipt_validator";
import { RowDataPacket } from "mysql2";
import * as ExcelJS from "exceljs";
import { ResponseStatus } from "../constants/response_status_enum";

interface ICreateReceipt {
  receipt_id: string;
  customer_id: string;
  created_at: string;
  price: number;
  description?: string;
  receipt_type: number;
}

export const createReceiptService = async (body: ICreateReceipt) => {
  try {
    const { receipt_id, customer_id, created_at, price, description, receipt_type } = body;
    await createReceiptValidator
      .validate({
        price,
        description,
      })
      .catch((_: any) => {
        throw new Error("Validation Error");
      });
    await db.query<RowDataPacket[]>({
      sql: `INSERT INTO receipts
        (receipt_id, customer_id, description, price, created_at, receipt_type)
        VALUES (?, ?, ?, ?, ?, ?)`,
      values: [receipt_id, customer_id, description, price, created_at, receipt_type],
    });

    return { status: 200, data: "Receipt created successfully!", responseStatus: ResponseStatus.SUCCESS };
  } catch (error: any) {
    return { status: 500, data: error.message, responseStatus: error.statusCode };
  }
};

export const fetchReceiptsService = async (user_id: string, offset: number) => {
  try {
    const [receipts] = await db.query<RowDataPacket[]>({
      sql: `SELECT * FROM receipts R LEFT JOIN customers C ON R.customer_id = C.customer_id WHERE R.is_deleted = 0 ORDER BY R.created_at DESC LIMIT 10 OFFSET ${offset}`,
      values: [user_id],
    });
    return { status: 200, data: receipts, responseStatus: ResponseStatus.SUCCESS };
  } catch (error: any) {
    return { status: 500, data: error.message, responseStatus: error.statusCode };
  }
};

export const deleteReceiptService = async (receipt_id: string) => {
  try {
    await db.query<RowDataPacket[]>({
      sql: "UPDATE receipts SET is_deleted = 1 WHERE receipt_id = ?",
      values: [receipt_id],
    });
    return { status: 200, data: "Receipt deleted successfully!", responseStatus: ResponseStatus.SUCCESS };
  } catch (error: any) {
    return { status: 500, data: error.message, responseStatus: error.statusCode };
  }
};

export const updateReceiptService = async (body: any) => {
  try {
    const { receipt_id, price, description, receipt_type } = body;
    await db.query<RowDataPacket[]>({
      sql: "UPDATE receipts SET price = ?, description = ?, receipt_type = ? WHERE  receipt_id = ?",
      values: [price, description, receipt_type, receipt_id],
    });

    return { status: 200, data: "Receipt updated successfully!", responseStatus: ResponseStatus.SUCCESS };
  } catch (error: any) {
    return { status: 500, data: error.message, responseStatus: error.statusCode };
  }
};

export const getReceiptByIdService = async (receipt_id: string) => {
  try {
    const [receipt] = await db.query<RowDataPacket[]>({
      sql: `
      SELECT c.customer_name AS customer_name, r.receipt_id AS receipt_id, r.description AS description, r.price AS price, r.receipt_type AS receipt_type, r.created_at AS created_at
      FROM receipts r LEFT JOIN customers c ON c.customer_id = r.customer_id WHERE r.is_deleted = 0 AND receipt_id = ?`,
      values: [receipt_id],
    });

    return { status: 200, data: receipt[0], responseStatus: ResponseStatus.SUCCESS };
  } catch (error: any) {
    return { status: 500, data: error.message, responseStatus: error.statusCode };
  }
};

export const getReceiptReportService = async () => {
  try {
    const [report] = await db.query<RowDataPacket[]>({
      sql: `SELECT c.customer_name as "Müşteri",
          SUM(CASE WHEN r.receipt_type = 1 THEN price ELSE 0 END) AS "Alacak",
          SUM(CASE WHEN r.receipt_type = 0 THEN price ELSE 0 END) AS "Borç",
        SUM(CASE WHEN r.receipt_type = 1 THEN price ELSE 0 END) - SUM(CASE WHEN r.receipt_type = 0 THEN price ELSE 0 END) as "Net Bakiye",
        MAX(r.created_at) as "Son Fatura Tarihi"
        FROM receipts r INNER JOIN customers c ON c.customer_id = r.customer_id
        WHERE r.is_deleted = 0 AND c.is_deleted = 0 group by c.customer_name ORDER BY c.customer_name`,
    });

    return { status: 200, data: report, responseStatus: ResponseStatus.SUCCESS };
  } catch (error: any) {
    return { status: 500, data: error.message, responseStatus: error.statusCode };
  }
};

export const downloadReportExcelServicce = async () => {
  try {
    const [report] = await db.query<RowDataPacket[]>({
      sql: `SELECT c.customer_name as "Müşteri",
          SUM(CASE WHEN r.receipt_type = 1 THEN price ELSE 0 END) AS "Alacak",
          SUM(CASE WHEN r.receipt_type = 0 THEN price ELSE 0 END) AS "Borç",
        SUM(CASE WHEN r.receipt_type = 1 THEN price ELSE 0 END) - SUM(CASE WHEN r.receipt_type = 0 THEN price ELSE 0 END) as "Net Bakiye",
        MAX(r.created_at) as "Son Fatura Tarihi"
        FROM receipts r INNER JOIN customers c ON c.customer_id = r.customer_id
        WHERE r.is_deleted = 0 AND c.is_deleted = 0 group by c.customer_name ORDER BY c.customer_name`,
    });

    // const report = _report;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");
    const font = { name: "Calibri", size: 14 };

    worksheet.columns = [
      { header: "Müşteri", key: "customer", width: 50 },
      { header: "Tarihi", key: "tarih", width: 16 },
      { header: "Bakiye", key: "bakiye", width: 20 },
    ];

    const colA = worksheet.getColumn("customer");
    const colD = worksheet.getColumn("tarih");
    const colE = worksheet.getColumn("bakiye");
    const cols = [colA, colD, colE];

    colA.numFmt = "@";
    colD.numFmt = "yyyy-mm-dd";
    colE.numFmt = "₺#,###.00";

    for (let i = 0; i < report.length; i++) {
      if (report[i]["Net Bakiye"] !== 0) {
        worksheet.addRow({
          customer: report[i]["Müşteri"],
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
    worksheet.getCell("A1").font = { ...font, bold: true };
    worksheet.getCell("B1").font = { ...font, bold: true };
    worksheet.getCell("C1").font = { ...font, bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  } catch (error: any) {
    return { status: 500, data: error.message, responseStatus: error.statusCode };
  }
};
