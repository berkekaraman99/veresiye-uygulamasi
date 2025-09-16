import type { ICustomer } from "./customer_model";

export type SearchedCustomer = Pick<ICustomer, "customer_id" | "customer_name">;
