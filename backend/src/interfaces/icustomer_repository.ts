import { ICreateCustomer } from "../dtos/customer/create_customer_dto";

export interface ICustomerRepository {
  createCustomerAsync(body: ICreateCustomer): any;
  deleteCustomerAsync(customer_id: string): any;
  updateCustomerAsync(body: any): any;
  getCustomersAsync(offset: number): any;
  getAllCustomersAsync(): any;
  getCustomerByIdAsync(customer_id: string): any;
  getCustomerByNameAsync(customer_name: string): any;
  searchCustomersAsync(text: string): any;
  getCustomerReceiptsAsync(query: any): any;
  getLastCustomersAsync(): any;
}
