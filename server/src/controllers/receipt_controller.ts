import BaseResponse from "../utils/base_response";
import { db } from "../config/mysql";
import { NextFunction, Request, Response } from "express";
import { createReceiptValidator } from "../models/create_receipt_validator";
import { RowDataPacket } from "mysql2";
import * as ExcelJS from "exceljs";
import { ResponseStatus } from "../constants/response_status_enum";
import {
  createReceiptService,
  deleteReceiptService,
  downloadReportExcelServicce,
  fetchReceiptsService,
  getDebtAndReceivableService,
  getLastReceiptsService,
  getReceiptByIdService,
  getReceiptReportService,
  updateReceiptService,
} from "../services/receipt_service";

export const createReceipt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { receipt_id, customer_id, created_at, price, description, receipt_type } = req.body;
    const result = await createReceiptService({ receipt_id, customer_id, created_at, price, description, receipt_type });

    return res.status(result.status).json(BaseResponse.success(result.data, result.responseStatus));
  } catch (e: any) {
    return res.status(500).json(BaseResponse.fail(e.message, e.statusCode));
  }
};

export const fetchReceipts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, offset } = req.query;
    const result = await fetchReceiptsService(userId as string, Number(offset));

    return res.status(result.status).json(BaseResponse.success(result.data, result.responseStatus));
  } catch (e: any) {
    return res.status(500).json(BaseResponse.fail(e.message, e.statusCode));
  }
};

export const deleteReceipt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { receipt_id } = req.body;
    const result = await deleteReceiptService(receipt_id);

    return res.status(result.status).json(BaseResponse.success(result.data, result.responseStatus));
  } catch (error: any) {
    return res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};

export const updateReceipt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { receipt_id, price, description, receipt_type } = req.body;
    const result = await updateReceiptService({ receipt_id, price, description, receipt_type });

    return res.status(result.status).json(BaseResponse.success(result.data, result.responseStatus));
  } catch (error: any) {
    res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};

export const getReceiptById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { receipt_id } = req.query;
    const result = await getReceiptByIdService(receipt_id as string);

    return res.status(result.status).json(BaseResponse.success(result.data, result.responseStatus));
  } catch (error: any) {
    return res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};

export const getReceiptReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getReceiptReportService();

    return res.status(result.status).json(BaseResponse.success(result.data, result.responseStatus));
  } catch (e: any) {
    return res.status(500).json(BaseResponse.fail(e.message, e.statusCode));
  }
};

export const downloadReportExcel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const buffer = await downloadReportExcelServicce();

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=Report.xlsx");
    res.send(buffer);
  } catch (e: any) {
    return res.status(500).json(BaseResponse.fail(e.message, e.statusCode));
  }
};

export const getLastReceipts = async (req: Request, res: Response) => {
  try {
    const result = await getLastReceiptsService();

    res.status(result.status).json(BaseResponse.success(result.data, result.responseStatus));
  } catch (error: any) {
    res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};

export const getDebtAndReceivable = async (req: Request, res: Response) => {
  try {
    const result = await getDebtAndReceivableService();

    res.status(result.status).json(BaseResponse.success(result.data, result.responseStatus));
  } catch (error: any) {
    res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};
