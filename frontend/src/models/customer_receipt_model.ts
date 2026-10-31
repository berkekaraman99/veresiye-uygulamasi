import type { IReceipt } from "./receipt_model";

export type CustomerReceipt = Omit<IReceipt, "customer_id" | "customer_name">;
