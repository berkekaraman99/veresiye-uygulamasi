import { Request, Response } from "express";
import { CustomerRepository } from "../repositories/customer_repository";
import { QueryObject } from "../helpers/query_object";
import { AppError } from "../utils/app_error";
import { ResponseStatus } from "../constants/response_status_enum";

export class CustomerController {
  private readonly customer_repository: CustomerRepository =
    new CustomerRepository();

  constructor(customer_repo: CustomerRepository) {
    this.customer_repository = customer_repo;
  }

  createCustomer = async (req: Request, res: Response) => {
    const customer = await this.customer_repository.createCustomerAsync(
      req.body,
    );
    res.status(ResponseStatus.CREATED).json({ data: customer });
  };

  deleteCustomer = async (req: Request, res: Response) => {
    const { customer_id } = req.body;
    await this.customer_repository.deleteCustomerAsync(customer_id);

    res.status(ResponseStatus.NO_CONTENT).end();
  };

  updateCustomer = async (req: Request, res: Response) => {
    const { customer_name, customer_address, customer_id, phone_number } =
      req.body;
    const result = await this.customer_repository.updateCustomerAsync({
      customer_id,
      customer_name,
      customer_address,
      phone_number,
    });
    res.status(ResponseStatus.SUCCESS).json({ data: result });
  };

  getCustomers = async (req: Request, res: Response) => {
    const { offset, pLimit } = req.query;
    const result = await this.customer_repository.getCustomersAsync(
      Number(offset),
      Number(pLimit),
    );

    res.status(ResponseStatus.SUCCESS).json({ data: result });
  };

  getAllCustomers = async (req: Request, res: Response) => {
    const result = await this.customer_repository.getAllCustomersAsync();

    res.status(ResponseStatus.SUCCESS).json({ data: result });
  };

  getCustomerById = async (req: Request, res: Response) => {
    // const { customer_id } = req.query;
    const { customer_id } = res.locals.query as { customer_id: string };
    const result = await this.customer_repository.getCustomerByIdAsync(
      customer_id as string,
    );

    if (!result) {
      throw new AppError(404, "Müşteri bulunamadı");
    }

    res.status(ResponseStatus.SUCCESS).json({ data: result });
  };

  searchCustomers = async (req: Request, res: Response) => {
    const { text } = req.query;
    const result = await this.customer_repository.searchCustomersAsync(
      text as string,
    );

    res.status(ResponseStatus.SUCCESS).json({ data: result });
  };

  getCustomerReceipts = async (req: Request, res: Response) => {
    const { customer_id, offset } = req.query;
    const query_object: QueryObject = {
      customer_id: customer_id as string,
      offset: Number(offset),
    };
    const result =
      await this.customer_repository.getCustomerReceiptsAsync(query_object);

    res.status(ResponseStatus.SUCCESS).json({ data: result });
  };

  getLastCustomers = async (req: Request, res: Response) => {
    const result = await this.customer_repository.getLastCustomersAsync();

    res.status(ResponseStatus.SUCCESS).json({ data: result });
  };
}
