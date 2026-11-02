import type { IReceipt } from "./receipt_model";

export type CreateReceipt = Omit<
  IReceipt,
  "receipt_id" | "created_at" | "updated_at" | "customer_name"
>;
