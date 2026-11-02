import * as yup from "yup";

export const createReceiptSchema = yup.object({
  customer_id: yup.string().uuid().required("Müşteri seçiniz"),
  description: yup.string().trim().max(1024).default(""),
  price: yup
    .number()
    .positive("Tutar sıfırdan büyük olmalı")
    .required("Tutar zorunlu"),
  receipt_type: yup.number().oneOf([0, 1], "Geçersiz dekont türü").required(),
});

export const updateReceiptSchema = yup.object({
  receipt_id: yup.string().uuid().required(),
  customer_id: yup.string().uuid().required("Müşteri seçiniz"),
  description: yup.string().trim().max(1024).default(""),
  price: yup
    .number()
    .positive("Tutar sıfırdan büyük olmalı")
    .required("Tutar zorunlu"),
  receipt_type: yup.number().oneOf([0, 1], "Geçersiz dekont türü").required(),
});

export const getReceiptByIdSchema = yup.object({
  receipt_id: yup.string().uuid().required(),
});

export const deleteReceiptSchema = yup.object({
  receipt_id: yup.string().uuid().required(),
});
