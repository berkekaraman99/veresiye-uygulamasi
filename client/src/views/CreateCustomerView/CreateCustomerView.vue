<template>
  <div class="grid grid-cols-12">
    <div class="col-span-12 sm:col-start-2 sm:col-span-10 lg:col-start-4 lg:col-span-6 xl:col-start-4 xl:col-span-6">
      <div class="bg-white py-6 border rounded-lg">
        <h1 class="text-center mb-12 font-bold text-2xl">Müşteri Oluşturma</h1>
        <FormKit
          type="form"
          id="customer-registration"
          @submit="createCustomer"
          :actions="false"
          :config="{
            classes: {
              outer: 'mx-auto',
              wrapper: 'mx-auto',
              messages: 'text-center',
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

          <FormKit type="submit" label="Oluştur" :wrapper-class="{ 'flex justify-center': true }" />
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
import { useToast } from "vue-toastification";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const toast = useToast();
const router = useRouter();
const customerStore = useCustomerStore();

const { statusCode } = storeToRefs(customerStore);

const customerForm = reactive({
  customer_name: "",
  customer_address: "",
});

const createCustomer = async () => {
  if (customerForm.customer_name !== "") {
    const customer_id = uuidv4();
    const created_date = moment().format("YYYY-MM-DD HH:mm:ss");

    await customerStore
      .createCustomer({
        ...customerForm,
        customer_id: customer_id,
        created_date: created_date,
      })
      .then(() => {
        if (statusCode.value === 201) {
          toast.success("Müşteri oluşturuldu!", {
            timeout: 2000,
          });
          setTimeout(() => {
            customerStore.$patch({
              statusCode: 0,
            });
            router.push({ name: "customers" });
          }, 2000);
        } else {
          toast.error("Bir hata oluştu, lütfen daha sonra tekrar deneyiniz", {
            timeout: 2000,
          });
        }
      });
  }
};
</script>

<style scoped></style>
