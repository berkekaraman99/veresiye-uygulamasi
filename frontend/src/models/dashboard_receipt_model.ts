import type { IReceipt } from "./receipt_model";

export type DashboardReceipt = Omit<IReceipt, "customer_id" | "updated_at" | "description">;
