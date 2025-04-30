<template>
  <div class="grid grid-cols-12">
    <div class="col-span-12 sm:col-start-2 sm:col-span-10 md:col-span-8 md:col-start-3 lg:col-start-4 lg:col-span-6">
      <div class="flex items-center justify-center">
        <h1
          class="font-semibold text-4xl mb-8 inline-block bg-white dark:bg-slate-900 dark:text-white px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-950"
        >
          Müşteri Oluştur
        </h1>
      </div>
      <div class="bg-white dark:bg-slate-900 dark:text-white rounded-lg shadow-lg p-8 border-2 border-slate-200 dark:border-slate-950">
        <FormKit
          type="form"
          id="customer-registration"
          @submit="createCustomer"
          :actions="false"
          :config="{
            classes: {
              outer: 'mx-auto',
            },
          }"
        >
          <FormKit
            type="text"
            name="customer_name"
            label="Müşteri Adı"
            placeholder="Müşteri adı"
            validation="required"
            v-model="customerForm.customer_name"
            autofocus
          />
          <FormKit type="text" name="customer_address" label="Müşteri Adresi" placeholder="Müşteri Adresi" v-model="customerForm.customer_address" />

          <FormKit type="submit" label="Oluştur" :disabled="statusCode === 200" :wrapper-class="{ 'flex justify-center': true }" />
        </FormKit>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { useCustomerStore } from "@/stores/customer";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { ResponseStatus } from "@/constants/response_status_enum";
import { useAppToast } from "@/composables/useAppToast";

//STATES
const { toastSuccess, toastError } = useAppToast();
const router = useRouter();
const customerStore = useCustomerStore();
const { statusCode } = storeToRefs(customerStore);
const customerForm = reactive({
  customer_name: "",
  customer_address: "",
});

//FUNCTIONS
const createCustomer = async () => {
  if (customerForm.customer_name !== "") {
    const customer_id = uuidv4();
    const created_date = moment().format("YYYY-MM-DD HH:mm:ss");

    await customerStore
      .createCustomer({
        ...customerForm,
        customer_id: customer_id,
        created_at: created_date,
      })
      .then(() => {
        if (statusCode.value === ResponseStatus.SUCCESS) {
          toastSuccess({ title: "Müşteri oluşturuldu!" });
          setTimeout(() => {
            customerStore.$patch({
              statusCode: 0,
            });
            router.push({ name: "customers" });
          }, 2000);
        } else {
          toastError({ title: "Bir hata oluştu, lütfen daha sonra tekrar deneyiniz" });
        }
      });
  }
};
</script>
