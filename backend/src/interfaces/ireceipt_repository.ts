import { CreateReceiptDto } from "../dtos/receipt/create_receipt_dto";
import { UpdateReceiptDto } from "../dtos/receipt/update_receipt_dto";

export interface IReceiptRepository {
  createReceiptAsync(body: CreateReceiptDto): any;
  fetchReceiptsAsync(offset: number): any;
  deleteReceiptAsync(receipt_id: string): any;
  updateReceiptAsync(body: UpdateReceiptDto): any;
  getReceiptByIdAsync(receipt_id: string): any;
  getReceiptReportAsync(): any;
  downloadReportExcelAsync(): any;
  getLastReceiptsAsync(): any;
  getDebtAndReceivableAsync(): any;
}
