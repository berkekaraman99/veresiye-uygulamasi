<template>
  <div class="pb-8">
    <div class="grid grid-cols-12">
      <div class="col-start-4 col-span-6">
        <div class="flex items-center justify-center">
          <h1
            class="font-semibold text-4xl mb-8 inline-block bg-white dark:bg-slate-900 dark:text-white px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-950"
          >
            Rapor Görünümü
          </h1>
        </div>
        <div class="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8 border-2 border-slate-200 dark:border-slate-900">
          <FormKit
            type="form"
            id="report-form"
            @submit="getReceiptReport"
            :actions="false"
            :config="{
              classes: {
                outer: '$reset mx-auto my-2',
              },
            }"
          >
            <FormKit type="submit" label="Raporu Oluştur" :wrapper-class="report_btn" />
            <FormKit type="button" :wrapper-class="report_btn" @click="downloadReport"> Excel Formatında İndir </FormKit>
          </FormKit>
        </div>
      </div>
    </div>

    <the-loading v-if="isLoading" />
    <div class="grid grid-cols-12 mt-8" v-if="report.length !== 0">
      <div class="col-span-12">
        <div>
          <div class="flex justify-center">
            <h1
              class="font-semibold text-2xl mb-6 inline-block bg-white dark:bg-slate-900 dark:text-white px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-950"
            >
              Rapor
            </h1>
          </div>
          <table id="reportTable" class="table w-full shadow-md">
            <thead class="text-xs bg-[var(--primary-variant)] text-[var(--text-light)]">
              <tr>
                <th scope="col" class="px-3 py-4" @click="sortTable(0)">Müşteri</th>
                <th scope="col" class="px-3 py-4" @click="sortTable(1)">Alacak</th>
                <th scope="col" class="px-3 py-4" @click="sortTable(2)">Borç</th>
                <th scope="col" class="px-3 py-4" @click="sortTable(3)">Son Fatura Tarihi</th>
                <th scope="col" class="px-3 py-4" @click="sortTable(4)">Net Bakiye</th>
              </tr>
            </thead>
            <tbody class="text-sm dark:text-white bg-white dark:bg-slate-900 border dark:border-slate-950">
              <template v-for="customer in report" v-bind:key="customer['Müşteri']">
                <tr v-if="customer['Net Bakiye'] !== 0" class="hover:bg-slate-100 dark:hover:bg-slate-800">
                  <td class="px-4 py-3">{{ customer["Müşteri"] }}</td>
                  <td class="px-3 py-3 text-center">{{ customer["Alacak"].toFixed(2) }}</td>
                  <td class="px-3 py-3 text-center">{{ customer["Borç"].toFixed(2) }}</td>
                  <td class="px-3 py-3 text-center">{{ customer["Son Fatura Tarihi"].slice(0, 10) }}</td>
                  <td class="px-3 py-3 text-center">{{ customer["Net Bakiye"].toFixed(2) + " ₺" }}</td>
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
import { useReceiptStore } from "@/stores/receipt";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { onBeforeUnmount } from "vue";

//STATES
const receiptStore = useReceiptStore();
const { report } = storeToRefs(receiptStore);
const isLoading = ref(false);

//FUNCTIONS
const changeLoading = (value: boolean) => {
  isLoading.value = value;
};

const downloadReport = async () => {
  changeLoading(true);
  await receiptStore
    .downloadReceipt()
    .then((href) => {
      if (href != null) {
        window.location.replace(href);
      }
    })
    .finally(() => changeLoading(false));
};

const getReceiptReport = async () => {
  changeLoading(true);
  await receiptStore.getReceiptReport().finally(() => changeLoading(false));
};

const sortTable = (n: number) => {
  let table: HTMLTableElement,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementById("reportTable") as HTMLTableElement;
  switching = true;
  dir = "asc";

  while (switching) {
    switching = false;
    rows = table.rows;

    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];

      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode!.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
};

onBeforeUnmount(() => {
  receiptStore.$patch({
    report: [],
  });
});

const report_btn = "flex justify-center";
</script>

<style scoped lang="scss"></style>
