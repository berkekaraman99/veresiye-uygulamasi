import mysql, { ConnectionOptions, PoolOptions, RowDataPacket } from "mysql2";

const connectionConfig: ConnectionOptions = {
  host: process.env.HOST ?? "localhost",
  port: Number(process.env.DB_PORT) ?? 3306,
  user: process.env.USER ?? "root",
  database: process.env.SYS_DATABASE ?? "sys",
  password: process.env.DATABASE ?? "Skodal9901*",
};

const createTableConnectionConfig: ConnectionOptions = {
  host: process.env.HOST ?? "localhost",
  port: Number(process.env.DB_PORT) ?? 3306,
  user: process.env.USER ?? "root",
  database: process.env.SYS_DATABASE ?? "veresiyedb",
  password: process.env.DATABASE ?? "Skodal9901*",
};

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

const connection = mysql.createConnection(connectionConfig);
let createTableConnection;
const mainDb = process.env.DATABASE ?? "veresiyedb";
const createDatabaseQuery = "CREATE DATABASE IF NOT EXISTS " + mainDb;

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);

  connection.query(createDatabaseQuery, (err, results, fields) => {
    if (err) {
      console.error("Error creating database: " + err.stack);
      return;
    }
    console.log("New database created successfully");

    connection.end();
  });
});

createTableConnection = mysql.createConnection(createTableConnectionConfig);

createTableConnection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);

  createTableConnection.query<RowDataPacket[]>(createTableUsers, (err, results, fields) => {
    if (err) {
      console.error("Error creating table: " + err.stack);
      return;
    }
    console.log("Users table created successfully");
  });

  createTableConnection.query<RowDataPacket[]>(createTableCustomers, (err, results, fields) => {
    if (err) {
      console.error("Error creating table: " + err.stack);
      return;
    }
    console.log("Customers table created successfully");
  });

  createTableConnection.query<RowDataPacket[]>(createTableReceipts, (err, results, fields) => {
    if (err) {
      console.error("Error creating table: " + err.stack);
      return;
    }
    console.log("Receipts table created successfully");
  });
});

const dbConfig: PoolOptions = {
  ...createTableConnectionConfig,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

export const db = mysql.createPool(dbConfig).promise();
