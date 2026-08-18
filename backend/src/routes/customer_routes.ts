import { Router } from "express";
import { CustomerController } from "../controllers/customer_controller";
import { CustomerRepository } from "../repositories/customer_repository";

const CustomerRoutes: Router = Router();
const customer_repository: CustomerRepository = new CustomerRepository();
const customer_controller: CustomerController = new CustomerController(
  customer_repository,
);

CustomerRoutes.post("/create-customer", customer_controller.createCustomer);
CustomerRoutes.post("/delete-customer", customer_controller.deleteCustomer);
CustomerRoutes.post("/update-customer", customer_controller.updateCustomer);
CustomerRoutes.get("/get-customers", customer_controller.getCustomers);
CustomerRoutes.get("/get-all-customers", customer_controller.getAllCustomers);
CustomerRoutes.get("/get-customer-by-id", customer_controller.getCustomerById);
CustomerRoutes.get(
  "/get-customer-by-name",
  customer_controller.getCustomerByName,
);
CustomerRoutes.get("/search-customers", customer_controller.searchCustomers);
CustomerRoutes.get(
  "/get-customer-receipts",
  customer_controller.getCustomerReceipts,
);
CustomerRoutes.get("/get-last-customers", customer_controller.getLastCustomers);

export default CustomerRoutes;
