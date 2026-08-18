import type { ICustomer } from "./customer_model";

export type CreateCustomer = Omit<ICustomer, "updated_at" | "net_bakiye">;
