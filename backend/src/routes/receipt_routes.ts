import { Router } from "express";
import { ReceiptController } from "../controllers/receipt_controller";
import { ReceiptRepository } from "../repositories/receipt_repository";

const ReceiptRoutes: Router = Router();
const receipt_repository: ReceiptRepository = new ReceiptRepository();
const receipt_controller: ReceiptController = new ReceiptController(
  receipt_repository,
);

ReceiptRoutes.post("/create-receipt", receipt_controller.createReceipt);
ReceiptRoutes.post("/delete-receipt", receipt_controller.deleteReceipt);
ReceiptRoutes.post("/update-receipt", receipt_controller.updateReceipt);
ReceiptRoutes.get("/get-receipts", receipt_controller.fetchReceipts);
ReceiptRoutes.get("/get-receipt-by-id", receipt_controller.getReceiptById);
ReceiptRoutes.get("/report", receipt_controller.getReceiptReport);
ReceiptRoutes.get("/download-report", receipt_controller.downloadReportExcel);
ReceiptRoutes.get("/get-last-receipts", receipt_controller.getLastReceipts);
ReceiptRoutes.get(
  "/get-debt-and-receivable",
  receipt_controller.getDebtAndReceivable,
);

export default ReceiptRoutes;
