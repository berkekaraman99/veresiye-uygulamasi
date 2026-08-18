import type { ICustomer } from "./customer_model";

export type Customers = Omit<ICustomer, "updated_at">;
