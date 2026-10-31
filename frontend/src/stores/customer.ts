import { ref } from "vue";
import { defineStore } from "pinia";
import { instance } from "@/utils/network_manager";
import type { ICustomer } from "@/models/customer_model";
import type { CreateCustomer } from "@/models/create_customer_model";
import type { UpdateCustomer } from "@/models/update_customer_model";
import type { Customers } from "@/models/customers_model";
import type { DashboardCustomer } from "@/models/dashboard_customer_model";
import type { SearchedCustomer } from "@/models/searched_customer_model";
import type { CustomerReceipt } from "@/models/customer_receipt_model";

export const useCustomerStore = defineStore("customer", () => {
  //STATES
  const customer = ref<ICustomer>();
  const detailedCustomers = ref<Array<Customers>>([]);
  const compactCustomers = ref<Array<Customers>>([]);
  const lastCustomers = ref<Array<DashboardCustomer>>([]);
  const searchedCustomers = ref<Array<SearchedCustomer>>([]);
  const customerReceipts = ref<Array<CustomerReceipt>>([]);
  const customersPageCount = ref<number>(0);
  const customerReceiptsPageCount = ref<number>(0);

  //ACTIONS
  const createCustomer = async (customerForm: CreateCustomer) => {
    await instance.post("/customer/create-customer", customerForm);
  };

  const deleteCustomer = async (customer_id: string) => {
    await instance.post("/customer/delete-customer", {
      customer_id,
    });
  };

  const updateCustomer = async (customer: UpdateCustomer) => {
    await instance.post("/customer/update-customer", customer);
  };

  const getCustomers = async (offset: number = 0) => {
    const res = await instance.get("/customer/get-customers", {
      params: { offset: offset },
    });
    detailedCustomers.value = res.data.data.customers;
    customersPageCount.value = +res.data.data.totalPages;
  };
  const getAllCustomers = async () => {
    const res = await instance.get("/customer/get-all-customers");

    compactCustomers.value = res.data.data.customers;
    customersPageCount.value = res.data.data.totalPages;
  };

  const getCustomerById = async (customer_id: string) => {
    const res = await instance.get("/customer/get-customer-by-id", {
      params: { customer_id: customer_id },
    });
    customer.value = res.data.data[0];
  };

  const searchCustomers = async (searchValue: string) => {
    const res = await instance.get("/customer/search-customers", {
      params: { text: searchValue },
    });
    searchedCustomers.value = res.data.data;
  };

  const getCustomerReceipts = async (
    customer_id: string,
    offset: number = 0,
  ) => {
    const res = await instance.get("/customer/get-customer-receipts", {
      params: { customer_id: customer_id, offset: offset },
    });
    customerReceipts.value = res.data.data.receipts;
    customerReceiptsPageCount.value = res.data.data.totalPages;
  };

  const getLastCustomers = async () => {
    const res = await instance.get("/customer/get-last-customers");
    lastCustomers.value = res.data.data;
  };

  return {
    customer,
    compactCustomers,
    detailedCustomers,
    lastCustomers,
    searchedCustomers,
    customerReceipts,
    customersPageCount,
    customerReceiptsPageCount,
    createCustomer,
    deleteCustomer,
    updateCustomer,
    getCustomers,
    getAllCustomers,
    getCustomerById,
    searchCustomers,
    getCustomerReceipts,
    getLastCustomers,
  };
});
