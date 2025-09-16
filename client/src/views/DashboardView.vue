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
              <th scope="col" class="px-3 py-2"></th>
            </tr>
          </thead>

          <tbody class="text-sm dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-950">
            <tr v-for="lastCustomer in lastCustomers" v-bind:key="lastCustomer.customer_id">
              <td class="px-3 py-2">{{ lastCustomer.customer_name }}</td>
              <td class="px-3 py-2 text-center">{{ lastCustomer.net_bakiye }} TL</td>
              <td class="px-3 py-2 text-center">{{ lastCustomer.created_at }}</td>
              <td class="px-3 py-2 text-center">
                <UDropdownMenu
                  arrow
                  :content="{
                    align: 'end',
                    side: 'bottom',
                    sideOffset: 8,
                  }"
                  :items="[
                    [
                      {
                        label: 'Müşteri Bilgileri',
                        icon: 'fluent:person-32-regular',
                        onSelect() {
                          router.push({ name: 'customer', params: { customer_id: lastCustomer.customer_id } });
                        },
                      },
                      {
                        label: 'Müşteri Güncelle',
                        icon: 'fluent:edit-32-filled',
                        onSelect() {
                          router.push({ name: 'edit-customer', params: { customer_id: lastCustomer.customer_id } });
                        },
                      },
                    ],
                    [
                      {
                        label: 'Müşteriyi Sil',
                        color: 'error',
                        icon: 'fluent:person-subtract-24-regular',
                        onSelect() {
                          selCustomer(lastCustomer);
                        },
                      },
                    ],
                  ]"
                  :ui="{
                    content: 'w-48 bg-transparent backdrop-blur-md',
                  }"
                >
                  <UButton icon="fluent:chevron-down-32-filled" color="neutral" variant="outline" />
                </UDropdownMenu>
              </td>
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
              <th scope="col" class="px-3 py-2"></th>
            </tr>
          </thead>

          <tbody class="text-sm dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-950">
            <tr v-for="lastReceipt in lastReceipts" v-bind:key="lastReceipt.receipt_id">
              <td class="px-3 py-2">{{ lastReceipt.customer_name }}</td>
              <td class="px-3 py-2 text-center">{{ reformatReceiptType(lastReceipt.receipt_type) }}</td>
              <td class="px-3 py-2 text-center">{{ lastReceipt.price }} TL</td>
              <td class="px-3 py-2 text-center">{{ lastReceipt.created_at }}</td>
              <td class="px-3 py-2">
                <UDropdownMenu
                  arrow
                  :content="{
                    align: 'end',
                    side: 'bottom',
                    sideOffset: 8,
                  }"
                  :items="[
                    [
                      {
                        label: 'Fatura Bilgileri',
                        icon: 'fluent:receipt-32-regular',
                        onSelect() {
                          router.push({ name: 'receipt', params: { receipt_id: lastReceipt.receipt_id } });
                        },
                      },
                      {
                        label: 'Faturayı Güncelle',
                        icon: 'fluent:edit-32-filled',
                        onSelect() {
                          router.push({ name: 'edit-receipt', params: { receipt_id: lastReceipt.receipt_id } });
                        },
                      },
                    ],
                    [
                      {
                        label: 'Faturayı Sil',
                        color: 'error',
                        icon: 'fluent:channel-subtract-24-regular',
                        onSelect() {
                          selReceipt(lastReceipt.receipt_id);
                        },
                      },
                    ],
                  ]"
                  :ui="{
                    content: 'w-48',
                  }"
                >
                  <UButton icon="fluent:chevron-down-32-filled" color="neutral" variant="outline" />
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Teleport to="body">
      <UModal v-model:open="cOpen" :dismissible="false" title="Silme Onayı">
        <template #body>
          <p class="text-base">'{{ selectedCustomer?.customer_name }}' adlı müşteriyi silmek istediğinizden emin misiniz?</p>
          <p class="text-red-700 dark:text-red-600 italic text-sm">Bu işlem geri alınamaz</p>
        </template>
        <template #footer>
          <div class="flex items-center justify-end w-full">
            <UButton color="neutral" variant="solid" class="rounded-full px-6 py-3 me-2" @click="cOpen = false">Vazgeç</UButton>
            <UButton color="success" variant="solid" class="rounded-full px-6 py-3" @click="removeCustomer(selectedCustomer!.customer_id)">
              Onayla
            </UButton>
          </div>
        </template>
      </UModal>
    </Teleport>

    <Teleport to="body">
      <UModal v-model:open="rOpen" :dismissible="false" title="Silme Onayı">
        <template #body>
          <p class="text-base">'Bu dekontu silmek istediğinize emin misiniz?</p>
          <p class="text-red-700 dark:text-red-600 italic text-sm">Bu işlem geri alınamaz</p>
        </template>
        <template #footer>
          <div class="flex items-center justify-end w-full">
            <UButton color="neutral" variant="solid" class="rounded-full px-6 py-3 me-2" @click="rOpen = false">Vazgeç</UButton>
            <UButton color="success" variant="solid" class="rounded-full px-6 py-3" @click="removeReceipt(selectedReceipt)"> Onayla </UButton>
          </div>
        </template>
      </UModal>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import { useReceiptStore } from "@/stores/receipt";
import { reformatReceiptType } from "@/utils/receipt_helper";
import Chart, { type ChartItem } from "chart.js/auto";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAppToast } from "@/composables/useAppToast";

const customerStore = useCustomerStore();
const receiptStore = useReceiptStore();
const router = useRouter();
const { toastSuccess } = useAppToast();
const selectedCustomer = ref();
const selectedReceipt = ref();
const cOpen = ref(false);
const rOpen = ref(false);
const { lastCustomers } = storeToRefs(customerStore);
const { lastReceipts, debtReceivableResult } = storeToRefs(receiptStore);

const data = ref<Array<number>>([]);
let ctx: HTMLElement | null;

const selCustomer = (customer: unknown) => {
  selectedCustomer.value = customer;
  cOpen.value = true;
};

const selReceipt = (receipt_id: string) => {
  selectedReceipt.value = receipt_id;
  rOpen.value = true;
};

const removeCustomer = async (customer_id: string) => {
  await customerStore
    .deleteCustomer(customer_id)
    .then(async () => {
      toastSuccess({ title: "Müşteri Başarıyla Silindi!" });
      await customerStore.getLastCustomers();
    })
    .finally(() => (cOpen.value = false));
};

const removeReceipt = async (receipt_id: string) => {
  await receiptStore
    .deleteReceipt(receipt_id)
    .then(async () => {
      toastSuccess({ title: "Dekont başarıyla silindi!" });
      await receiptStore.getLastReceipts();
    })
    .finally(() => (rOpen.value = false));
};

onMounted(async () => {
  customerStore.getLastCustomers();
  receiptStore.getLastReceipts();
  await receiptStore.getDebtAndReceivable().then(() => {
    ctx = document.getElementById("myChart");
    data.value.push(debtReceivableResult.value!.alacak);
    data.value.push(debtReceivableResult.value!.borc);

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
