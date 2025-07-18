import { Router } from "express";
import {
  createReceipt,
  deleteReceipt,
  downloadReportExcel,
  fetchReceipts,
  getDebtAndReceivable,
  getLastReceipts,
  getReceiptById,
  getReceiptReport,
  updateReceipt,
} from "../controllers/receipt_controller";

const ReceiptRoutes: Router = Router();

ReceiptRoutes.post("/create-receipt", createReceipt);
ReceiptRoutes.post("/delete-receipt", deleteReceipt);
ReceiptRoutes.post("/update-receipt", updateReceipt);
ReceiptRoutes.get("/get-receipts", fetchReceipts);
ReceiptRoutes.get("/get-receipt-by-id", getReceiptById);
ReceiptRoutes.get("/report", getReceiptReport);
ReceiptRoutes.get("/download-report", downloadReportExcel);
ReceiptRoutes.get("/get-last-receipts", getLastReceipts);
ReceiptRoutes.get("/get-debt-and-receivable", getDebtAndReceivable);

export default ReceiptRoutes;
