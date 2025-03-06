<template>
  <div class="grid grid-cols-12">
    <div class="col-start-2 col-span-10">
      <div>
        <h1 class="text-center mb-8 font-semibold text-3xl">Fatura Bilgileri</h1>
        <div class="p-4 bg-white rounded-lg shadow-lg">
          <table class="table w-full">
            <tbody>
              <tr>
                <th class="px-2 py-2">Müşteri Adı:</th>
                <td class="px-2 py-2">{{ receipt?.customer_name }}</td>
              </tr>
              <tr>
                <th class="px-2 py-2">Fatura No:</th>
                <td class="px-2 py-2">{{ receipt?.receipt_id }}</td>
              </tr>
              <tr>
                <th class="px-2 py-2">Fatura Türü</th>
                <td class="px-2 py-2">{{ reformatReceiptType(receipt?.receipt_type ?? 0) }}</td>
              </tr>
              <tr>
                <th class="px-2 py-2">Fatura Oluşturulma Tarihi:</th>
                <td class="px-2 py-2">{{ receipt?.created_at }}</td>
              </tr>
              <tr v-if="receipt?.description !== ''">
                <th class="px-2 py-2">Açıklama:</th>
                <td class="px-2 py-2">{{ receipt?.description }}</td>
              </tr>
              <tr>
                <th class="px-2 py-2">Bakiye:</th>
                <td class="px-2 py-2">{{ receipt?.price + " TL" }}</td>
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

interface Props {
  receipt_id: string;
}
const props = defineProps<Props>();

const receiptStore = useReceiptStore();
const { receipt } = storeToRefs(receiptStore);

onMounted(async () => {
  await receiptStore.getReceiptById(props.receipt_id);
});
</script>

<style scoped lang="scss"></style>
