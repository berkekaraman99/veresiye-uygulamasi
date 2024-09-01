<template>
  <div>
    <div class="grid grid-cols-12">
      <div class="col-start-4 col-span-6">
        <h1 class="text-center mb-8 font-semibold text-3xl">Rapor Görünümü</h1>
        <div class="bg-white rounded-lg shadow-lg p-8">
          <FormKit
            type="form"
            id="report-form"
            @submit="getReceiptReport"
            :actions="false"
            :config="{
              classes: {
                outer: 'mx-auto',
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
    <div class="grid grid-cols-12 my-3" v-if="report.length !== 0">
      <div class="col-span-12">
        <div>
          <h1 class="text-center my-5 font-semibold text-2xl">Rapor</h1>
          <table id="reportTable" class="table w-full">
            <thead class="text-xs bg-gray-200">
              <tr>
                <th scope="col" class="px-3 py-2" @click="sortTable(0)">Müşteri</th>
                <th scope="col" class="px-3 py-2" @click="sortTable(1)">Alacak</th>
                <th scope="col" class="px-3 py-2" @click="sortTable(2)">Borç</th>
                <th scope="col" class="px-3 py-2" @click="sortTable(3)">Son Fatura Tarihi</th>
                <th scope="col" class="px-3 py-2" @click="sortTable(4)">Net Bakiye</th>
              </tr>
            </thead>
            <tbody class="text-sm bg-white">
              <template v-for="customer in report" v-bind:key="customer['Müşteri']">
                <tr v-if="customer['Net Bakiye'] !== 0" class="hover:bg-slate-100">
                  <td class="px-4 py-3">{{ customer["Müşteri"] }}</td>
                  <td class="px-3 py-3">{{ customer["Alacak"] }}</td>
                  <td class="px-3 py-3">{{ customer["Borç"] }}</td>
                  <td class="px-3 py-3">{{ customer["Son Fatura Tarihi"].slice(0, 10) }}</td>
                  <td class="px-3 py-3">{{ customer["Net Bakiye"] + " ₺" }}</td>
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
