import { Router } from "express";
import {
  createCustomer,
  deleteCustomer,
  getCustomerById,
  getCustomerByName,
  getCustomerReceipts,
  getCustomers,
  getAllCustomers,
  getLastCustomers,
  searchCustomers,
  updateCustomer,
} from "../controllers/customer_controller";

const CustomerRoutes: Router = Router();

CustomerRoutes.post("/create-customer", createCustomer);
CustomerRoutes.post("/delete-customer", deleteCustomer);
CustomerRoutes.post("/update-customer", updateCustomer);
CustomerRoutes.get("/get-customers", getCustomers);
CustomerRoutes.get("/get-all-customers", getAllCustomers);
CustomerRoutes.get("/get-customer-by-id", getCustomerById);
CustomerRoutes.get("/get-customer-by-name", getCustomerByName);
CustomerRoutes.get("/search-customers", searchCustomers);
CustomerRoutes.get("/get-customer-receipts", getCustomerReceipts);
CustomerRoutes.get("/get-last-customers", getLastCustomers);

export default CustomerRoutes;
