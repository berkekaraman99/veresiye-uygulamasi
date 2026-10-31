import BaseResponse from "../utils/base_response";
import { NextFunction, Request, Response } from "express";
import { ReceiptRepository } from "../repositories/receipt_repository";

export class ReceiptController {
  private readonly receipt_repo: ReceiptRepository;
  /**
   *
   */
  constructor(receipt_repo: ReceiptRepository) {
    this.receipt_repo = receipt_repo;
  }

  createReceipt = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        receipt_id,
        customer_id,
        created_at,
        price,
        description,
        receipt_type,
      } = req.body;
      const result = await this.receipt_repo.createReceiptAsync({
        receipt_id,
        customer_id,
        created_at,
        price,
        description,
        receipt_type,
      });

      return res
        .status(result.status)
        .json(BaseResponse.success(result.data, result.responseStatus));
    } catch (e: any) {
      return res.status(500).json(BaseResponse.fail(e.message, e.statusCode));
    }
  };

  fetchReceipts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, offset } = req.query;
      const result = await this.receipt_repo.fetchReceiptsAsync(
        user_id as string,
        Number(offset),
      );

      return res
        .status(result.status)
        .json(BaseResponse.success(result.data, result.responseStatus));
    } catch (e: any) {
      return res.status(500).json(BaseResponse.fail(e.message, e.statusCode));
    }
  };

  deleteReceipt = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { receipt_id } = req.body;
      const result = await this.receipt_repo.deleteReceiptAsync(receipt_id);

      return res
        .status(result.status)
        .json(BaseResponse.success(result.data, result.responseStatus));
    } catch (error: any) {
      return res
        .status(500)
        .json(BaseResponse.fail(error.message, error.statusCode));
    }
  };

  updateReceipt = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { receipt_id, price, description, receipt_type } = req.body;
      const result = await this.receipt_repo.updateReceiptAsync({
        receipt_id,
        price,
        description,
        receipt_type,
      });

      return res
        .status(result.status)
        .json(BaseResponse.success(result.data, result.responseStatus));
    } catch (error: any) {
      res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
    }
  };

  getReceiptById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { receipt_id } = req.query;
      const result = await this.receipt_repo.getReceiptByIdAsync(
        receipt_id as string,
      );

      return res
        .status(result.status)
        .json(BaseResponse.success(result.data, result.responseStatus));
    } catch (error: any) {
      return res
        .status(500)
        .json(BaseResponse.fail(error.message, error.statusCode));
    }
  };

  getReceiptReport = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.receipt_repo.getReceiptReportAsync();

      return res
        .status(result.status)
        .json(BaseResponse.success(result.data, result.responseStatus));
    } catch (e: any) {
      return res.status(500).json(BaseResponse.fail(e.message, e.statusCode));
    }
  };

  downloadReportExcel = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const buffer = await this.receipt_repo.downloadReportExcelAsync();

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader("Content-Disposition", "attachment; filename=Report.xlsx");
      res.send(buffer);
    } catch (e: any) {
      return res.status(500).json(BaseResponse.fail(e.message, e.statusCode));
    }
  };

  getLastReceipts = async (req: Request, res: Response) => {
    try {
      const result = await this.receipt_repo.getLastReceiptsAsync();

      res
        .status(result.status)
        .json(BaseResponse.success(result.data, result.responseStatus));
    } catch (error: any) {
      res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
    }
  };

  getDebtAndReceivable = async (req: Request, res: Response) => {
    try {
      const result = await this.receipt_repo.getDebtAndReceivableAsync();

      res
        .status(result.status)
        .json(BaseResponse.success(result.data, result.responseStatus));
    } catch (error: any) {
      res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
    }
  };
}
