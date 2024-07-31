<template>
  <div class="grid grid-cols-12">
    <div class="col-span-12 sm:col-span-12 lg:col-start-3 lg:col-span-8 xl:col-start-4 xl:col-span-6">
      <div class="py-6 px-0 sm:px-4 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 bg-white border rounded-lg">
        <h1 class="text-center mb-12 font-bold text-2xl">Müşteri Bilgileri</h1>
        <div class="p-4">
          <p>Müşteri Adı: {{ customer?.customer_name }}</p>
          <p>Müşteri Adresi: {{ customer?.customer_address }}</p>
          <p>Müşterinin Eklenme Tarihi: {{ customer?.created_at }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

const props = defineProps({
  customer_id: {
    type: String,
    required: true,
  },
});

const customerStore = useCustomerStore();
const { customer } = storeToRefs(customerStore);

onMounted(async () => {
  await customerStore.getCustomerById(props.customer_id);
});
</script>

<style scoped></style>
