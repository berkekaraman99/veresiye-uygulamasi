import * as yup from "yup";

export const listQuerySchema = yup.object({
  offset: yup.number().integer().min(0).default(0),
});
