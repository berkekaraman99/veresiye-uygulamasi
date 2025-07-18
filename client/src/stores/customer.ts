import { ref } from "vue";
import { defineStore } from "pinia";
import { instance } from "@/utils/network_manager";
import type { ICustomer } from "@/models/customer_model";
import type { ICustomerReceipt } from "@/models/customer_receipt_model";
import type { ICustomers } from "@/models/customers_model";
import type { ISearchedCustomer } from "@/models/searched_customer_model";
import type { IDashboardCustomer } from "@/models/dashboard_customer_model";

export const useCustomerStore = defineStore("customer", () => {
  //STATES
  const customer = ref<ICustomer>();
  const customers = ref<Array<ICustomers>>([]);
  const lastCustomers = ref<Array<IDashboardCustomer>>([]);
  const statusCode = ref<number>(0);
  const searchedCustomers = ref<Array<ISearchedCustomer>>([]);
  const customerReceipts = ref<Array<ICustomerReceipt>>([]);
  const customersPageCount = ref<number>(0);
  const customerReceiptsPageCount = ref<number>(0);

  //ACTIONS
  const createCustomer = async (customerForm: any) => {
    try {
      const res = await instance.post("/customer/create-customer", customerForm);
      statusCode.value = res.data.statusCode;
    } catch (error: any) {
      console.error(error.response);
    } finally {
      setTimeout(() => {
        statusCode.value = 0;
      }, 2000);
    }
  };

  const deleteCustomer = async (customer_id: string) => {
    try {
      const res = await instance.post("/customer/delete-customer", { customer_id });
      statusCode.value = res.data.statusCode;
    } catch (error: any) {
      console.error(error.response);
    } finally {
      setTimeout(() => {
        statusCode.value = 0;
      }, 2000);
    }
  };

  const updateCustomer = async (customer: any) => {
    try {
      const res = await instance.post("/customer/update-customer", customer);
      statusCode.value = res.data.statusCode;
    } catch (error: any) {
      console.error(error.response);
    } finally {
      setTimeout(() => {
        statusCode.value = 0;
      }, 2000);
    }
  };

  const getCustomers = async (offset: number = 0) => {
    try {
      const res = await instance.get(`/customer/get-customers?offset=${offset}`);
      customers.value = res.data.data[0];
      customersPageCount.value = res.data.data[2][0].totalPages;
      statusCode.value = res.data.statusCode;
    } catch (error: any) {
      console.error(error.response);
    } finally {
      setTimeout(() => {
        statusCode.value = 0;
      }, 2000);
    }
  };

  const getCustomerById = async (customer_id: string) => {
    try {
      const res = await instance.get(`/customer/get-customer-by-id?customer_id=${customer_id}`);
      customer.value = res.data.data[0];
    } catch (error: any) {
      console.error(error.response);
    } finally {
      setTimeout(() => {
        statusCode.value = 0;
      }, 2000);
    }
  };

  const getCustomerByName = async (customer_name: string) => {
    try {
      const res = await instance.get(`/customer/get-customer-by-name?customer_name=${customer_name}`);
      customer.value = res.data.data[0];
      console.log(res.data);
    } catch (error: any) {
      console.error(error.response);
    } finally {
      setTimeout(() => {
        statusCode.value = 0;
      }, 2000);
    }
  };

  const getCustomersPageCount = async () => {
    try {
      const res = await instance.get(`/customer/get-customer-page-count`);
      customersPageCount.value = Number(res.data.data[0].count);
    } catch (error: any) {
      console.error(error.response);
    }
  };

  const searchCustomers = async (searchValue: string) => {
    try {
      const res = await instance.get(`/customer/search-customers?text=${searchValue}`);
      statusCode.value = res.data.statusCode;
      searchedCustomers.value = res.data.data;
    } catch (error: any) {
      console.error(error.response);
    } finally {
      setTimeout(() => {
        statusCode.value = 0;
      }, 2000);
    }
  };

  const getCustomerReceipts = async (customer_id: string, offset: number = 0) => {
    try {
      const res = await instance.get(`/customer/get-customer-receipts?customer_id=${customer_id}&offset=${offset}`);
      statusCode.value = res.data.statusCode;
      customerReceipts.value = res.data.data[0];
      customerReceiptsPageCount.value = res.data.data[2][0].totalPages;
    } catch (error: any) {
      console.error(error.response);
    } finally {
      setTimeout(() => {
        statusCode.value = 0;
      }, 2000);
    }
  };

  const getLastCustomers = async () => {
    try {
      const res = await instance.get("/customer/get-last-customers");
      statusCode.value = res.data.statusCode;

      lastCustomers.value = res.data.data;
      // console.log(res.data);
    } catch (error: any) {
      console.error(error.response);
    }
  };

  return {
    customer,
    customers,
    lastCustomers,
    searchedCustomers,
    statusCode,
    customerReceipts,
    customersPageCount,
    customerReceiptsPageCount,
    createCustomer,
    deleteCustomer,
    updateCustomer,
    getCustomers,
    getCustomerById,
    getCustomerByName,
    searchCustomers,
    getCustomerReceipts,
    getCustomersPageCount,
    getLastCustomers,
  };
});
