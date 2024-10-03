import mysql, { ConnectionOptions, PoolOptions, RowDataPacket } from "mysql2";

const connectionConfig: ConnectionOptions = {
  host: process.env.HOST ?? "localhost",
  port: Number(process.env.DB_PORT) ?? 3306,
  user: process.env.USER ?? "root",
  database: process.env.SYS_DATABASE ?? "sys",
  password: process.env.PASSWORD ?? "Skodal9901*",
};
const connection = mysql.createConnection(connectionConfig);

const createTableUsers = `
CREATE TABLE IF NOT EXISTS users (
  id varchar(255) NOT NULL,
  company_name varchar(255) NOT NULL,
  user_name varchar(45) NOT NULL,
  hashed_password varchar(255) NOT NULL,
  created_at varchar(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY id_UNIQUE (id),
  UNIQUE KEY user_name_UNIQUE (user_name)
);
`;

const createTableCustomers = `
CREATE TABLE IF NOT EXISTS customers (
  customer_id varchar(255) NOT NULL,
  customer_name varchar(255) NOT NULL,
  created_at varchar(255) NOT NULL,
  is_deleted tinyint unsigned NOT NULL DEFAULT '0',
  customer_address varchar(255) DEFAULT NULL,
  PRIMARY KEY(customer_id)
);
`;
const createTableReceipts = `
CREATE TABLE IF NOT EXISTS receipts (
  receipt_id varchar(255) NOT NULL,
  customer_id varchar(255) NOT NULL,
  description varchar(1024) NOT NULL,
  price float unsigned NOT NULL,
  receipt_type tinyint unsigned NOT NULL,
  created_date varchar(255) NOT NULL,
  is_deleted tinyint unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (receipt_id),
  UNIQUE KEY receipt_id_UNIQUE (receipt_id)
);`;

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

      connection.query(createTableUsers, (err, results) => {
        if (err) {
          console.error("Kullanıcı tablosu oluşturulamadı, ", err);
          return;
        }
        console.log("Kullanıcı tablosu oluşturuldu.");

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
};

export const db = mysql.createPool(dbConfig).promise();
