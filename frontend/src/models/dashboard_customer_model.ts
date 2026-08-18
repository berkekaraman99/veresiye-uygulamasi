import type { ICustomer } from "./customer_model";

export type DashboardCustomer = Omit<ICustomer, "updated_at">;
