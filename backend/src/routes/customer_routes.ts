import { Router } from "express";
import {
  createCustomer,
  deleteCustomer,
  getCustomerById,
  getCustomerReceipts,
  getCustomers,
  searchCustomers,
  updateCustomer,
} from "../controllers/customer_controller";

const CustomerRoutes: Router = Router();

CustomerRoutes.post("/create-customer", createCustomer);
CustomerRoutes.post("/delete-customer", deleteCustomer);
CustomerRoutes.post("/update-customer", updateCustomer);
CustomerRoutes.get("/get-customers", getCustomers);
CustomerRoutes.get("/get-customer-by-id", getCustomerById);
CustomerRoutes.get("/search-customers", searchCustomers);
CustomerRoutes.get("/get-customer-receipts", getCustomerReceipts);

export default CustomerRoutes;
