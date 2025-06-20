<template>
  <div class="grid grid-cols-12">
    <div class="col-span-12 md:col-start-2 md:col-span-10">
      <h1
        class="font-semibold text-4xl mb-8 inline-block bg-white dark:bg-slate-900 dark:text-white px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-950"
      >
        Müşteriler
      </h1>

      <RouterLink v-if="!loading" class="create-btn-wrapper" :to="{ name: 'create-customer' }">
        <div class="bg-[var(--secondary)] hover:bg-[var(--secondary-variant)] create-btn text-white">
          <UIcon name="heroicons:user-plus-16-solid" class="size-8" />
        </div>
      </RouterLink>

      <the-loading v-if="loading"></the-loading>
      <table id="customersTable" v-else-if="customers.length !== 0">
        <thead class="text-xs bg-linear-to-r from-[var(--primary-variant)] to-[var(--primary)] text-[var(--text-light)] h-12">
          <tr>
            <th scope="col" class="px-3 py-2" @click="sortTable(0)">Müşteri</th>
            <th v-if="isHaveAddress" scope="col" class="px-3 py-2" @click="sortTable(1)">Müşteri Adresi</th>
            <th scope="col" class="px-3 py-2" @click="sortTable(2)">Oluşturulma Tarihi</th>
            <th scope="col" class="px-3 py-2" @click="sortTable(3)">Net Bakiye</th>
            <th scope="col" class="px-3 py-2">İşlem</th>
          </tr>
        </thead>

        <tbody class="text-sm dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-950">
          <tr v-for="customer in customers" v-bind:key="customer.customer_id">
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
                        selCustomer(customer);
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

      <div v-else>
        <h1 class="text-center text-lg font-light">Müşteri bulunamadı...</h1>
      </div>

      <div v-if="customersPageCount !== 0" class="block sm:flex items-center justify-between sm:justify-center my-3 select-none">
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
                  <UIcon name="heroicons:chevron-left-16-solid" class="h-5 w-5 size-6" :class="{ 'text-black dark:text-white': currentPage !== 1 }" />
                </a>
                <a
                  v-if="customersPageCount !== 0"
                  @click="selectPage(1)"
                  class="paging-item"
                  :class="[currentPage === 1 ? 'font-bold  text-white bg-violet-600 hover:bg-violet-500' : 'hover:bg-gray-50 dark:hover:bg-gray-700']"
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
                <span v-if="currentPage < customersPageCount - 3" class="paging-item">...</span>
                <a
                  v-if="customersPageCount !== 0"
                  @click="selectPage(customersPageCount)"
                  class="paging-item"
                  :class="[
                    currentPage === customersPageCount
                      ? 'font-bold  text-white bg-violet-600 hover:bg-violet-500'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700',
                  ]"
                  >{{ customersPageCount }}</a
                >
                <a
                  @click="nextPage()"
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
    </div>

    <Teleport to="body">
      <UModal v-model:open="open" :dismissible="false" title="Silme Onayı">
        <template #body>
          <p class="text-base">'{{ selectedCustomer?.customer_name }}' adlı müşteriyi silmek istediğinizden emin misiniz?</p>
          <p class="text-red-700 dark:text-red-600 italic text-sm">Bu işlem geri alınamaz</p>
        </template>
        <template #footer>
          <UButton color="neutral" variant="solid" @click="open = false">Vazgeç</UButton>
          <UButton color="success" variant="solid" @click="removeCustomer(selectedCustomer!.customer_id)"> Onayla </UButton>
        </template>
      </UModal>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { useAppToast } from "@/composables/useAppToast";

import type { ICustomer } from "@/models/customer_model";
import router from "@/router";

//STATES
const { toastSuccess } = useAppToast();
const customerStore = useCustomerStore();
const isHaveAddress = ref(false);
const selectedCustomer = ref<ICustomer>();
const offset = ref(0);
const { customers, customersPageCount } = storeToRefs(customerStore);
const currentPage = ref<number>(1);
const loading = ref<boolean>(true);
const open = ref(false);

// defineShortcuts({
//   o: () => (open.value = !open.value),
// });

const pageRange = computed(() => {
  const range = [];
  const start = Math.max(2, currentPage.value - 2);
  const end = Math.min(customersPageCount.value - 1, currentPage.value + 2);
  for (let index = start; index <= end; index++) {
    range.push(index);
  }
  return range;
});

//FUNCTIONS
const selectPage = async (no: number) => {
  offset.value = (no - 1) * 15;
  await customerStore.getCustomers(offset.value);
  currentPage.value = no;
};

const previousPage = async () => {
  if (currentPage.value > 1) {
    offset.value = offset.value - 15;
    await customerStore.getCustomers(offset.value);
    currentPage.value = currentPage.value - 1;
  }
};

const nextPage = async () => {
  if (currentPage.value < customersPageCount.value) {
    offset.value = offset.value + 15;
    await customerStore.getCustomers(offset.value);
    currentPage.value = currentPage.value + 1;
  }
};

const selCustomer = (customer: any) => {
  selectedCustomer.value = customer;
  open.value = true;
};

const removeCustomer = async (customer_id: string) => {
  await customerStore
    .deleteCustomer(customer_id)
    .then(async () => {
      toastSuccess({ title: "Müşteri Başarıyla Silindi!" });
      await customerStore.getCustomers();
    })
    .finally(() => (open.value = false));
};

const changeLoadingState = () => {
  loading.value = !loading.value;
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
  await customerStore
    .getCustomers(offset.value)
    .then(async () => {
      customers.value.forEach((element: any) => {
        if (element.customer_address !== "") {
          isHaveAddress.value = true;
        }
      });
    })
    .finally(() => {
      changeLoadingState();
    });
  // await customerStore.getCustomersPageCount().then(() => {
  //   for (let i = 1; i <= customersPageCount.value; i++) {
  //     pages.value.push(i);
  //   }
  // });
});
</script>

<style scoped>
@reference "@/index.css";

.create-btn-wrapper {
  @apply fixed bottom-14 right-2/4 translate-x-2/4 translate-y-2/4 sm:right-4 sm:bottom-3 sm:translate-x-0 sm:translate-y-0 z-50;
}

.create-btn {
  @apply w-16 h-16 rounded-full p-4;
}

.paging-item {
  @apply relative cursor-pointer inline-flex items-center px-4 py-2 text-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:z-20 focus:outline-offset-0;
}
.dropdown-icon {
  width: 24px;
}
</style>
