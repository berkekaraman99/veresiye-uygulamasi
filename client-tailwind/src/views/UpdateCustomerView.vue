<template>
  <div class="grid grid-cols-12">
    <div class="col-start-4 col-span-6">
      <h1 class="text-center mb-8 font-semibold text-3xl">Müşteri Bilgileri Güncelleme</h1>
      <div class="bg-white rounded-lg shadow-lg p-8">
        <FormKit
          type="form"
          id="customer-updating"
          @submit="updateCustomer"
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

          <FormKit type="submit" label="Güncelle" :disabled="statusCode === 200" :wrapper-class="{ 'flex justify-center': true }" />
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

interface Props {
  customer_id: string;
}
//STATES
const props = defineProps<Props>();
const toast = useToast();
const router = useRouter();
const customerStore = useCustomerStore();
const { customer, statusCode } = storeToRefs(customerStore);
const customerForm = reactive({
  customer_name: "",
  customer_address: "",
});

//FUNCTIONS
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
