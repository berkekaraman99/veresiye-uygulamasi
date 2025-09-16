import type { ICustomer } from "./customer_model";

export type UpdateCustomer = Pick<ICustomer, "customer_name" | "customer_address" | "phone_number" | "customer_id">;
