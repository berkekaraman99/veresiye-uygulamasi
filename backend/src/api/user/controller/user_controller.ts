import { loginValidator } from "../validators/login_validator";
import { db } from "../../../core/connection/mysql";
import { signUpValidator } from "../validators/signup_validator";
import { generateToken, decodeToken } from "../../../features/utils/token_helper";
import BaseResponse from "../../../core/response/base_response";
import { hashPassword, comparePassword } from "../../../features/utils/hash_password";
import { Request, Response, NextFunction } from "express";
import { RowDataPacket } from "mysql2";

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userName, password } = req.body;
    await loginValidator
      .validate({
        userName,
        password,
      })
      .catch((_: any) => {
        throw new Error("Validation Error");
      });

    const [row] = await db.query<RowDataPacket[]>({ sql: "SELECT * FROM users WHERE user_name = ?", values: [userName] });
    console.log(row[0]);
    if (row.length === 0) {
      return res.status(200).json(BaseResponse.success("Kullanıcı adı veya şifre yanlış", 1001));
    }
    if (!(await comparePassword(password, row[0].hashed_password))) {
      return res.status(200).json(BaseResponse.success("Kullanıcı adı veya şifre yanlış", 1001));
    }

    const token = generateToken({
      id: row[0].id,
    });

    return res.status(200).json(BaseResponse.success(token, 200));
  } catch (e: any) {
    return res.status(500).json(BaseResponse.fail(e.message, e.statusCode));
  }
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, companyName, userName, password, taxNumber, taxAdministration, taxAdministrationCity, createdAt } = req.body;
    await signUpValidator
      .validate({
        id,
        companyName,
        userName,
        password,
        taxNumber,
        taxAdministration,
        taxAdministrationCity,
      })
      .catch((_: any) => {
        throw new Error("Validation Error");
      });

    const hashedPassword = await hashPassword(password);

    const checkIsUserUnique = await db.query<RowDataPacket[]>({
      sql: "SELECT * FROM users WHERE user_name = ?",
      values: [userName],
    });

    const checkIsTaxNumberUnique = await db.query<RowDataPacket[]>({
      sql: "SELECT * FROM users WHERE tax_number = ?",
      values: [taxNumber],
    });

    if (checkIsUserUnique[0].length !== 0) {
      return res.status(200).json(BaseResponse.fail("Username is already exists", 1003));
    }

    if (checkIsTaxNumberUnique[0].length !== 0) {
      return res.status(200).json(BaseResponse.fail("Tax Number is already exists", 1004));
    }

    await db.query({
      sql: "INSERT INTO users (id, company_name, user_name, tax_number, tax_administration, tax_administration_city, hashed_password, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      values: [id, companyName, userName, taxNumber, taxAdministration, taxAdministrationCity, hashedPassword, createdAt],
    });

    const [getId] = await db.query<RowDataPacket[]>({
      sql: "SELECT * FROM users where user_name = ?",
      values: [userName],
    });

    const token = generateToken({
      id: getId[0].id,
    });

    return res.status(200).json(BaseResponse.success(token, 201));
  } catch (e: any) {
    return res.status(500).json(BaseResponse.fail(e.message, e.statusCode));
  }
};

export const getUserAfterLogin = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization!.split(" ")[1];
  try {
    const decodedToken = decodeToken(token);
    const [row] = await db.query<RowDataPacket[]>({
      sql: "SELECT id, company_name, user_name FROM users WHERE id = ?",
      values: [decodedToken],
    });

    console.log(row[0]);
    return res.status(200).json(BaseResponse.success(row[0], 200));
  } catch (e: any) {
    return res.status(500).json(BaseResponse.fail(e.message, e.statusCode));
  }
};
