import * as yup from "yup";

export const createCustomerValidator = yup.object().shape({
  customer_name: yup.string().required().min(4).max(255),
});
