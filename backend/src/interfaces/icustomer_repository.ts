import { CreateCustomerDto } from "../dtos/customer/create_customer_dto";
import { UpdateCustomerDto } from "../dtos/customer/update_customer_dto";

export interface ICustomerRepository {
  createCustomerAsync(body: CreateCustomerDto): any;
  deleteCustomerAsync(customer_id: string): any;
  updateCustomerAsync(body: UpdateCustomerDto): any;
  getCustomersAsync(offset: number, pLimit: number): any;
  getAllCustomersAsync(): any;
  getCustomerByIdAsync(customer_id: string): any;
  searchCustomersAsync(text: string): any;
  getCustomerReceiptsAsync(query: any): any;
  getLastCustomersAsync(): any;
}
