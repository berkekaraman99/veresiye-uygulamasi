<template>
  <div>
    <div class="grid grid-cols-12">
      <div class="col-span-12 sm:col-start-2 sm:col-span-10 md:col-start-3 md:col-span-8 lg:col-start-4 lg:col-span-6">
        <div>
          <div class="flex justify-center">
            <h1
              class="font-semibold text-4xl mb-8 inline-block bg-white dark:bg-slate-900 dark:text-white px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-950"
            >
              Müşteri Bilgileri
            </h1>
          </div>
          <div class="p-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-950 dark:text-white rounded-lg">
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
                  <th class="px-2 py-2">Müşterinin Eklenme Tarihi:</th>
                  <td class="px-2 py-2">{{ customer?.created_at }}</td>
                </tr>
                <tr v-if="customer?.net_bakiye != null">
                  <th class="px-2 py-2">Güncel Bakiye:</th>
                  <td class="px-2 py-2">{{ customer?.net_bakiye.toString() + " TL" }}</td>
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
            <thead class="text-xs bg-gradient-to-r from-[var(--primary-variant)] to-[var(--primary)] text-[var(--text-light)] h-12">
              <tr>
                <th scope="col" class="px-3 py-2" @click="sortTable(0)">Fatura No</th>
                <th scope="col" class="px-3 py-2" @click="sortTable(1)">Tarih</th>
                <th scope="col" class="px-3 py-2" @click="sortTable(2)">Fatura Türü</th>
                <th v-if="isHaveDescription" scope="col" class="px-3 py-2" @click="sortTable(3)">Açıklama</th>
                <th scope="col" class="px-3 py-2" @click="sortTable(4)">Bakiye</th>
                <th scope="col" class="px-3 py-2">İşlem</th>
              </tr>
            </thead>
            <tbody class="text-sm dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-950">
              <tr v-for="receipt in customerReceipts" v-bind:key="receipt.receipt_id">
                <td class="px-3 py-2">{{ receipt.receipt_id }}</td>
                <td class="px-3 py-2">{{ receipt.created_at?.slice(0, 10) }}</td>
                <td class="px-3 py-2">{{ reformatReceiptType(receipt.receipt_type) }}</td>
                <td v-if="isHaveDescription" class="px-3 py-2">{{ receipt.description }}</td>
                <td class="px-3 py-2">{{ receipt.price + " ₺" }}</td>
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
                            router.push({ name: 'receipt', params: { receipt_id: receipt.receipt_id } });
                          },
                        },
                        {
                          label: 'Faturayı Güncelle',
                          icon: 'fluent:edit-32-filled',
                          onSelect() {
                            router.push({ name: 'edit-receipt', params: { receipt_id: receipt.receipt_id } });
                          },
                        },
                      ],
                      [
                        {
                          label: 'Faturayı Sil',
                          color: 'error',
                          icon: 'fluent:channel-subtract-24-regular',
                          onSelect() {
                            selReceipt(receipt.receipt_id);
                          },
                        },
                      ],
                    ]"
                    :ui="{
                      content: 'w-48',
                    }"
                  >
                    <UButton label="Seçenekler" icon="fluent:chevron-down-32-filled" color="neutral" variant="outline" />
                  </UDropdownMenu>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="customerReceiptsPageCount !== 0" class="block sm:flex items-center justify-between sm:justify-center my-3">
            <div class="bg-white dark:bg-slate-900 p-2 rounded-md border-gray-200 dark:border-slate-700 border shadow-sm">
              <div class="flex flex-1 justify-between sm:hidden">
                <a
                  @click="previousPage()"
                  class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >Previous</a
                >
                <a
                  @click="nextPage()"
                  class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >Next</a
                >
              </div>
              <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
                <div>
                  <nav class="isolate inline-flex -space-x-px rounded-md shadow-2xs" aria-label="Pagination">
                    <a
                      @click="previousPage()"
                      class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0"
                    >
                      <span class="sr-only">Previous</span>
                      <UIcon
                        name="heroicons:chevron-left-16-solid"
                        class="h-5 w-5 size-6"
                        :class="{ 'text-black dark:text-white': currentPage !== customerReceiptsPageCount }"
                      />
                    </a>
                    <a
                      v-if="customerReceiptsPageCount !== 0"
                      @click="selectPage(1)"
                      class="paging-item"
                      :class="[
                        currentPage === 1 ? 'font-bold  text-white bg-violet-600 hover:bg-violet-500' : 'hover:bg-gray-50 dark:hover:bg-gray-700',
                      ]"
                      >1</a
                    >
                    <span v-if="currentPage > 4" class="paging-item">...</span>
                    <a
                      v-for="page in pageRange"
                      :key="page"
                      @click="selectPage(page)"
                      class="paging-item"
                      :class="[
                        currentPage === page ? 'font-bold  text-white bg-violet-600 hover:bg-violet-500' : 'hover:bg-gray-50 dark:hover:bg-gray-700',
                      ]"
                      >{{ page }}</a
                    >
                    <span v-if="currentPage < customerReceiptsPageCount - 3" class="paging-item">...</span>
                    <a
                      v-if="customerReceiptsPageCount !== 0"
                      @click="selectPage(customerReceiptsPageCount)"
                      class="paging-item"
                      :class="[
                        currentPage === customerReceiptsPageCount
                          ? 'font-bold  text-white bg-violet-600 hover:bg-violet-500'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700',
                      ]"
                      >{{ customerReceiptsPageCount }}</a
                    >
                    <a
                      @click="nextPage()"
                      class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0"
                    >
                      <span class="sr-only">Next</span>
                      <UIcon
                        name="heroicons:chevron-right-16-solid"
                        class="h-5 w-5 size-6"
                        :class="{ 'text-black dark:text-white': currentPage !== customerReceiptsPageCount }"
                      />
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <UModal v-model:open="open" :dismissible="false" title="Silme Onayı">
        <template #body>
          <p class="text-base">'Bu dekontu silmek istediğinize emin misiniz?</p>
          <p class="text-red-600 italic text-sm">Bu işlem geri alınamaz</p>
        </template>
        <template #footer>
          <div class="w-full flex items-center justify-end">
            <UButton color="neutral" variant="solid" @click="open = false">Vazgeç</UButton>
            <UButton color="success" variant="solid" class="ms-2" @click="removeReceipt(selectedReceipt)"> Onayla </UButton>
          </div>
        </template>
      </UModal>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import { useReceiptStore } from "@/stores/receipt";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { reformatReceiptType } from "@/utils/receipt_helper";
import { useAppToast } from "@/composables/useAppToast";

interface Props {
  customer_id: string;
}

//STATES
const { toastSuccess } = useAppToast();
const props = defineProps<Props>();
const isHaveDescription = ref<boolean>(false);
const receiptStore = useReceiptStore();
const customerStore = useCustomerStore();
const { customer, customerReceipts, customerReceiptsPageCount } = storeToRefs(customerStore);
const selectedReceipt = ref<string>("");
const currentPage = ref<number>(1);
const offset = ref(0);
const router = useRouter();
const open = ref(false);

//FUNCTIONS
const selReceipt = (receipt_id: string) => {
  selectedReceipt.value = receipt_id;
  open.value = true;
};

const pageRange = computed(() => {
  const range = [];
  const start = Math.max(2, currentPage.value - 2);
  const end = Math.min(customerReceiptsPageCount.value - 1, currentPage.value + 2);
  for (let index = start; index <= end; index++) {
    range.push(index);
  }
  return range;
});

const selectPage = async (no: number) => {
  offset.value = (no - 1) * 15;
  await customerStore.getCustomerReceipts(customer.value.customer_id, offset.value);
  currentPage.value = no;
};

const previousPage = async () => {
  if (currentPage.value > 1) {
    offset.value = offset.value - 15;
    await customerStore.getCustomerReceipts(customer.value.customer_id, offset.value);
    currentPage.value = currentPage.value - 1;
  }
};

const nextPage = async () => {
  if (currentPage.value < customerReceiptsPageCount.value) {
    offset.value = offset.value + 15;
    await customerStore.getCustomerReceipts(customer.value.customer_id, offset.value);
    currentPage.value = currentPage.value + 1;
  }
};

const removeReceipt = async (receipt_id: string) => {
  await receiptStore
    .deleteReceipt(receipt_id)
    .then(async () => {
      toastSuccess({ title: "Dekont başarıyla silindi!" });
      await customerStore.getCustomerReceipts(props.customer_id);
    })
    .finally(() => (open.value = false));
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
  table = document.getElementById("receiptsTable") as HTMLTableElement;
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

onMounted(async () => {
  await customerStore.getCustomerById(props.customer_id);
  await customerStore.getCustomerReceipts(props.customer_id).then(() => {
    customerReceipts.value.forEach((element: any) => {
      if (element.description !== "") {
        isHaveDescription.value = true;
      }
    });
  });
});
</script>

<style scoped>
@reference "@/index.css";

.paging-item {
  @apply relative cursor-pointer inline-flex items-center px-4 py-2 text-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:z-20 focus:outline-offset-0;
}

.dropdown-icon {
  width: 24px;
}
</style>
