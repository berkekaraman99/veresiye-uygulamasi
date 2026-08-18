import { ICreateReceipt } from "../dtos/receipt/create_receipt_dto";

export interface IReceiptRepository {
  createReceiptAsync(body: ICreateReceipt): any;
  fetchReceiptsAsync(user_id: string, offset: number): any;
  deleteReceiptAsync(receipt_id: string): any;
  updateReceiptAsync(body: any): any;
  getReceiptByIdAsync(receipt_id: string): any;
  getReceiptReportAsync(): any;
  downloadReportExcelAsync(): any;
  getLastReceiptsAsync(): any;
  getDebtAndReceivableAsync(): any;
}
