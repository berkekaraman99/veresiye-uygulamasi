import BaseResponse from "../utils/base_response";
import { NextFunction, Request, Response } from "express";
import {
  createCustomerService,
  deleteCustomerService,
  getCustomerByIdService,
  getCustomerReceiptsService,
  getCustomersService,
  searchCustomersService,
  updateCustomerService,
} from "../services/customer_service";

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const result = await createCustomerService(req.body);

    res.status(result.status).json(BaseResponse.success(result.data, result.responseStatus));
  } catch (error: any) {
    res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};

export const deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customer_id } = req.body;
    const result = await deleteCustomerService(customer_id);

    res.status(result.status).json(BaseResponse.success(result.data, result.responseStatus));
  } catch (error: any) {
    res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customer_name, customer_address, customer_id } = req.body;
    const result = await updateCustomerService({ customer_id, customer_name, customer_address });

    res.status(result.status).json(BaseResponse.success(result.data, result.responseStatus));
  } catch (error: any) {
    res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};

export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { offset } = req.query;
    const result = await getCustomersService(Number(offset));

    res.status(result.status).json(BaseResponse.success(result.data, result.responseStatus));
  } catch (error: any) {
    res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};

export const getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customer_id } = req.query;
    const result = await getCustomerByIdService(customer_id as string);

    res.status(result.status).json(BaseResponse.success(result.data, result.responseStatus));
  } catch (error: any) {
    res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};

export const searchCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text } = req.query;
    const result = await searchCustomersService(text as string);

    res.status(result.status).json(BaseResponse.success(result.data, result.responseStatus));
  } catch (error: any) {
    res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};

export const getCustomerReceipts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customer_id, offset } = req.query;
    const result = await getCustomerReceiptsService({ customer_id, offset });

    res.status(result.status).json(BaseResponse.success(result.data, result.responseStatus));
  } catch (error: any) {
    res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
  }
};
