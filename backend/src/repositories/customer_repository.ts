import { db } from "../config/mariadb";
import { CreateCustomerDto } from "../dtos/customer/create_customer_dto";
import { UpdateCustomerDto } from "../dtos/customer/update_customer_dto";
import { QueryObject } from "../helpers/query_object";
import { ICustomerRepository } from "../interfaces/icustomer_repository";
import { v4 as uuidv4 } from "uuid";

export class CustomerRepository implements ICustomerRepository {
  async createCustomerAsync(c: CreateCustomerDto) {
    const customer_id = uuidv4();
    const created_at = new Date().toISOString().slice(0, 16);

    await db.query(
      "INSERT INTO customers (customer_id, customer_name, customer_address, created_at, phone_number) VALUES (?, ?, ?, ?, ?)",
      [
        customer_id,
        c.customer_name,
        c.customer_address,
        created_at,
        c.phone_number,
      ],
    );
    return c;
  }

  async deleteCustomerAsync(customer_id: string) {
    await db.query(
      "UPDATE customers SET is_deleted = 1 WHERE customer_id = ?",
      [customer_id],
    );

    return "Customer deleted successfully!";
  }

  async updateCustomerAsync(c: UpdateCustomerDto) {
    const updated_at = new Date().toISOString().slice(0, 16);
    await db.query(
      "UPDATE customers SET customer_name = ?, customer_address = ?, phone_number = ?, updated_at = ? WHERE customer_id = ?",
      [
        c.customer_name,
        c.customer_address,
        c.phone_number,
        updated_at,
        c.customer_id,
      ],
    );

    return "Customer updated successfully!";
  }

  async getCustomersAsync(offset: number, pLimit: number) {
    const pageOffset = offset;
    const pageLimit = pLimit;

    const [customers, totalRows] = await Promise.all([
      db.query(
        `SELECT c.customer_id, c.customer_name, c.created_at, c.customer_address,
          COALESCE(SUM(CASE r.receipt_type WHEN 1 THEN r.price WHEN 0 THEN -r.price END), 0) AS net_bakiye
          FROM (SELECT * FROM customers WHERE is_deleted = 0
                ORDER BY customer_name LIMIT ? OFFSET ?) c
          LEFT JOIN receipts r ON r.customer_id = c.customer_id AND r.is_deleted = 0
          GROUP BY c.customer_id, c.customer_name, c.created_at, c.customer_address
          ORDER BY c.customer_name;`,
        [pageLimit, pageOffset],
      ),
      db.query(`SELECT COUNT(*) AS total FROM customers WHERE is_deleted = 0`),
    ]);

    const total = totalRows[0].total;
    const totalPages = Math.ceil(total / 15);

    return { customers, total, totalPages };
  }

  async getAllCustomersAsync() {
    const [customers, totalRows] = await Promise.all([
      db.query(
        `
        SELECT 
            c.customer_id, 
            c.customer_name, 
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
      `,
      ),
      db.query("SELECT COUNT(*) AS total FROM customers WHERE is_deleted = 0"),
    ]);

    const total = totalRows[0].total;
    const totalPages = Math.ceil(total / 15);

    return { customers, total, totalPages };
  }

  async getCustomerByIdAsync(customer_id: string) {
    const customer = await db.query(
      `SELECT
      C.customer_id,
      C.customer_name,
      C.created_at,
      C.is_deleted,
      C.customer_address,
      C.phone_number,
      COALESCE(
        SUM(CASE R.receipt_type WHEN 1 THEN R.price WHEN 0 THEN -R.price END),
        0
      ) AS net_bakiye
    FROM customers AS C
    LEFT JOIN receipts AS R
      ON R.customer_id = C.customer_id AND R.is_deleted = 0
    WHERE C.customer_id = ?
    GROUP BY C.customer_id`,
      [customer_id],
    );

    return customer[0];
  }

  async searchCustomersAsync(text: string) {
    const textQuery = `%${text}%`;
    const customers = await db.query(
      "SELECT * FROM customers WHERE customer_name LIKE ? AND is_deleted = 0 ORDER BY customer_name LIMIT 8",
      [textQuery],
    );

    return customers;
  }
  async getCustomerReceiptsAsync(query: QueryObject) {
    const { customer_id, offset } = query;

    const [receipts, totalRows] = await Promise.all([
      db.query(
        `SELECT receipt_id, description, price, receipt_type, created_at, updated_at FROM receipts WHERE is_deleted = 0 AND customer_id = ? ORDER BY created_at ASC LIMIT 10 OFFSET ${offset}`,
        [customer_id, offset],
      ),
      db.query(
        `SELECT COUNT(*) AS total FROM receipts WHERE is_deleted = 0 AND customer_id = ?`,
        [customer_id],
      ),
    ]);

    const total = totalRows[0].total;
    const totalPages = Math.ceil(total / 10);

    return { receipts, total, totalPages };
  }
  async getLastCustomersAsync() {
    const customers = await db.query(
      `SELECT c.customer_id, c.customer_name, c.created_at, c.customer_address,
        COALESCE(SUM(CASE r.receipt_type WHEN 1 THEN r.price WHEN 0 THEN -r.price END), 0) AS net_bakiye
          FROM (SELECT * FROM customers WHERE is_deleted = 0
                ORDER BY customer_name LIMIT 3) c
        LEFT JOIN receipts r ON r.customer_id = c.customer_id AND r.is_deleted = 0
        GROUP BY c.customer_id, c.customer_name, c.created_at, c.customer_address
        ORDER BY c.customer_name;`,
    );
    return customers;
  }
}
