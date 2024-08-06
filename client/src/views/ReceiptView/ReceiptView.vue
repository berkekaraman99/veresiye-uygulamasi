<template>
  <div class="grid grid-cols-12">
    <div class="col-span-12 sm:col-span-12 lg:col-start-3 lg:col-span-8 xl:col-start-4 xl:col-span-6">
      <div class="py-6 px-0 sm:px-4 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 bg-white border rounded-lg">
        <h1 class="text-center mb-12 font-bold text-2xl">Fatura Bilgileri</h1>
        <div class="p-4">
          <table>
            <tbody>
              <tr>
                <th class="px-2 py-4">Müşteri Adı:</th>
                <td class="px-2 py-4">{{ receipt?.customer_name }}</td>
              </tr>
              <tr>
                <th class="px-2 py-4">Fatura No:</th>
                <td class="px-2 py-4">{{ receipt?.receipt_id }}</td>
              </tr>
              <tr>
                <th class="px-2 py-4">Fatura Türü</th>
                <td class="px-2 py-4">{{ reformatReceiptType(receipt?.receipt_type ?? 0) }}</td>
              </tr>
              <tr>
                <th class="px-2 py-4">Fatura Oluşturulma Tarihi:</th>
                <td class="px-2 py-4">{{ receipt?.created_date }}</td>
              </tr>
              <tr>
                <th class="px-2 py-4">Açıklama:</th>
                <td class="px-2 py-4">{{ receipt?.description === "" ? "Boş" : receipt?.description }}</td>
              </tr>
              <tr>
                <th class="px-2 py-4">Bakiye:</th>
                <td class="px-2 py-4">{{ receipt?.price + " TL" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReceiptStore } from "@/stores/receipt";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { reformatReceiptType } from "@/utils/receipt_helper";

const props = defineProps({
  receipt_id: {
    type: String,
    required: true,
  },
});

const receiptStore = useReceiptStore();
const { receipt } = storeToRefs(receiptStore);

onMounted(async () => {
  await receiptStore.getReceiptById(props.receipt_id);
});
</script>

<style scoped>
tr td,
tr th {
  font-size: 1rem;
}
</style>
