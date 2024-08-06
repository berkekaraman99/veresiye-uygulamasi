<template>
  <div>
    <div class="row">
      <div class="col-12 offset-sm-1 col-sm-10 offset-lg-2 col-lg-8 offset-xl-3 col-xl-6">
        <h1 class="text-center mb-4 fw-bold">Rapor Görünümü</h1>
        <FormKit type="form" id="report-form" @submit="getReceiptReport" :actions="false">
          <FormKit type="submit" label="Raporu Oluştur" :wrapper-class="{ 'd-flex justify-content-center': true }" />
          <FormKit type="button" :wrapper-class="{ 'd-flex justify-content-center': true }">
            <a :href="download">Excel Formatında İndir</a>
          </FormKit>
        </FormKit>
      </div>
    </div>

    <div class="row my-3" v-if="report.length !== 0">
      <div class="col-12 col-sm-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8">
        <div class="text-sm">
          <h1 class="text-center my-3 fw-bold">Rapor</h1>
          <table id="receiptsTable" class="table table-hover table-striped table-borderless">
            <thead class="text-xs text-secondary">
              <tr>
                <th scope="col" class="px-3 py-2" @click="sortTable(0)">Müşteri</th>
                <th scope="col" class="px-3 py-2" @click="sortTable(1)">Alacak</th>
                <th scope="col" class="px-3 py-2" @click="sortTable(2)">Borç</th>
                <th scope="col" class="px-3 py-2" @click="sortTable(3)">Son Fatura Tarihi</th>
                <th scope="col" class="px-3 py-2" @click="sortTable(4)">Net Bakiye</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="customer in report" v-bind:key="customer['Müşteri']">
                <tr v-if="customer['Net Bakiye'] !== 0">
                  <td class="px-3 py-3">{{ customer["Müşteri"] }}</td>
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
import { instance } from "@/utils/network_manager";
import { storeToRefs } from "pinia";
import { onBeforeUnmount } from "vue";

const receiptStore = useReceiptStore();
const { report } = storeToRefs(receiptStore);

const getReceiptReport = async () => {
  await receiptStore.getReceiptReport();
};

const downloadReport = async () => {
  await receiptStore.downloadReceipt();
};

const download = instance.defaults.baseURL + "/receipt/download-report";

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
  table = document.getElementById("customersTable") as HTMLTableElement;
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
</script>

<style scoped lang="scss">
th {
  & {
    cursor: pointer;
  }

  &:first-child {
    border-top-left-radius: 0.5rem;
  }
  &:last-child {
    border-top-right-radius: 0.5rem;
  }
}

tr {
  &:last-child td {
    &:first-child {
      border-bottom-left-radius: 0.5rem;
    }
    &:last-child {
      border-bottom-right-radius: 0.5rem;
    }
  }
}

// thead tr,
// thead tr th {
//   background-color: transparent;
// }
</style>
