import { Router } from "express";
import { CustomerController } from "../controllers/customer_controller";
import { CustomerRepository } from "../repositories/customer_repository";
import { validate } from "../middleware/validate";
import {
  createCustomerSchema,
  deleteCustomerSchema,
  getCustomerByIdSchema,
  updateCustomerSchema,
} from "../validators/customer_validator";
import { asyncHandler } from "../utils/async_handler";
import { listQuerySchema } from "../validators/shared_validator";

const CustomerRoutes: Router = Router();
const customer_repository: CustomerRepository = new CustomerRepository();
const customer_controller: CustomerController = new CustomerController(
  customer_repository,
);

CustomerRoutes.post(
  "/create-customer",
  validate(createCustomerSchema),
  asyncHandler(customer_controller.createCustomer),
);
CustomerRoutes.post(
  "/delete-customer",
  validate(deleteCustomerSchema),
  asyncHandler(customer_controller.deleteCustomer),
);
CustomerRoutes.post(
  "/update-customer",
  validate(updateCustomerSchema),
  asyncHandler(customer_controller.updateCustomer),
);
CustomerRoutes.get(
  "/get-customers",
  validate(listQuerySchema, "query"),
  asyncHandler(customer_controller.getCustomers),
);
CustomerRoutes.get(
  "/get-all-customers",
  asyncHandler(customer_controller.getAllCustomers),
);
CustomerRoutes.get(
  "/get-customer-by-id",
  validate(getCustomerByIdSchema, "query"),
  asyncHandler(customer_controller.getCustomerById),
);
CustomerRoutes.get(
  "/search-customers",
  asyncHandler(customer_controller.searchCustomers),
);
CustomerRoutes.get(
  "/get-customer-receipts",
  asyncHandler(customer_controller.getCustomerReceipts),
);
CustomerRoutes.get(
  "/get-last-customers",
  asyncHandler(customer_controller.getLastCustomers),
);

export default CustomerRoutes;
