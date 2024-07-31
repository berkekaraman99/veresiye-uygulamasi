import { Router } from "express";
import { createReceipt, deleteReceipt, downloadReportExcel, fetchReceipts, getReceiptById, getReceiptReport } from "../controller/receipt_controller";

const ReceiptRoutes: Router = Router();

ReceiptRoutes.post("/create-receipt", createReceipt);
ReceiptRoutes.post("/delete-receipt", deleteReceipt);
ReceiptRoutes.get("/get-receipts", fetchReceipts);
ReceiptRoutes.get("/get-receipt-by-id", getReceiptById);
ReceiptRoutes.get("/report", getReceiptReport);
ReceiptRoutes.get("/download-report", downloadReportExcel);

export default ReceiptRoutes;
