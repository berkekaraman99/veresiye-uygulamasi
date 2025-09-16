import mysql, { ConnectionOptions, PoolOptions, RowDataPacket } from "mysql2";

const connectionConfig: ConnectionOptions = {
  host: process.env.HOST ?? "localhost",
  port: Number(process.env.DB_PORT) ?? 3306,
  user: process.env.USER ?? "root",
  database: process.env.SYS_DATABASE ?? "sys",
  password: process.env.PASSWORD ?? "Skodal9901*",
};
const connection = mysql.createConnection(connectionConfig);

const createTableCustomers = `
CREATE TABLE IF NOT EXISTS customers (
  customer_id varchar(255) NOT NULL,
  customer_name varchar(255) NOT NULL,
  customer_address varchar(255) DEFAULT NULL,
  created_at varchar(255) DEFAULT NULL,
  updated_at varchar(255) DEFAULT NULL,
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
  price double unsigned NOT NULL,
  receipt_type tinyint unsigned NOT NULL,
  created_at varchar(255) DEFAULT NULL,
  updated_at varchar(255) DEFAULT NULL,
  is_deleted tinyint unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (receipt_id),
  UNIQUE KEY receipt_id_UNIQUE (receipt_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`;

const createDatabaseAndTables = () => {
  connection.query("CREATE DATABASE IF NOT EXISTS veresiyedb", (err, result) => {
    if (err) {
      console.error("Veritabanı oluşturulamadı, ", err);
      return;
    }
    console.log("Veritabanı başarıyla oluşturuldu");

    connection.changeUser({ database: process.env.DATABASE ?? "veresiyedb" }, (err) => {
      if (err) {
        console.error("Veritabanı seçilemedi, ", err);
        return;
      }

      connection.query(createTableCustomers, (err, results) => {
        if (err) {
          console.error("Müşteri tablosu oluşturulamadı, ", err);
          return;
        }
        console.log("Müşteri tablosu oluşturuldu.");

        connection.query(createTableReceipts, (err, results) => {
          if (err) {
            console.error("Fatura tablosu oluşturulamadı, ", err);
            return;
          }
          console.log("Fatura tablosu oluşturuldu.");
        });
      });
    });
  });
};

createDatabaseAndTables();

const dbConfig: PoolOptions = {
  host: process.env.HOST ?? "localhost",
  port: Number(process.env.DB_PORT) ?? 3306,
  user: process.env.USER ?? "root",
  database: process.env.DATABASE ?? "veresiyedb",
  password: process.env.PASSWORD ?? "Skodal9901*",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  multipleStatements: true,
};

export const db = mysql.createPool(dbConfig).promise();
