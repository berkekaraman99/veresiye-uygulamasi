import { Router } from "express";
import { ReceiptController } from "../controllers/receipt_controller";
import { ReceiptRepository } from "../repositories/receipt_repository";
import { asyncHandler } from "../utils/async_handler";
import { validate } from "../middleware/validate";
import {
  createReceiptSchema,
  deleteReceiptSchema,
  getReceiptByIdSchema,
  updateReceiptSchema,
} from "../validators/receipt_validator";
import { listQuerySchema } from "../validators/shared_validator";

const ReceiptRoutes: Router = Router();
const receipt_repository: ReceiptRepository = new ReceiptRepository();
const receipt_controller: ReceiptController = new ReceiptController(
  receipt_repository,
);

ReceiptRoutes.post(
  "/create-receipt",
  validate(createReceiptSchema),
  asyncHandler(receipt_controller.createReceipt),
);
ReceiptRoutes.post(
  "/delete-receipt",
  validate(deleteReceiptSchema),
  asyncHandler(receipt_controller.deleteReceipt),
);
ReceiptRoutes.post(
  "/update-receipt",
  validate(updateReceiptSchema),
  asyncHandler(receipt_controller.updateReceipt),
);
ReceiptRoutes.get(
  "/get-receipts",
  validate(listQuerySchema, "query"),
  asyncHandler(receipt_controller.fetchReceipts),
);
ReceiptRoutes.get(
  "/get-receipt-by-id",
  validate(getReceiptByIdSchema, "query"),
  asyncHandler(receipt_controller.getReceiptById),
);
ReceiptRoutes.get("/report", asyncHandler(receipt_controller.getReceiptReport));
ReceiptRoutes.get(
  "/download-report",
  asyncHandler(receipt_controller.downloadReportExcel),
);
ReceiptRoutes.get(
  "/get-last-receipts",
  asyncHandler(receipt_controller.getLastReceipts),
);
ReceiptRoutes.get(
  "/get-debt-and-receivable",
  asyncHandler(receipt_controller.getDebtAndReceivable),
);

export default ReceiptRoutes;
