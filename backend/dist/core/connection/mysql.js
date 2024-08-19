"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const connectionConfig = {
    host: (_a = process.env.HOST) !== null && _a !== void 0 ? _a : "localhost",
    port: (_b = Number(process.env.DB_PORT)) !== null && _b !== void 0 ? _b : 3306,
    user: (_c = process.env.USER) !== null && _c !== void 0 ? _c : "root",
    database: (_d = process.env.SYS_DATABASE) !== null && _d !== void 0 ? _d : "sys",
    password: (_e = process.env.DATABASE) !== null && _e !== void 0 ? _e : "Skodal9901*",
};
const connection = mysql2_1.default.createConnection(connectionConfig);
const mainDb = (_f = process.env.DATABASE) !== null && _f !== void 0 ? _f : "veresiyedb";
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
const tableConfig = {
    host: (_g = process.env.HOST) !== null && _g !== void 0 ? _g : "localhost",
    port: (_h = Number(process.env.DB_PORT)) !== null && _h !== void 0 ? _h : 3306,
    user: (_j = process.env.ROOT) !== null && _j !== void 0 ? _j : "root",
    database: (_k = process.env.DATABASE) !== null && _k !== void 0 ? _k : "veresiyedb",
    password: (_l = process.env.PASSWORD) !== null && _l !== void 0 ? _l : "Skodal9901*",
};
const createTableConnection = mysql2_1.default.createConnection(tableConfig);
// Tablo oluşturma sorguları
const createTableUsersQuery = `
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
const createTableCustomersQuery = `
  CREATE TABLE IF NOT EXISTS customers (
  customer_id varchar(255) NOT NULL,
  customer_name varchar(255) NOT NULL,
  created_at varchar(255) NOT NULL,
  is_deleted tinyint unsigned NOT NULL DEFAULT '0',
  customer_address varchar(255) DEFAULT NULL,
  PRIMARY KEY(customer_id)
);
`;
const createTableReceiptsQuery = `
CREATE TABLE IF NOT EXISTS receipts (
  receipt_id varchar(255) NOT NULL,
  customer_id varchar(255) NOT NULL,
  description varchar(1024) NOT NULL,
  price float unsigned NOT NULL,
  receipt_type tinyint unsigned NOT NULL,
  created_date varchar(255) NOT NULL,
  is_deleted tinyint unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (receipt_id),
  UNIQUE KEY receipt_id_UNIQUE (receipt_id),
  UNIQUE KEY document_no_UNIQUE (document_no)
);
`;
createTableConnection.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL: " + err.stack);
        return;
    }
    console.log("Connected to MySQL as id " + createTableConnection.threadId);
    createTableConnection.query(createTableUsersQuery, (err, results, fields) => {
        if (err) {
            console.error("Error creating table: " + err.stack);
            return;
        }
        console.log("Table created successfully");
    });
    createTableConnection.query(createTableCustomersQuery, (err, results, fields) => {
        if (err) {
            console.error("Error creating table: " + err.stack);
            return;
        }
        console.log("Table created successfully");
    });
    createTableConnection.query(createTableReceiptsQuery, (err, results, fields) => {
        if (err) {
            console.error("Error creating table: " + err.stack);
            return;
        }
        console.log("Table created successfully");
        createTableConnection.end();
    });
});
const dbConfig = {
    host: (_m = process.env.HOST) !== null && _m !== void 0 ? _m : "localhost",
    port: (_o = Number(process.env.DB_PORT)) !== null && _o !== void 0 ? _o : "3306",
    user: (_p = process.env.ROOT) !== null && _p !== void 0 ? _p : "root",
    database: (_q = process.env.DATABASE) !== null && _q !== void 0 ? _q : "veresiyedb",
    password: (_r = process.env.DATABASE) !== null && _r !== void 0 ? _r : "Skodal9901*",
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
};
exports.db = mysql2_1.default.createPool(dbConfig).promise();
