<template>
  <div class="pb-8">
    <div class="grid grid-cols-12">
      <div class="col-start-4 col-span-6">
        <div class="flex items-center justify-center">
          <page-header heading-text="Rapor Görünümü" />
        </div>
        <div
          class="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8 border-2 border-slate-200 dark:border-slate-900"
        >
          <UFormField class="text-center mb-4">
            <UButton
              color="neutral"
              variant="soft"
              class="py-3 px-6 font-bold gradient-button"
              type="button"
              @click="getReceiptReport"
              >Raporu Oluştur</UButton
            >
          </UFormField>
          <UFormField class="text-center">
            <UButton
              color="neutral"
              variant="soft"
              class="py-3 px-6 font-bold gradient-button"
              type="button"
              @click="downloadReport"
              >Excel Formatında İndir</UButton
            >
          </UFormField>
        </div>
      </div>
    </div>

    <the-loading v-if="isLoading" />
    <div class="grid grid-cols-12 mt-8" v-if="report.length !== 0">
      <div class="col-span-12">
        <div class="flex justify-center">
          <h1
            class="font-semibold text-2xl mb-6 inline-block bg-white dark:bg-slate-900 dark:text-white px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-950"
          >
            Rapor
          </h1>
        </div>
        <div class="block overflow-y-auto h-150">
          <table id="reportTable" class="min-w-full table-fixed">
            <thead
              class="text-xs bg-(--primary) text-(--text-light) sticky top-0"
            >
              <tr>
                <th
                  scope="col"
                  class="px-3 py-4 sticky"
                  @click="sortBy('Müşteri')"
                >
                  Müşteri
                </th>
                <th
                  scope="col"
                  class="px-3 py-4 sticky"
                  @click="sortBy('Alacak')"
                >
                  Alacak
                </th>
                <th
                  scope="col"
                  class="px-3 py-4 sticky"
                  @click="sortBy('Borç')"
                >
                  Borç
                </th>
                <th
                  scope="col"
                  class="px-3 py-4 sticky"
                  @click="sortBy('Son Fatura Tarihi')"
                >
                  Son Fatura Tarihi
                </th>
                <th
                  scope="col"
                  class="px-3 py-4 sticky"
                  @click="sortBy('Net Bakiye')"
                >
                  Net Bakiye
                </th>
              </tr>
            </thead>
            <tbody
              class="text-sm dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-950"
            >
              <template
                v-for="customer in sortedRows"
                v-bind:key="customer['Müşteri']"
              >
                <tr class="hover:bg-slate-100 dark:hover:bg-slate-800">
                  <td class="px-4 py-3">{{ customer["Müşteri"] }}</td>
                  <td class="px-3 py-3 text-center">
                    {{ customer["Alacak"].toFixed(2) }} ₺
                  </td>
                  <td class="px-3 py-3 text-center">
                    {{ customer["Borç"].toFixed(2) }} ₺
                  </td>
                  <td class="px-3 py-3 text-center">
                    {{ customer["Son Fatura Tarihi"].slice(0, 10) }}
                  </td>
                  <td class="px-3 py-3 text-center">
                    {{ customer["Net Bakiye"].toFixed(2) }} ₺
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSortedRows } from "@/composables/useSortedRows";
import { useReceiptStore } from "@/stores/receipt";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { onBeforeUnmount } from "vue";

//STATES
const receiptStore = useReceiptStore();
const { report } = storeToRefs(receiptStore);
const isLoading = ref(false);
const { sortedRows, sortBy } = useSortedRows(report);

//FUNCTIONS
const changeLoading = (value: boolean) => {
  isLoading.value = value;
};

const downloadReport = async () => {
  changeLoading(true);
  await receiptStore.downloadReceipt().finally(() => changeLoading(false));
};

const getReceiptReport = async () => {
  changeLoading(true);
  await receiptStore.getReceiptReport().finally(() => changeLoading(false));
};

onBeforeUnmount(() => {
  receiptStore.$patch({
    report: [],
  });
});
</script>
