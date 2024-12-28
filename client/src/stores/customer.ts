import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { instance } from "@/utils/network_manager";

export const useCustomerStore = defineStore("customer", () => {
  //STATES
  const customer = ref<ICustomer>();
  const customers = ref<Array<ICustomer>>([]);
  const statusCode = ref<number>(0);
  const searchedCustomers = ref<Array<ICustomer>>([]);
  const customerReceipts = ref<Array<ICustomerReceipt>>([]);
  const customersPageCount = ref<number>(0);
  const customerReceiptsPageCount = ref<number>(0);

  //ACTIONS
  const createCustomer = async (customerForm: any) => {
    try {
      const res = await instance.post("/customer/create-customer", customerForm);
      // console.log(res.data);
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
      // console.log(res.data);
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
      // console.log(res.data);
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
      //   console.log(res.data);
      customers.value = res.data.data;
      //   searchedCustomers.value = res.data.data;
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
      // console.log(res.data.data);
      customer.value = res.data.data[0];
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
      //   console.log(res.data);
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
      //   console.log(res.data);
    } catch (error: any) {
      console.error(error.response);
    } finally {
      setTimeout(() => {
        statusCode.value = 0;
      }, 2000);
    }
  };

  const searchCustomersList = (searchValue: string) => {
    try {
      if (searchValue === "") {
        searchedCustomers.value = customers.value;
      } else {
        searchedCustomers.value = customers.value.filter((item) => item.customer_name.toLowerCase().includes(searchValue));
      }
    } catch (error: any) {
      console.error(error.response);
    }
  };

  const getCustomerReceipts = async (customer_id: string, offset: number = 0) => {
    try {
      const res = await instance.get(`/customer/get-customer-receipts?customer_id=${customer_id}&offset=${offset}`);
      statusCode.value = res.data.statusCode;
      customerReceipts.value = res.data.data;
      // console.log(res.data);
    } catch (error: any) {
      console.error(error.response);
    } finally {
      setTimeout(() => {
        statusCode.value = 0;
      }, 2000);
    }
  };

  const getCustomerReceiptsPageCount = async (customer_id: string) => {
    try {
      const res = await instance.get(`/customer/get-customer-receipts-page-count?id=${customer_id}`);
      customerReceiptsPageCount.value = Number(res.data.data[0].count);
      //   console.log(res.data);
    } catch (error: any) {
      console.error(error.response);
    }
  };

  return {
    customer,
    customers,
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
    searchCustomers,
    getCustomerReceipts,
    searchCustomersList,
    getCustomerReceiptsPageCount,
    getCustomersPageCount,
  };
});
