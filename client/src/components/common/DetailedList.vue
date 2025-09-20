<script setup lang="ts">
import type { Customers } from "@/models/customers_model";
import { sortTable } from "@/utils/table_helper";
import { useRouter } from "vue-router";

const props = defineProps({
  detailedCustomers: {
    type: Array<Customers>,
    default: [],
  },
  width: {
    type: Number,
    required: true,
  },
  isHaveAddress: {
    type: Boolean,
    default: false,
  },
  customersPageCount: {
    type: Number,
    required: true,
  },
  pageRange: {
    type: Array<number>,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
});

const emits = defineEmits(["removeCustomer", "selectCustomer", "previousPage", "nextPage", "selectPage"]);
const router = useRouter();

const sortTableItems = (n: number) => {
  return sortTable(n, "customersTable");
};
</script>

<template>
  <table id="customersTable" class="mt-3">
    <thead class="text-xs bg-linear-to-r from-[var(--primary-variant)] to-[var(--primary)] text-[var(--text-light)] h-12">
      <tr>
        <th scope="col" class="px-3 py-2" @click="sortTableItems(0)">Müşteri</th>
        <th v-if="isHaveAddress" scope="col" class="px-3 py-2" @click="sortTableItems(1)">Müşteri Adresi</th>
        <th scope="col" class="px-3 py-2" @click="sortTableItems(2)">Oluşturulma Tarihi</th>
        <th scope="col" class="px-3 py-2" @click="sortTableItems(3)">Net Bakiye</th>
        <th scope="col" class="px-3 py-2">İşlem</th>
      </tr>
    </thead>

    <tbody class="text-sm dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-950">
      <tr v-for="customer in detailedCustomers" v-bind:key="customer.customer_id">
        <td class="px-3 py-2">{{ customer.customer_name }}</td>
        <td v-if="isHaveAddress" class="px-3 py-2">{{ customer.customer_address }}</td>
        <td class="px-3 py-2 text-center">{{ customer.created_at.slice(0, 10) }}</td>
        <td class="px-3 py-2 text-center">{{ customer.net_bakiye.toFixed(2).toString() + " TL" }}</td>
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
                    router.push({ name: 'customer', params: { customer_id: customer.customer_id } });
                  },
                },
                {
                  label: 'Müşteri Güncelle',
                  icon: 'fluent:edit-32-filled',
                  onSelect() {
                    router.push({ name: 'edit-customer', params: { customer_id: customer.customer_id } });
                  },
                },
              ],
              [
                {
                  label: 'Müşteriyi Sil',
                  color: 'error',
                  icon: 'fluent:person-subtract-24-regular',
                  onSelect() {
                    emits('selectCustomer', customer);
                  },
                },
              ],
            ]"
            :ui="{
              content: 'w-48 bg-transparent backdrop-blur-md',
            }"
          >
            <UButton :label="width > 640 ? 'Seçenekler' : undefined" icon="fluent:chevron-down-32-filled" color="neutral" variant="outline" />
          </UDropdownMenu>
        </td>
      </tr>
    </tbody>
  </table>

  <div v-if="customersPageCount !== 0" class="block sm:flex items-center justify-between sm:justify-center my-3 select-none">
    <div class="bg-white dark:bg-slate-900 p-2 rounded-md border-gray-200 dark:border-slate-700 border shadow-sm">
      <div class="flex flex-1 justify-between sm:hidden">
        <a
          @click="emits('previousPage')"
          class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
          >Previous</a
        >
        <a
          @click="emits('nextPage')"
          class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
          >Next</a
        >
      </div>
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-2xs" aria-label="Pagination">
            <a
              @click="emits('previousPage')"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0"
            >
              <span class="sr-only">Previous</span>
              <UIcon name="heroicons:chevron-left-16-solid" class="h-5 w-5 size-6" :class="{ 'text-black dark:text-white': currentPage !== 1 }" />
            </a>
            <a
              v-if="customersPageCount !== 0"
              @click="emits('selectPage', 1)"
              class="paging-item"
              :class="[currentPage === 1 ? 'font-bold  text-white bg-violet-600 hover:bg-violet-500' : 'hover:bg-gray-50 dark:hover:bg-gray-700']"
              >1</a
            >
            <span v-if="currentPage > 4" class="paging-item">...</span>
            <a
              v-for="page in pageRange"
              :key="page"
              @click="emits('selectPage', page)"
              class="paging-item"
              :class="[currentPage === page ? 'font-bold  text-white bg-violet-600 hover:bg-violet-500' : 'hover:bg-gray-50 dark:hover:bg-gray-700']"
              >{{ page }}</a
            >
            <span v-if="currentPage < customersPageCount - 3" class="paging-item">...</span>
            <a
              v-if="customersPageCount !== 0 && customersPageCount > 1"
              @click="emits('selectPage', customersPageCount)"
              class="paging-item"
              :class="[
                currentPage === customersPageCount
                  ? 'font-bold  text-white bg-violet-600 hover:bg-violet-500'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700',
              ]"
              >{{ customersPageCount }}</a
            >
            <a
              @click="emits('nextPage')"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0"
            >
              <span class="sr-only">Next</span>
              <UIcon
                name="heroicons:chevron-right-16-solid"
                class="h-5 w-5 size-6"
                :class="{ 'text-black dark:text-white': currentPage !== customersPageCount }"
              />
            </a>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "@/index.css";

.paging-item {
  @apply relative cursor-pointer inline-flex items-center px-4 py-2 text-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:z-20 focus:outline-offset-0;
}
</style>
