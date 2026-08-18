import BaseResponse from "../utils/base_response";
import { NextFunction, Request, Response } from "express";
import { CustomerRepository } from "../repositories/customer_repository";
import { QueryObject } from "../helpers/query_object";

export class CustomerController {
  private readonly customer_repo: CustomerRepository = new CustomerRepository();
  /**
   *
   */
  constructor(customer_repo: CustomerRepository) {
    this.customer_repo = customer_repo;
  }

  createCustomer = async (req: Request, res: Response) => {
    try {
      const result = await this.customer_repo.createCustomerAsync(req.body);

      res
        .status(result.status)
        .json(BaseResponse.success(result.data, result.responseStatus));
    } catch (error: any) {
      res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
    }
  };

  deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { customer_id } = req.body;
      const result = await this.customer_repo.deleteCustomerAsync(customer_id);

      res
        .status(result.status)
        .json(BaseResponse.success(result.data, result.responseStatus));
    } catch (error: any) {
      res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
    }
  };

  updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { customer_name, customer_address, customer_id } = req.body;
      const result = await this.customer_repo.updateCustomerAsync({
        customer_id,
        customer_name,
        customer_address,
      });

      res
        .status(result.status)
        .json(BaseResponse.success(result.data, result.responseStatus));
    } catch (error: any) {
      res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
    }
  };

  getCustomers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { offset } = req.query;
      const result = await this.customer_repo.getCustomersAsync(Number(offset));

      res
        .status(result.status)
        .json(BaseResponse.success(result.data, result.responseStatus));
    } catch (error: any) {
      res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
    }
  };

  getAllCustomers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.customer_repo.getAllCustomersAsync();

      res
        .status(result.status)
        .json(BaseResponse.success(result.data, result.responseStatus));
    } catch (error: any) {
      res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
    }
  };

  getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { customer_id } = req.query;
      const result = await this.customer_repo.getCustomerByIdAsync(
        customer_id as string,
      );

      res
        .status(result.status)
        .json(BaseResponse.success(result.data, result.responseStatus));
    } catch (error: any) {
      res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
    }
  };

  getCustomerByName = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { customer_name } = req.query;
      const result = await this.customer_repo.getCustomerByNameAsync(
        customer_name as string,
      );

      res
        .status(result.status)
        .json(BaseResponse.success(result.data, result.responseStatus));
    } catch (error: any) {
      res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
    }
  };

  searchCustomers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text } = req.query;
      const result = await this.customer_repo.searchCustomersAsync(
        text as string,
      );

      res
        .status(result.status)
        .json(BaseResponse.success(result.data, result.responseStatus));
    } catch (error: any) {
      res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
    }
  };

  getCustomerReceipts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { customer_id, offset } = req.query;
      const query_object: QueryObject = {
        customer_id: customer_id as string,
        offset: Number(offset),
      };
      const result =
        await this.customer_repo.getCustomerReceiptsAsync(query_object);

      res
        .status(result.status)
        .json(BaseResponse.success(result.data, result.responseStatus));
    } catch (error: any) {
      res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
    }
  };

  getLastCustomers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this.customer_repo.getLastCustomersAsync();

      res
        .status(result.status)
        .json(BaseResponse.success(result.data, result.responseStatus));
    } catch (error: any) {
      res.status(500).json(BaseResponse.fail(error.message, error.statusCode));
    }
  };
}
