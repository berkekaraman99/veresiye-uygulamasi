import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { instance } from "@/utils/network_manager";

export const useCustomerStore = defineStore("customer", () => {
  //STATES
  const customer = ref<ICustomer>();
  const customers = ref<Array<ICustomer>>([]);
  const statusCode = ref<number>(0);
  const searchedCustomers = ref<Array<ICustomer>>([]);

  //ACTIONS
  const createCustomer = async (customerForm: any) => {
    try {
      const res = await instance.post("/customer/create-customer", customerForm);
      console.log(res.data);
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
      console.log(res.data);
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
      console.log(res.data);
      statusCode.value = res.data.statusCode;
    } catch (error: any) {
      console.error(error.response);
    } finally {
      setTimeout(() => {
        statusCode.value = 0;
      }, 2000);
    }
  };

  const getCustomers = async () => {
    try {
      const res = await instance.get("/customer/get-customers?offset=0");
      console.log(res.data);
      customers.value = res.data.data;
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
      console.log(res.data.data);
      customer.value = res.data.data[0];
    } catch (error: any) {
      console.error(error.response);
    } finally {
      setTimeout(() => {
        statusCode.value = 0;
      }, 2000);
    }
  };

  const searchCustomers = async (searchValue: string) => {
    try {
      const response = await instance.get(`/customer/search-customers?text=${searchValue}`);
      statusCode.value = response.data.statusCode;
      searchedCustomers.value = response.data.data;
      console.log(response.data);
    } catch (error: any) {
      console.error(error.response);
    } finally {
      setTimeout(() => {
        statusCode.value = 0;
      }, 2000);
    }
  };

  return {
    customer,
    customers,
    searchedCustomers,
    statusCode,
    createCustomer,
    deleteCustomer,
    updateCustomer,
    getCustomers,
    getCustomerById,
    searchCustomers,
  };
});
