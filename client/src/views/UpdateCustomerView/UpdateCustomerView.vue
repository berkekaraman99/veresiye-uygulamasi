<template>
  <div class="grid grid-cols-12">
    <div class="col-span-12 sm:col-start-2 sm:col-span-10 lg:col-start-4 lg:col-span-6 xl:col-start-4 xl:col-span-6">
      <div class="bg-white py-6 border rounded-lg">
        <h1 class="text-center mb-12 font-bold text-2xl">Müşteri Bilgileri Güncelleme</h1>
        <FormKit
          type="form"
          id="customer-updating"
          @submit="updateCustomer"
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

          <FormKit type="submit" label="Güncelle" :wrapper-class="{ 'flex justify-center': true }" />
        </FormKit>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ResponseStatus } from "@/constants/response_status_enum";
import { useCustomerStore } from "@/stores/customer";
import { storeToRefs } from "pinia";
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const props = defineProps({
  customer_id: {
    type: String,
    required: true,
  },
});

const toast = useToast();
const router = useRouter();
const customerStore = useCustomerStore();
const { customer, statusCode } = storeToRefs(customerStore);

const customerForm = reactive({
  customer_name: "",
  customer_address: "",
});

const updateCustomer = async () => {
  if (customerForm.customer_name !== "") {
    await customerStore.updateCustomer({ ...customerForm, customer_id: props.customer_id }).then(() => {
      if (statusCode.value === ResponseStatus.SUCCESS) {
        toast.success("Müşteri bilgileri güncellendi!", {
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

onMounted(async () => {
  await customerStore.getCustomerById(props.customer_id).then(() => {
    customerForm.customer_name = customer.value?.customer_name ?? "";
    customerForm.customer_address = customer.value?.customer_address ?? "";
  });
});
</script>

<style scoped></style>
