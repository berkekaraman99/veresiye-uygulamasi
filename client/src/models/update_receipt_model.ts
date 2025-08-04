import type { IReceipt } from "./receipt_model";

export type UpdateReceipt = Pick<IReceipt, "receipt_id" | "description" | "price" | "receipt_type">;
