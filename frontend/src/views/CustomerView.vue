<template>
  <div>
    <div class="grid grid-cols-12">
      <div
        class="col-span-12 sm:col-start-2 sm:col-span-10 md:col-start-3 md:col-span-8 lg:col-start-4 lg:col-span-6"
      >
        <div>
          <div class="flex justify-center">
            <page-header heading-text="Müşteri Bilgileri" />
          </div>
          <div
            class="p-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-950 dark:text-white rounded-lg"
          >
            <table>
              <tbody>
                <tr>
                  <th class="px-2 py-2">Müşteri Adı:</th>
                  <td class="px-2 py-2">{{ customer?.customer_name }}</td>
                </tr>
                <tr v-if="customer?.customer_address !== ''">
                  <th class="px-2 py-2">Müşteri Adresi:</th>
                  <td class="px-2 py-2">{{ customer?.customer_address }}</td>
                </tr>
                <tr>
                  <th class="px-2 py-2">Müşteri Eklenme Tarihi:</th>
                  <td class="px-2 py-2">{{ customer?.created_at }}</td>
                </tr>
                <tr
                  v-if="
                    customer?.phone_number != null &&
                    customer?.phone_number !== ''
                  "
                >
                  <th class="px-2 py-2">Müşteri Telefon Numarası:</th>
                  <td class="px-2 py-2">{{ customer?.phone_number }}</td>
                </tr>
                <tr v-if="customer?.net_bakiye != null">
                  <th class="px-2 py-2">Güncel Bakiye:</th>
                  <td class="px-2 py-2">{{ customer?.net_bakiye }} ₺</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-12 mt-8" v-if="customerReceipts.length !== 0">
      <div class="col-span-12">
        <div>
          <div class="flex justify-center">
            <h1
              class="font-semibold text-2xl mb-8 inline-block bg-white dark:bg-slate-900 dark:text-white px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-950"
            >
              Faturalar
            </h1>
          </div>
          <table id="receiptsTable">
            <thead
              class="text-xs bg-linear-to-r from-(--primary) to-(--primary) text-(--text-light) h-12"
            >
              <tr>
                <th scope="col" class="px-3 py-2">Fatura No</th>
                <th scope="col" class="px-3 py-2" @click="sortBy('created_at')">
                  Tarih
                </th>
                <th
                  scope="col"
                  class="px-3 py-2"
                  @click="sortBy('receipt_type')"
                >
                  Fatura Türü
                </th>
                <th
                  v-if="isHaveDescription"
                  scope="col"
                  class="px-3 py-2"
                  @click="sortBy('description')"
                >
                  Açıklama
                </th>
                <th scope="col" class="px-3 py-2" @click="sortBy('price')">
                  Bakiye
                </th>
                <th scope="col" class="px-3 py-2">İşlem</th>
              </tr>
            </thead>
            <tbody
              class="text-sm dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-950"
            >
              <tr v-for="receipt in sortedRows" v-bind:key="receipt.receipt_id">
                <td class="px-3 py-2">{{ receipt.receipt_id }}</td>
                <td class="px-3 py-2">
                  {{ receipt.created_at?.slice(0, 10) }}
                </td>
                <td class="px-3 py-2">
                  {{ reformatReceiptType(receipt.receipt_type) }}
                </td>
                <td v-if="isHaveDescription" class="px-3 py-2">
                  {{ receipt.description }}
                </td>
                <td class="px-3 py-2">{{ receipt.price }} ₺</td>
                <td class="px-3 py-2 text-center">
                  <UDropdownMenu
                    arrow
                    :content="{
                      align: 'end',
                      side: 'bottom',
                      sideOffset: 8,
                    }"
                    :items="menuItems(receipt)"
                    :ui="{
                      content:
                        'w-48 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-md',
                    }"
                  >
                    <UButton
                      label="Seçenekler"
                      icon="fluent:chevron-down-32-filled"
                      class="gradient-button"
                      color="neutral"
                      variant="outline"
                    />
                  </UDropdownMenu>
                </td>
              </tr>
            </tbody>
          </table>

          <AppPagination
            v-model:page="currentPage"
            :page-count="customerReceiptsPageCount"
            :page-size="PAGE_SIZE"
          />
        </div>
      </div>
    </div>

    <ConfirmDeleteModal
      v-model="open"
      message="Bu dekontu silmek istediğinizden emin misiniz?"
      :loading="loading"
      @confirm="confirmReceipt"
    />
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import { useReceiptStore } from "@/stores/receipt";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { reformatReceiptType } from "@/helpers/receipt_helper";
import { useAppToast } from "@/composables/useAppToast";
import type { CustomerReceipt } from "@/models/customer_receipt_model";
import { useConfirmDelete } from "@/composables/useConfirmDelete";
import { useSortedRows } from "@/composables/useSortedRows";
import type { DropdownMenuItem } from "@nuxt/ui";

interface Props {
  customer_id: string;
}

//STATES
const { toastSuccess, toastError } = useAppToast();
const props = defineProps<Props>();
const isHaveDescription = ref<boolean>(false);
const receiptStore = useReceiptStore();
const customerStore = useCustomerStore();
const { customer, customerReceipts, customerReceiptsPageCount } =
  storeToRefs(customerStore);
const { sortedRows, sortBy } = useSortedRows(customerReceipts);

const PAGE_SIZE = 10;
const currentPage = ref<number>(1);
const router = useRouter();

const {
  open,
  loading,
  ask: askReceipt,
  confirm: confirmReceipt,
} = useConfirmDelete<string>(async (receipt_id) => {
  try {
    await receiptStore.deleteReceipt(receipt_id);
    toastSuccess({ title: "Dekont başarıyla silindi!" });
    await Promise.all([receiptStore.getLastReceipts(), loadReceipts()]);
    if (currentPage.value > customerReceiptsPageCount.value) {
      currentPage.value = Math.max(1, customerReceiptsPageCount.value);
    }
  } catch {
    toastError({ title: "Dekont silinemedi" });
  }
});

//FUNCTIONS
const loadReceipts = async () =>
  await customerStore.getCustomerReceipts(
    props.customer_id,
    (currentPage.value - 1) * PAGE_SIZE,
  );

watch(currentPage, loadReceipts);

const menuItems = (receipt: CustomerReceipt): DropdownMenuItem[][] => [
  [
    {
      label: "Dekont Bilgileri",
      icon: "fluent:receipt-32-regular",
      onSelect: () =>
        router.push({
          name: "receipt",
          params: { receipt_id: receipt.receipt_id },
        }),
    },
    {
      label: "Dekontu Güncelle",
      icon: "fluent:edit-32-filled",
      onSelect: () =>
        router.push({
          name: "edit-receipt",
          params: { receipt_id: receipt.receipt_id },
        }),
    },
  ],
  [
    {
      label: "Dekontu Sil",
      color: "error",
      icon: "fluent:channel-subtract-24-regular",
      onSelect: () => askReceipt(receipt.receipt_id),
    },
  ],
];

onMounted(async () => {
  try {
    await customerStore.getCustomerById(props.customer_id);
    await loadReceipts().then(() => {
      customerReceipts.value.forEach((element: CustomerReceipt) => {
        if (element.description !== "") {
          isHaveDescription.value = true;
        }
      });
    });
  } catch (error) {
    toastError({ title: "Müşteri verileri yüklenirken bir hata oluştu." });
    console.error(error);
  }
});
</script>

<style scoped>
@reference "@/index.css";

.paging-item {
  @apply relative cursor-pointer inline-flex items-center px-4 py-2 text-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:z-20 focus:outline-offset-0;
}
</style>
