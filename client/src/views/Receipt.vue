<template>
  <div class="grid grid-cols-12">
    <RouterLink class="create-btn-wrapper" :to="{ name: 'edit-receipt' }">
      <div class="bg-[var(--secondary)] hover:bg-[var(--secondary-variant)] create-btn text-white">
        <PencilIcon />
      </div>
    </RouterLink>

    <div class="col-start-2 col-span-10">
      <div>
        <div class="flex justify-center">
          <h1
            class="font-semibold text-4xl mb-8 inline-block bg-white dark:bg-slate-900 dark:text-white px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-950"
          >
            Fatura Bilgileri
          </h1>
        </div>
        <div class="p-4 bg-white dark:bg-slate-900 dark:text-white border-2 dark:border-slate-950 rounded-lg shadow-lg">
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
import { PencilIcon } from "@heroicons/vue/24/solid";

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

<style scoped lang="scss">
th {
  text-align: end;
}
.create-btn-wrapper {
  @apply fixed bottom-14 right-2/4 translate-x-2/4 translate-y-2/4 sm:right-4 sm:bottom-3 sm:translate-x-0 sm:translate-y-0 z-50;
}

.create-btn {
  @apply w-16 h-16 rounded-full p-4;
}
</style>
