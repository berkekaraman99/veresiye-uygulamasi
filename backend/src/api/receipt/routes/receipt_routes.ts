import { Router } from "express";
import { createReceipt, deleteReceipt, downloadReportExcel, fetchReceipts, getReceiptById, getReceiptReport, updateReceipt } from "../controller/receipt_controller";

const ReceiptRoutes: Router = Router();

ReceiptRoutes.post("/create-receipt", createReceipt);
ReceiptRoutes.post("/delete-receipt", deleteReceipt);
ReceiptRoutes.post("/update-receipt", updateReceipt);
ReceiptRoutes.get("/get-receipts", fetchReceipts);
ReceiptRoutes.get("/get-receipt-by-id", getReceiptById);
ReceiptRoutes.get("/report", getReceiptReport);
ReceiptRoutes.get("/download-report", downloadReportExcel);

export default ReceiptRoutes;
