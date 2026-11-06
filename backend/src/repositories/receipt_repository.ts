import { db } from "../config/mariadb";
import { CreateReceiptDto } from "../dtos/receipt/create_receipt_dto";
import { UpdateReceiptDto } from "../dtos/receipt/update_receipt_dto";
import { IReceiptRepository } from "../interfaces/ireceipt_repository";
import * as ExcelJS from "exceljs";
import { v4 as uuidv4 } from "uuid";

export class ReceiptRepository implements IReceiptRepository {
  async createReceiptAsync(r: CreateReceiptDto) {
    const receipt_id = uuidv4();
    const created_at = new Date().toISOString().slice(0, 16);

    await db.query(
      `INSERT INTO receipts
            (receipt_id, customer_id, description, price, created_at, receipt_type)
            VALUES (?, ?, ?, ?, ?, ?)`,
      [
        receipt_id,
        r.customer_id,
        r.description,
        r.price,
        created_at,
        r.receipt_type,
      ],
    );

    return "Receipt created successfully!";
  }
  async fetchReceiptsAsync(offset: number) {
    const receipts = await db.query(
      `SELECT * FROM receipts R LEFT JOIN customers C ON R.customer_id = C.customer_id WHERE R.is_deleted = 0 ORDER BY R.created_at DESC LIMIT 10 OFFSET ?;`,
      [offset],
    );
    return receipts;
  }
  async deleteReceiptAsync(receipt_id: string) {
    await db.query("UPDATE receipts SET is_deleted = 1 WHERE receipt_id = ?", [
      receipt_id,
    ]);
    return "Receipt deleted successfully!";
  }
  async updateReceiptAsync(r: UpdateReceiptDto) {
    const updated_at = new Date().toISOString().slice(0, 16);

    await db.query(
      "UPDATE receipts SET price = ?, description = ?, receipt_type = ?, updated_at = ? WHERE  receipt_id = ?",
      [r.price, r.description, r.receipt_type, updated_at, r.receipt_id],
    );

    return "Receipt updated successfully!";
  }
  async getReceiptByIdAsync(receipt_id: string) {
    const receipt = await db.query(
      `
      SELECT c.customer_name AS customer_name, c.customer_id AS customer_id, r.receipt_id AS receipt_id, r.description AS description, r.price AS price, r.receipt_type AS receipt_type, r.created_at AS created_at
      FROM receipts r LEFT JOIN customers c ON c.customer_id = r.customer_id WHERE r.is_deleted = 0 AND receipt_id = ?`,
      [receipt_id],
    );

    return receipt[0];
  }
  async getReceiptReportAsync() {
    const report = await db.query(
      `SELECT c.customer_name as "Müşteri",
          SUM(CASE WHEN r.receipt_type = 1 AND r.is_deleted = 0 THEN price ELSE 0 END) AS "Alacak",
          SUM(CASE WHEN r.receipt_type = 0 AND r.is_deleted = 0 THEN price ELSE 0 END) AS "Borç",
          SUM(CASE WHEN r.receipt_type = 1 THEN price ELSE 0 END) - SUM(CASE WHEN r.receipt_type = 0 THEN price ELSE 0 END) as "Net Bakiye",
          MAX(r.created_at) as "Son Fatura Tarihi"
          FROM receipts r INNER JOIN customers c ON c.customer_id = r.customer_id
          WHERE r.is_deleted = 0 AND c.is_deleted = 0 
          GROUP BY c.customer_id
          HAVING 
          (SUM(CASE WHEN r.receipt_type = 1 AND r.is_deleted = 0 THEN price ELSE 0 END) 
          - SUM(CASE WHEN r.receipt_type = 0 AND r.is_deleted = 0 THEN price ELSE 0 END)) <> 0
          ORDER BY c.customer_name`,
    );

    return report;
  }
  async downloadReportExcelAsync() {
    const report = await db.query(
      `SELECT c.customer_name as "Müşteri",
              SUM(CASE WHEN r.receipt_type = 1 AND r.is_deleted = 0 THEN price ELSE 0 END) AS "Alacak",
              SUM(CASE WHEN r.receipt_type = 0 AND r.is_deleted = 0 THEN price ELSE 0 END) AS "Borç",
              SUM(CASE WHEN r.receipt_type = 1 THEN price ELSE 0 END) - SUM(CASE WHEN r.receipt_type = 0 THEN price ELSE 0 END) as "Net Bakiye",
              MAX(r.created_at) as "Son Fatura Tarihi"
              FROM receipts r INNER JOIN customers c ON c.customer_id = r.customer_id
              WHERE r.is_deleted = 0 AND c.is_deleted = 0 
              GROUP BY c.customer_name HAVING 
              (SUM(CASE WHEN r.receipt_type = 1 AND r.is_deleted = 0 THEN price ELSE 0 END) 
              - SUM(CASE WHEN r.receipt_type = 0 AND r.is_deleted = 0 THEN price ELSE 0 END)) <> 0 
              ORDER BY c.customer_name`,
    );

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

    report.forEach(
      (item: {
        Müşteri: string;
        "Son Fatura Tarihi": Date;
        "Net Bakiye": number;
      }) => {
        worksheet.addRow({
          customer: item["Müşteri"],
          tarih: item["Son Fatura Tarihi"],
          bakiye: item["Net Bakiye"],
        });
      },
    );

    cols.forEach((col) => {
      col.eachCell?.({ includeEmpty: false }, (cell, rowNumber) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.font = font;
      });
    });

    worksheet.getCell("A1").alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell("B1").alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell("C1").alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell("A1").font = { ...font, bold: true };
    worksheet.getCell("B1").font = { ...font, bold: true };
    worksheet.getCell("C1").font = { ...font, bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
  async getLastReceiptsAsync() {
    const receipts = await db.query(
      `SELECT C.customer_name, R.receipt_type, R.price, R.receipt_id, R.created_at FROM receipts R LEFT JOIN customers C ON R.customer_id = C.customer_id WHERE R.is_deleted = 0 ORDER BY R.created_at DESC LIMIT 5;`,
    );

    return receipts;
  }
  async getDebtAndReceivableAsync() {
    const result = await db.query(
      `SELECT 
            FLOOR(SUM(CASE WHEN receipt_type = 1 THEN price ELSE 0 END)) as alacak, 
            FLOOR(SUM(CASE WHEN receipt_type = 0 THEN price ELSE 0 END)) as odeme 
            FROM receipts WHERE is_deleted = 0;`,
    );

    return result;
  }
}
