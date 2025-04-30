import BaseResponse from "../../../core/response/base_response";
import { db } from "../../../core/connection/mysql";
import { NextFunction, Request, Response } from "express";
import { createCustomerValidator } from "../validators/create_customer_validator";
import { RowDataPacket } from "mysql2";
import { ResponseStatus } from "../../../core/constants/response_status_enum";

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customer_name, customer_address, customer_id, created_at } = req.body;
    await createCustomerValidator
      .validate({
        customer_name,
      })
      .catch((_) => {
        throw new Error("Validation Error");
      });
    const checkIsCustomerUnique = await db.query<RowDataPacket[]>({
      sql: "SELECT * FROM customers WHERE customer_id = ?",
      values: [customer_id],
    });
    if (checkIsCustomerUnique[0].length !== 0) {
      return res.status(200).json(BaseResponse.fail("Customer is already exists", 1013));
    }

    await db.query({
      sql: "INSERT INTO customers (customer_id, customer_name, customer_address, created_at) VALUES (?, ?, ?, ?)",
      values: [customer_id, customer_name, customer_address, created_at],
    });
    res.status(200).json(BaseResponse.success("Customer created successfully", ResponseStatus.SUCCESS));
  } catch (error: any) {
    res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};

export const deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customer_id } = req.body;
    await db.query<RowDataPacket[]>({
      sql: "UPDATE customers SET is_deleted = 1 WHERE customer_id = ?",
      values: [customer_id],
    });
    res.status(200).json(BaseResponse.success("Customer deleted successfully!", ResponseStatus.SUCCESS));
  } catch (error: any) {
    res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customer_name, customer_address, customer_id } = req.body;
    await db.query<RowDataPacket[]>({
      sql: "UPDATE customers SET customer_name = ?, customer_address = ? WHERE customer_id = ?",
      values: [customer_name, customer_address, customer_id],
    });
    res.status(200).json(BaseResponse.success("Customer updated successfully!", ResponseStatus.SUCCESS));
  } catch (error: any) {
    res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};

export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { offset } = req.query;
    const page = Number(offset);
    const [result] = await db.query<RowDataPacket[]>({
      sql: `
        SELECT 
            c.customer_id, 
            c.customer_name, 
            c.created_at, 
            c.customer_address, 
            SUM(CASE WHEN r.receipt_type = 1 THEN r.price ELSE 0 END) - 
            SUM(CASE WHEN r.receipt_type = 0 THEN r.price ELSE 0 END) AS "net_bakiye"
        FROM 
            customers AS c
        LEFT JOIN 
            receipts AS r 
        ON 
            c.customer_id = r.customer_id
        WHERE 
            c.is_deleted = 0
        GROUP BY 
            c.customer_id, c.customer_name, c.created_at, c.customer_address
        ORDER BY 
            c.customer_name
        LIMIT 
            15 
        OFFSET 
            ?
        ;
        SELECT COUNT(*) AS total FROM customers WHERE is_deleted = 0;
        SELECT CEIL(COUNT(*) / 15) AS totalPages FROM customers;
      `,
      values: [page],
    });
    // console.log(customers);

    res.status(200).json(BaseResponse.success(result, ResponseStatus.SUCCESS));
  } catch (error: any) {
    res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};

export const getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customer_id } = req.query;
    const [customer] = await db.query<RowDataPacket[]>({
      sql: `
      SELECT 
        C.customer_id, 
        C.customer_name, 
        C.created_at, 
        C.is_deleted, 
        C.customer_address, 
        SUM(CASE WHEN R.receipt_type = 1 THEN price ELSE 0 END) - SUM(CASE WHEN R.receipt_type = 0 THEN price ELSE 0 END) as "net_bakiye"
      FROM 
        customers AS C 
      LEFT JOIN 
        receipts AS R 
      ON 
        C.customer_id = R.customer_id 
      WHERE 
        C.customer_id = ?;`,
      values: [customer_id],
    });
    res.status(200).json(BaseResponse.success(customer, ResponseStatus.SUCCESS));
  } catch (error: any) {
    res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};

export const searchCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text } = req.query;
    const textQuery = "%" + text + "%";
    const [customers] = await db.query<RowDataPacket[]>({
      sql: "SELECT * FROM customers WHERE customer_name LIKE ? AND is_deleted = 0 ORDER BY customer_name LIMIT 8",
      values: [textQuery],
    });
    res.status(200).json(BaseResponse.success(customers, ResponseStatus.SUCCESS));
  } catch (error: any) {
    res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};

export const getCustomerReceipts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customer_id, offset } = req.query;
    const [receipts] = await db.query<RowDataPacket[]>({
      sql: `SELECT receipt_id, description, price, receipt_type, created_at, updated_at FROM receipts WHERE is_deleted = 0 AND customer_id = ? ORDER BY created_at ASC LIMIT 10 OFFSET ${offset};
            SELECT COUNT(*) AS total FROM receipts WHERE is_deleted = 0 AND customer_id = ?;
            SELECT CEIL(COUNT(*) / 15) AS totalPages FROM receipts WHERE is_deleted = 0 AND customer_id = ?;`,
      values: [customer_id, customer_id, customer_id],
    });
    res.status(200).json(BaseResponse.success(receipts, ResponseStatus.SUCCESS));
  } catch (error: any) {
    res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};
