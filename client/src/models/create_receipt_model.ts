import type { IReceipt } from "./receipt_model";

export type CreateReceipt = Omit<IReceipt, "updated_at" | "customer_name">;
