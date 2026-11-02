import mariadb from "mariadb";
import dotenv from "dotenv";
dotenv.config();

const connectionConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "supersecret",
};

const createTableCustomers = `
CREATE TABLE IF NOT EXISTS customers (
  customer_id varchar(255) NOT NULL,
  customer_name varchar(255) NOT NULL,
  customer_address varchar(255) DEFAULT NULL,
  created_at DATETIME DEFAULT NULL,
  updated_at DATETIME DEFAULT NULL,
  is_deleted tinyint unsigned NOT NULL DEFAULT '0',
  phone_number varchar(45) DEFAULT NULL,
  PRIMARY KEY (customer_id),
  UNIQUE KEY customer_id_UNIQUE (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`;

const createTableReceipts = `
CREATE TABLE IF NOT EXISTS receipts (
  receipt_id varchar(255) NOT NULL,
  customer_id varchar(255) NOT NULL,
  description varchar(1024) NOT NULL,
  price DECIMAL(12,2) unsigned NOT NULL,
  receipt_type tinyint unsigned NOT NULL,
  created_at DATETIME DEFAULT NULL,
  updated_at DATETIME DEFAULT NULL,
  is_deleted tinyint unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (receipt_id),
  UNIQUE KEY receipt_id_UNIQUE (receipt_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`;

const createCustomerIndex =
  "CREATE INDEX IF NOT EXISTS idx_customers_active_name ON customers (is_deleted, customer_name);";
const createReceiptIndexOne =
  "CREATE INDEX IF NOT EXISTS idx_receipts_customer ON receipts (customer_id, is_deleted, created_at);";
const createReceiptIndexTwo =
  "CREATE INDEX IF NOT EXISTS idx_receipts_active_date ON receipts (is_deleted, created_at);";

export const initializeDatabase = async () => {
  let connection;

  try {
    connection = await mariadb.createConnection(connectionConfig);

    await connection
      .query("CREATE DATABASE IF NOT EXISTS veresiyedb")
      .then(() => console.log("Veri tabanı başarıyla oluşturuldu."));
    await connection.end();

    const pool = mariadb.createPool({
      ...connectionConfig,
      database: "veresiyedb",
      connectionLimit: 5,
    });

    connection = await pool.getConnection();

    await connection
      .query(createTableCustomers)
      .then(() => console.log("Customers tablosu başarıyla oluşturuldu."));
    await connection
      .query(createTableReceipts)
      .then(() => console.log("Receipts tablosu başarıyla oluşturuldu."));

    await connection
      .query(createCustomerIndex)
      .then(() => console.log("Indeks 1 başarıyla oluşturuldu."));
    await connection
      .query(createReceiptIndexOne)
      .then(() => console.log("Indeks 2 başarıyla oluşturuldu."));
    await connection
      .query(createReceiptIndexTwo)
      .then(() => console.log("Indeks 3 başarıyla oluşturuldu."));

    connection.release();
    pool.end();
  } catch (error) {
    console.log(error);
    if (connection) {
      connection.end();
    }
  }
};

export const db = mariadb.createPool({
  host: process.env.HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  connectionLimit: 5,
  multipleStatements: false,
  bigIntAsNumber: true,
  decimalAsNumber: true,
});
