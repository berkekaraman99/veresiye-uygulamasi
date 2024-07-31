<template>
  <div>
    <div class="grid grid-cols-12">
      <div class="col-span-12 sm:col-start-2 sm:col-span-10 lg:col-start-4 lg:col-span-6 xl:col-start-4 xl:col-span-6">
        <div class="bg-white py-6 border rounded-lg">
          <h1 class="text-center mb-12 font-bold text-2xl">Rapor Görünümü</h1>
          <FormKit
            type="form"
            id="receivable-form"
            @submit="getReceiptReport"
            :actions="false"
            :config="{
              classes: {
                outer: 'mx-auto',
                wrapper: 'mx-auto',
                messages: 'text-center',
              },
            }"
          >
            <FormKit type="submit" label="Raporu Oluştur" :wrapper-class="{ 'flex justify-center': true }" />
          </FormKit>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-12 my-3" v-if="report.length !== 0">
      <div class="col-span-12 sm:col-start-2 sm:col-span-10 lg:col-start-4 lg:col-span-6 xl:col-start-4 xl:col-span-6">
        <div class="py-6 px-0 sm:px-4 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 bg-white border rounded-lg">
          <h1 class="text-center mb-12 font-bold text-2xl">Rapor</h1>

          <table class="table-auto w-full border-collapse border">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3" @click="sortTable(0)">Müşteri</th>
                <th scope="col" class="px-6 py-3" @click="sortTable(1)">Alacak</th>
                <th scope="col" class="px-6 py-3" @click="sortTable(2)">Borç</th>
                <th scope="col" class="px-6 py-3" @click="sortTable(3)">Son Fatura Tarihi</th>
                <th scope="col" class="px-6 py-3" @click="sortTable(4)">Net Bakiye</th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                v-for="customer in report"
                v-bind:key="customer['Müşteri']"
              >
                <td class="px-6 py-4">{{ customer["Müşteri"] }}</td>
                <td class="px-6 py-4">{{ customer["Alacak"] }}</td>
                <td class="px-6 py-4">{{ customer["Borç"] }}</td>
                <td class="px-6 py-4">{{ customer["Son Fatura Tarihi"].slice(0, 10) }}</td>
                <td class="px-6 py-4">{{ customer["Net Bakiye"] + " ₺" }}</td>
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

const receiptStore = useReceiptStore();
const { report } = storeToRefs(receiptStore);

const getReceiptReport = async () => {
  await receiptStore.getReceiptReport();
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
  table = document.getElementById("customersTable") as HTMLTableElement;
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < rows.length - 1; i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode!.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
};
</script>

<style scoped></style>
