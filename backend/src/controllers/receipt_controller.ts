import { Request, Response } from "express";
import { ReceiptRepository } from "../repositories/receipt_repository";
import { AppError } from "../utils/app_error";
import { ResponseStatus } from "../constants/response_status_enum";

export class ReceiptController {
  private readonly receipt_repo: ReceiptRepository;
  /**
   *
   */
  constructor(receipt_repo: ReceiptRepository) {
    this.receipt_repo = receipt_repo;
  }

  createReceipt = async (req: Request, res: Response) => {
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

    return res.status(ResponseStatus.CREATED).json({ data: result });
  };

  fetchReceipts = async (req: Request, res: Response) => {
    const { offset } = req.query;
    const result = await this.receipt_repo.fetchReceiptsAsync(Number(offset));

    return res.status(ResponseStatus.SUCCESS).json({ data: result });
  };

  deleteReceipt = async (req: Request, res: Response) => {
    const { receipt_id } = req.body;
    const result = await this.receipt_repo.deleteReceiptAsync(receipt_id);

    return res.status(ResponseStatus.NO_CONTENT).json({ data: result });
  };

  updateReceipt = async (req: Request, res: Response) => {
    const { receipt_id, price, description, receipt_type } = req.body;
    const result = await this.receipt_repo.updateReceiptAsync({
      receipt_id,
      price,
      description,
      receipt_type,
    });

    return res.status(ResponseStatus.SUCCESS).json({ data: result });
  };

  getReceiptById = async (req: Request, res: Response) => {
    const { receipt_id } = req.query;
    const result = await this.receipt_repo.getReceiptByIdAsync(
      receipt_id as string,
    );

    if (!result) throw new AppError(404, "Dekont bulunamadı");

    return res.status(ResponseStatus.SUCCESS).json({ data: result });
  };

  getReceiptReport = async (req: Request, res: Response) => {
    const result = await this.receipt_repo.getReceiptReportAsync();

    return res.status(ResponseStatus.SUCCESS).json({ data: result });
  };

  downloadReportExcel = async (req: Request, res: Response) => {
    const buffer = await this.receipt_repo.downloadReportExcelAsync();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", "attachment; filename=Report.xlsx");
    res.send(buffer);
  };

  getLastReceipts = async (req: Request, res: Response) => {
    const result = await this.receipt_repo.getLastReceiptsAsync();

    res.status(ResponseStatus.SUCCESS).json({ data: result });
  };

  getDebtAndReceivable = async (req: Request, res: Response) => {
    const result = await this.receipt_repo.getDebtAndReceivableAsync();

    res.status(ResponseStatus.SUCCESS).json({ data: result });
  };
}
