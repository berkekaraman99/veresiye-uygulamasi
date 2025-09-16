import { db } from "../config/mysql";
import { createCustomerValidator } from "../models/create_customer_validator";
import { RowDataPacket } from "mysql2";
import { ResponseStatus } from "../constants/response_status_enum";

interface ICreateCustomer {
  customer_name: string;
  customer_address?: string;
  customer_id: string;
  created_at: string;
  phone_number: string;
}

export const createCustomerService = async (body: ICreateCustomer) => {
  try {
    const { customer_name, customer_address, customer_id, created_at, phone_number } = body;
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
      return { status: 200, data: "Customer is already exists", responseStatus: 1013 };
    }

    await db.query({
      sql: "INSERT INTO customers (customer_id, customer_name, customer_address, created_at, phone_number) VALUES (?, ?, ?, ?, ?)",
      values: [customer_id, customer_name, customer_address, created_at, phone_number],
    });
    return { status: 200, data: "Customer created successfully", responseStatus: ResponseStatus.SUCCESS };
  } catch (error: any) {
    return { status: 500, data: error.message, responseStatus: error.statusCode };
  }
};

export const deleteCustomerService = async (customer_id: string) => {
  try {
    await db.query<RowDataPacket[]>({
      sql: "UPDATE customers SET is_deleted = 1 WHERE customer_id = ?",
      values: [customer_id],
    });

    return { status: 200, data: "Customer deleted successfully!", responseStatus: ResponseStatus.SUCCESS };
  } catch (error: any) {
    return { status: 500, data: error.message, responseStatus: error.statusCode };
  }
};

export const updateCustomerService = async (body: any) => {
  try {
    const { customer_name, customer_address, phone_number, customer_id } = body;
    await db.query<RowDataPacket[]>({
      sql: "UPDATE customers SET customer_name = ?, customer_address = ?, phone_number = ? WHERE customer_id = ?",
      values: [customer_name, customer_address, phone_number, customer_id],
    });

    return { status: 200, data: "Customer updated successfully!", responseStatus: ResponseStatus.SUCCESS };
  } catch (error: any) {
    return { status: 500, data: error.message, responseStatus: error.statusCode };
  }
};

export const getCustomersService = async (offset: number) => {
  try {
    const page = offset;
    const [result] = await db.query<RowDataPacket[]>({
      sql: `
        SELECT 
            c.customer_id, 
            c.customer_name, 
            c.created_at, 
            c.customer_address, 
            SUM(CASE WHEN r.receipt_type = 1 AND r.is_deleted = 0 THEN r.price ELSE 0 END) - 
            SUM(CASE WHEN r.receipt_type = 0 AND r.is_deleted = 0 THEN r.price ELSE 0 END) AS "net_bakiye"
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

    return { status: 200, data: result, responseStatus: ResponseStatus.SUCCESS };
  } catch (error: any) {
    return { status: 500, data: error.message, responseStatus: error.statusCode };
  }
};

export const getCustomerByIdService = async (customer_id: string) => {
  try {
    const [customer] = await db.query<RowDataPacket[]>({
      sql: `
      SELECT 
        C.customer_id, 
        C.customer_name, 
        C.created_at, 
        C.is_deleted, 
        C.customer_address,
        C.phone_number, 
        SUM(CASE WHEN R.receipt_type = 1 AND r.is_deleted = 0 THEN price ELSE 0 END) - SUM(CASE WHEN R.receipt_type = 0 AND r.is_deleted = 0 THEN price ELSE 0 END) as "net_bakiye"
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

    return { status: 200, data: customer, responseStatus: ResponseStatus.SUCCESS };
  } catch (error: any) {
    return { status: 500, data: error.message, responseStatus: error.statusCode };
  }
};

export const getCustomerByNameService = async (customer_name: string) => {
  try {
    const [customer] = await db.query<RowDataPacket[]>({
      sql: `
      SELECT 
        C.customer_id, 
        C.customer_name, 
        C.created_at, 
        C.is_deleted, 
        C.customer_address, 
        C.phone_number,
        COALESCE(SUM(CASE WHEN R.receipt_type = 1 AND r.is_deleted = 0 THEN price ELSE 0 END)) - COALESCE(SUM(CASE WHEN R.receipt_type = 0 AND r.is_deleted = 0 THEN price ELSE 0 END)) as "net_bakiye"
      FROM 
        customers AS C 
      LEFT JOIN 
        receipts AS R 
      ON 
        C.customer_id = R.customer_id 
      WHERE 
        C.customer_name = ?
      GROUP BY 
        C.customer_id, C.customer_name, C.created_at, C.is_deleted, C.customer_address;`,
      values: [customer_name],
    });

    return { status: 200, data: customer, responseStatus: ResponseStatus.SUCCESS };
  } catch (error: any) {
    return { status: 500, data: error.message, responseStatus: error.statusCode };
  }
};

export const searchCustomersService = async (text: string) => {
  try {
    const textQuery = "%" + text + "%";
    const [customers] = await db.query<RowDataPacket[]>({
      sql: "SELECT * FROM customers WHERE customer_name LIKE ? AND is_deleted = 0 ORDER BY customer_name LIMIT 8",
      values: [textQuery],
    });

    return { status: 200, data: customers, responseStatus: ResponseStatus.SUCCESS };
  } catch (error: any) {
    return { status: 500, data: error.message, responseStatus: error.statusCode };
  }
};

export const getCustomerReceiptsService = async (query: any) => {
  try {
    const { customer_id, offset } = query;
    const [receipts] = await db.query<RowDataPacket[]>({
      sql: `SELECT receipt_id, description, price, receipt_type, created_at, updated_at FROM receipts WHERE is_deleted = 0 AND customer_id = ? ORDER BY created_at ASC LIMIT 10 OFFSET ${offset};
            SELECT COUNT(*) AS total FROM receipts WHERE is_deleted = 0 AND customer_id = ?;
            SELECT CEIL(COUNT(*) / 10) AS totalPages FROM receipts WHERE is_deleted = 0 AND customer_id = ?;`,
      values: [customer_id, customer_id, customer_id],
    });

    return { status: 200, data: receipts, responseStatus: ResponseStatus.SUCCESS };
  } catch (error: any) {
    return { status: 500, data: error.message, responseStatus: error.statusCode };
  }
};

export const getLastCustomersService = async () => {
  try {
    const [customers] = await db.query<RowDataPacket[]>({
      sql: `SELECT 
            c.customer_id, 
            c.customer_name, 
            c.created_at, 
            c.customer_address, 
            SUM(CASE WHEN r.receipt_type = 1 AND r.is_deleted = 0 THEN r.price ELSE 0 END) - 
            SUM(CASE WHEN r.receipt_type = 0 AND r.is_deleted = 0 THEN r.price ELSE 0 END) AS "net_bakiye"
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
            c.created_at DESC
        LIMIT 
            3;`,
    });
    return { status: 200, data: customers, responseStatus: ResponseStatus.SUCCESS };
  } catch (error: any) {
    return { status: 500, data: error.message, responseStatus: error.statusCode };
  }
};
