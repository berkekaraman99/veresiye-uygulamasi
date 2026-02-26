import mariadb from "mariadb";

export const db = mariadb.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "secret",
  database: "veresiyedb",
  connectionLimit: 5,
  multipleStatements: true,
  bigIntAsNumber: true,
  decimalAsNumber: true,
});
