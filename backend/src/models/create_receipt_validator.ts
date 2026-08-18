import * as yup from "yup";

interface receiptSchema {
  price: number;
  description: string;
}

export const createReceiptValidator = yup.object({
  price: yup.number().required(),
  description: yup.string().notRequired().max(512),
});
