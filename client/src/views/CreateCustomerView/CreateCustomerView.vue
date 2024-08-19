<template>
  <div class="row">
    <div class="col-12 offset-sm-1 col-sm-10 offset-lg-3 col-lg-6">
      <div class="">
        <h1 class="text-center my-4 fw-bold">Müşteri Oluşturma</h1>
        <FormKit type="form" id="customer-registration" @submit="createCustomer" :actions="false">
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

          <FormKit type="submit" label="Oluştur" :disabled="statusCode === 200" :wrapper-class="{ 'd-flex justify-content-center': true }" />
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
import { ResponseStatus } from "@/constants/response_status_enum";

//STATES
const toast = useToast();
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
        created_date: created_date,
      })
      .then(() => {
        if (statusCode.value === ResponseStatus.SUCCESS) {
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
