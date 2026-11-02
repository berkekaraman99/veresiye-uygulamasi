import * as yup from "yup";

export const createCustomerSchema = yup.object({
  customer_name: yup
    .string()
    .trim()
    .min(2, "Müşteri adı en az 2 karakter olmalı")
    .max(255)
    .required("Müşteri adı zorunlu"),
  customer_address: yup.string().trim().max(255).nullable().default(null),
  phone_number: yup.string().trim().max(45).nullable().default(null),
});

export const updateCustomerSchema = yup.object({
  customer_id: yup.string().uuid("Geçersiz müşteri id").required(),
  customer_name: yup
    .string()
    .trim()
    .min(2, "Müşteri adı en az 2 karakter olmalı")
    .max(255)
    .required("Müşteri adı zorunlu"),
  customer_address: yup.string().trim().max(255).nullable().default(null),
  phone_number: yup.string().trim().max(45).nullable().default(null),
});

export const deleteCustomerSchema = yup.object({
  customer_id: yup.string().uuid("Geçersiz müşteri id").required(),
});

export const getCustomerByIdSchema = yup.object({
  customer_id: yup.string().uuid("Geçersiz müşteri id").required(),
});
