<template>
  <div>
    <h1
      class="font-semibold text-4xl mb-8 inline-block bg-white dark:bg-slate-900 dark:text-white px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-950"
    >
      Dashboard
    </h1>
    <div class="grid grid-cols-12 gap-4">
      <div class="bg-white dark:bg-slate-900 rounded-lg p-4 col-span-12 lg:col-span-6 min-h-[240px]">
        <canvas id="myChart" class=""></canvas>
      </div>
      <!-- <div class="bg-white rounded-lg p-4 col-span-12 md:col-span-6">test2</div> -->
      <div class="col-span-12 lg:col-span-6">
        <h3
          class="font-semibold text-xl mb-4 inline-block bg-white dark:bg-slate-900 dark:text-white px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-950"
        >
          Yeni Müşteriler
        </h3>
        <table>
          <thead class="text-xs bg-linear-to-r from-[var(--primary-variant)] to-[var(--primary)] text-[var(--text-light)] h-12">
            <tr>
              <th scope="col" class="px-3 py-2">Müşteri Adı</th>
              <th scope="col" class="px-3 py-2">Net Bakiye</th>
              <th scope="col" class="px-3 py-2">Oluşturulma Tarihi</th>
            </tr>
          </thead>

          <tbody class="text-sm dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-950">
            <tr v-for="lastCustomer in lastCustomers" v-bind:key="lastCustomer.customer_id">
              <td class="px-3 py-2">{{ lastCustomer.customer_name }}</td>
              <td class="px-3 py-2 text-center">{{ lastCustomer.net_bakiye }} TL</td>
              <td class="px-3 py-2 text-center">{{ lastCustomer.created_at }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-span-12 mb-4">
        <h3
          class="font-semibold text-xl mb-4 inline-block bg-white dark:bg-slate-900 dark:text-white px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-950"
        >
          Yeni Dekontlar
        </h3>
        <table>
          <thead class="text-xs bg-linear-to-r from-[var(--primary-variant)] to-[var(--primary)] text-[var(--text-light)] h-12">
            <tr>
              <th scope="col" class="px-3 py-2">Müşteri Adı</th>
              <th scope="col" class="px-3 py-2">Dekont Türü</th>
              <th scope="col" class="px-3 py-2">Bakiye</th>
              <th scope="col" class="px-3 py-2">Oluşturulma Tarihi</th>
            </tr>
          </thead>

          <tbody class="text-sm dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-950">
            <tr v-for="lastReceipt in lastReceipts" v-bind:key="lastReceipt.receipt_id">
              <td class="px-3 py-2">{{ lastReceipt.customer_name }}</td>
              <td class="px-3 py-2 text-center">{{ reformatReceiptType(lastReceipt.receipt_type) }}</td>
              <td class="px-3 py-2 text-center">{{ lastReceipt.price }} TL</td>
              <td class="px-3 py-2 text-center">{{ lastReceipt.created_at }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import { useReceiptStore } from "@/stores/receipt";
import { reformatReceiptType } from "@/utils/receipt_helper";
import Chart, { type ChartItem } from "chart.js/auto";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

const customerStore = useCustomerStore();
const receiptStore = useReceiptStore();
const { lastCustomers } = storeToRefs(customerStore);
const { lastReceipts, debtReceivableResult } = storeToRefs(receiptStore);

const data = ref([]);
let ctx: HTMLElement | null;

onMounted(async () => {
  customerStore.getLastCustomers();
  receiptStore.getLastReceipts();
  await receiptStore.getDebtAndReceivable().then(() => {
    ctx = document.getElementById("myChart");
    data.value.push(debtReceivableResult.value[0].alacak, debtReceivableResult.value[0].borc);

    // new Chart(ctx as ChartItem, {
    //   type: "doughnut",
    //   data: {
    //     labels: ["Alacak", "Borç"],
    //     datasets: [
    //       {
    //         label: "Result",
    //         data: data.value,
    //         backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
    //         hoverOffset: 4,
    //       },
    //     ],
    //   },
    // });

    new Chart(ctx as ChartItem, {
      type: "bar",
      data: {
        labels: ["Alacak", "Borç"],
        datasets: [
          {
            label: "Alacak - Borç",
            data: data.value,
            backgroundColor: ["rgba(255, 99, 132, 0.4)", "rgba(54, 162, 235, 0.4)"],
            borderColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  });
});
</script>

<style scoped></style>
