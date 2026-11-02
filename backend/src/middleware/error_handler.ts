import type { ErrorRequestHandler } from "express";
import { ValidationError } from "yup";
import { AppError } from "../utils/app_error";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  let status = 500;
  let message = "Beklenmeyen bir hata oluştu";
  let errors: { field: string; message: string }[] | undefined;

  if (err instanceof AppError) {
    status = err.statusCode;
    message = err.message;
  } else if (err instanceof ValidationError) {
    status = 400;
    message = "Doğrulama hatası";
    const items = err.inner.length ? err.inner : [err];
    errors = items.map((e) => ({ field: e.path ?? "", message: e.message }));
  } else {
    const db = err?.driverError ?? err;
    if (db?.code === "ER_DUP_ENTRY") {
      status = 409;
      message = "Bu kayıt zaten mevcut";
    } else if (db?.code === "ER_NO_REFERENCED_ROW_2") {
      status = 400;
      message = "İlişkili kayıt bulunamadı";
    } else if (db?.code === "ER_ROW_IS_REFERENCED_2") {
      status = 409;
      message = "Bu kayıt başka kayıtlarla ilişkili olduğu için silinemez";
    } else if (err?.type === "entity.parse.failed") {
      status = 400;
      message = "Geçersiz JSON";
    } else if (err?.type === "entity.too.large") {
      status = 413;
      message = "İstek çok büyük";
    }
  }

  if (status >= 500) {
    console.error(`[${req.method}] ${req.originalUrl}`, err);
  }

  res.status(status).json({ message, ...(errors && { errors }) });
};
