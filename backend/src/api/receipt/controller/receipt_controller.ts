import BaseResponse from "../../../core/response/base_response";
import { db } from "../../../core/connection/mysql";
import { NextFunction, Request, Response } from "express";
import { createReceiptValidator } from "../validators/create_receipt_validator";
import { RowDataPacket } from "mysql2";
import * as ExcelJS from "exceljs";
import { ResponseStatus } from "../../../core/constants/response_status_enum";

export const createReceipt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { receipt_id, customer_id, created_date, price, description, receipt_type } = req.body;

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
        (receipt_id, customer_id, description, price, created_date, receipt_type)
        VALUES (?, ?, ?, ?, ?, ?)`,
      values: [receipt_id, customer_id, description, price, created_date, receipt_type],
    });

    return res.status(201).json(BaseResponse.success("Receipt created successfully!", ResponseStatus.SUCCESS));
  } catch (e: any) {
    return res.status(500).json(BaseResponse.fail(e.message, e.statusCode));
  }
};

export const fetchReceipts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, offset } = req.query;
    const [receipts] = await db.query<RowDataPacket[]>({
      sql: `SELECT * FROM receipts R LEFT JOIN customers C ON R.customer_id = C.customer_id WHERE R.is_deleted = 0 ORDER BY R.created_date DESC LIMIT 10 OFFSET ${offset}`,
      values: [userId],
    });
    return res.status(200).json(BaseResponse.success(receipts, ResponseStatus.SUCCESS));
  } catch (e: any) {
    return res.status(500).json(BaseResponse.fail(e.message, e.statusCode));
  }
};

export const deleteReceipt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { receipt_id } = req.body;
    await db.query<RowDataPacket[]>({
      sql: "UPDATE receipts SET is_deleted = 1 WHERE receipt_id = ?",
      values: [receipt_id],
    });
    res.status(200).json(BaseResponse.fail("Receipt deleted successfully!", ResponseStatus.SUCCESS));
  } catch (error: any) {
    res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};

export const updateReceipt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { receipt_id, price, description, receipt_type } = req.body;

    await db.query<RowDataPacket[]>({
      sql: "UPDATE receipts SET price = ?, description = ?, receipt_type = ? WHERE  receipt_id = ?",
      values: [price, description, receipt_type, receipt_id],
    });

    res.status(200).json(BaseResponse.success("Receipt updated successfully!", ResponseStatus.SUCCESS));
  } catch (error: any) {
    res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};

export const getReceiptById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { receipt_id } = req.query;
    const [receipt] = await db.query<RowDataPacket[]>({
      sql: `
      SELECT c.customer_name AS customer_name, r.receipt_id AS receipt_id, r.description AS description, r.price AS price, r.receipt_type AS receipt_type, r.created_date AS created_date
      FROM receipts r LEFT JOIN customers c ON c.customer_id = r.customer_id WHERE r.is_deleted = 0 AND receipt_id = ?`,
      values: [receipt_id],
    });

    res.status(200).json(BaseResponse.success(receipt[0], ResponseStatus.SUCCESS));
  } catch (error: any) {
    res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};

export const getReceiptReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [report] = await db.query<RowDataPacket[]>({
      sql: `SELECT c.customer_name as "Müşteri",
		  SUM(CASE WHEN r.receipt_type = 1 THEN price ELSE 0 END) AS "Alacak",
		  SUM(CASE WHEN r.receipt_type = 0 THEN price ELSE 0 END) AS "Borç",
        SUM(CASE WHEN r.receipt_type = 1 THEN price ELSE 0 END) - SUM(CASE WHEN r.receipt_type = 0 THEN price ELSE 0 END) as "Net Bakiye",
        MAX(created_date) as "Son Fatura Tarihi"
        FROM receipts r INNER JOIN customers c ON c.customer_id = r.customer_id
        WHERE r.is_deleted = 0 AND c.is_deleted = 0 group by c.customer_name ORDER BY c.customer_name`,
      values: [],
    });

    return res.status(200).json(BaseResponse.success(report, ResponseStatus.SUCCESS));
  } catch (e: any) {
    return res.status(500).json(BaseResponse.fail(e.message, e.statusCode));
  }
};

export const downloadReportExcel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [_report] = await db.query<RowDataPacket[]>({
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
    worksheet.getCell("A1").font = { ...font, bold: true };
    worksheet.getCell("B1").font = { ...font, bold: true };
    worksheet.getCell("C1").font = { ...font, bold: true };

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=Report.xlsx");
    res.send(buffer);
  } catch (e: any) {
    return res.status(500).json(BaseResponse.fail(e.message, e.statusCode));
  }
};
