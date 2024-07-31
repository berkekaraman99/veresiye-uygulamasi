import BaseResponse from "../../../core/response/base_response";
import { db } from "../../../core/connection/mysql";
import { NextFunction, Request, Response } from "express";
import { createCustomerValidator } from "../validators/create_customer_validator";
import { RowDataPacket } from "mysql2";

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customer_name, customer_address, customer_id, created_date } = req.body;

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
      values: [customer_id, customer_name, customer_address, created_date],
    });

    res.status(201).json(BaseResponse.success("Customer created successfully", 201));
  } catch (error: any) {
    res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};

export const deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customer_id } = req.body;

    await db.query<RowDataPacket[]>({
      sql: "UPDATE customers SET is_deleted = ? WHERE customer_id = ?",
      values: [1, customer_id],
    });
    res.status(200).json(BaseResponse.success("Customer deleted successfully!", 200));
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

    res.status(200).json(BaseResponse.success("Customer updated successfully!", 200));
  } catch (error: any) {
    res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};

export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { offset } = req.query;
    const [customers] = await db.query<RowDataPacket[]>({
      sql: `SELECT * FROM customers WHERE is_deleted = ? ORDER BY customer_name`,
      values: [0],
    });
    console.log(customers);
    res.status(200).json(BaseResponse.success(customers, 200));
  } catch (error: any) {
    res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};

export const getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customer_id } = req.query;
    const [customer] = await db.query<RowDataPacket[]>({
      sql: `SELECT * FROM customers WHERE customer_id = ?`,
      values: [customer_id],
    });
    console.log(customer);
    res.status(200).json(BaseResponse.success(customer, 200));
  } catch (error: any) {
    res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};

export const searchCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text } = req.query;
    const [customers] = await db.query<RowDataPacket[]>({
      sql: "SELECT * FROM customers WHERE customer_name LIKE ? AND is_deleted = 0 ORDER BY customer_name LIMIT 10 OFFSET 0",
      values: ["%" + text + "%"],
    });
    res.status(200).json(BaseResponse.success(customers, 200));
  } catch (error: any) {
    res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};

export const fetchCustomerReceipts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customer_id } = req.query;
    const [receipts] = await db.query<RowDataPacket[]>({
      sql: "SELECT * FROM receipts WHERE customer_id = ? && receipts.is_deleted = ?",
      values: [customer_id, 0],
    });
    return res.status(200).json(BaseResponse.success(receipts, 200));
  } catch (e: any) {
    return res.status(500).json(BaseResponse.fail(e.message, e.statusCode));
  }
};
