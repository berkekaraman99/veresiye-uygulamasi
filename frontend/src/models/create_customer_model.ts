import type { ICustomer } from "./customer_model";

export type CreateCustomer = Omit<
  ICustomer,
  "created_at" | "updated_at" | "net_bakiye"
>;
