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
          <PlusIcon />
        </div>
      </RouterLink>

      <the-loading v-if="loading"></the-loading>
      <table id="customersTable" class="table w-full shadow-sm" v-else-if="customers.length !== 0">
        <thead class="text-xs bg-[var(--primary-variant)] text-[var(--text-light)] h-12">
          <tr>
            <th scope="col" class="px-3 py-2" @click="sortTable(0)">Müşteri</th>
            <th v-if="isHaveAddress" scope="col" class="px-3 py-2" @click="sortTable(1)">Müşteri Adresi</th>
            <th scope="col" class="px-3 py-2" @click="sortTable(2)">Oluşturulma Tarihi</th>
            <th scope="col" class="px-3 py-2" @click="sortTable(3)">Net Bakiye</th>
            <th scope="col" class="px-3 py-2">İşlem</th>
          </tr>
        </thead>

        <tbody class="text-sm dark:text-white bg-white dark:bg-slate-900 border dark:border-slate-950">
          <tr v-for="customer in customers" v-bind:key="customer.customer_id">
            <td class="px-3 py-2">{{ customer.customer_name }}</td>
            <td v-if="isHaveAddress" class="px-3 py-2">{{ customer.customer_address }}</td>
            <td class="px-3 py-2 text-center">{{ customer.created_at.slice(0, 10) }}</td>
            <td class="px-3 py-2 text-center">{{ customer.net_bakiye.toFixed(2).toString() + " TL" }}</td>
            <td class="px-3 py-2 text-center">
              <Menu as="div" class="relative inline-block text-left">
                <div>
                  <MenuButton
                    class="inline-flex w-full justify-center gap-x-1.5 rounded-md dark:text-white bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 dark:ring-gray-700"
                  >
                    Seçenekler
                    <ChevronDownIcon class="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                  </MenuButton>
                </div>

                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems
                    class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-slate-900 shadow-lg border dark:border-slate-700 ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <div class="py-2">
                      <RouterLink :to="{ name: 'customer', params: { customer_id: customer.customer_id } }">
                        <MenuItem v-slot="{ active }">
                          <a
                            class="flex items-center"
                            :class="[
                              active ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300',
                              'block px-4 py-2 text-sm',
                            ]"
                          >
                            <span class="dropdown-icon">
                              <UserIcon />
                            </span>
                            <span class="ps-3">Müşteri Bilgileri</span>
                          </a>
                        </MenuItem>
                      </RouterLink>
                      <RouterLink :to="{ name: 'edit-customer', params: { customer_id: customer.customer_id } }">
                        <MenuItem v-slot="{ active }">
                          <a
                            class="flex items-center"
                            :class="[
                              active ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300',
                              'block px-4 py-2 text-sm',
                            ]"
                          >
                            <span class="dropdown-icon">
                              <PencilIcon />
                            </span>
                            <span class="ps-3">Müşteri Güncelle</span>
                          </a>
                        </MenuItem>
                      </RouterLink>
                      <MenuItem v-slot="{ active }" @click="selCustomer(customer), toggleModal()">
                        <a
                          class="flex items-center text-red-600 hover:text-red-400 cursor-pointer"
                          :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
                        >
                          <span class="dropdown-icon">
                            <UserMinusIcon />
                          </span>
                          <span class="ps-3">Müşteriyi Sil</span>
                        </a>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else>
        <h1 class="text-center text-lg font-light">Müşteri bulunamadı...</h1>
      </div>

      <div v-if="customersPageCount !== 0" class="block sm:flex items-center justify-between sm:justify-center my-3">
        <div class="bg-white dark:bg-slate-900 p-2 rounded-md border-gray-200 dark:border-slate-700 border shadow">
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
              <nav class="isolate inline-flex -space-x-px rounded-md shadow-xs" aria-label="Pagination">
                <a
                  @click="previousPage()"
                  class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span class="sr-only">Previous</span>
                  <ChevronLeftIcon class="h-5 w-5" :class="{ 'text-black dark:text-white': currentPage !== 1 }" aria-hidden="true" />
                </a>
                <a
                  v-if="customersPageCount !== 0"
                  @click="selectPage(1)"
                  class="relative cursor-pointer inline-flex items-center px-4 py-2 text-sm text-gray-900 dark:text-gray-200 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  :class="{ 'font-bold underline bg-violet-600': currentPage == 1 }"
                  >1</a
                >
                <span
                  v-if="currentPage > 4"
                  class="relative cursor-pointer inline-flex items-center px-4 py-2 text-sm text-gray-900 dark:text-gray-200 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0"
                  s
                  >...</span
                >
                <a
                  v-for="page in pageRange"
                  :key="page"
                  @click="selectPage(page)"
                  class="relative cursor-pointer inline-flex items-center px-4 py-2 text-sm text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  :class="{ 'font-bold underline bg-violet-600': currentPage === page }"
                  >{{ page }}</a
                >
                <span
                  v-if="currentPage < customersPageCount - 3"
                  class="relative cursor-pointer inline-flex items-center px-4 py-2 text-sm text-gray-900 dark:text-gray-200 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0"
                  >...</span
                >
                <a
                  v-if="customersPageCount !== 0"
                  @click="selectPage(customersPageCount)"
                  class="relative cursor-pointer inline-flex items-center px-4 py-2 text-sm text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  :class="{ 'font-bold underline bg-violet-600': currentPage == customersPageCount }"
                  >{{ customersPageCount }}</a
                >
                <a
                  @click="nextPage()"
                  class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span class="sr-only">Next</span>
                  <ChevronRightIcon
                    class="h-5 w-5"
                    :class="{ 'text-black dark:text-white': currentPage !== customersPageCount }"
                    aria-hidden="true"
                  />
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body" v-if="showModal">
      <ModalVue @close="toggleModal()">
        <template #header>
          <h2 class="text-xl">Silme Onayı</h2>
          <span id="close-btn" class="close" @click="toggleModal()">&times;</span>
        </template>
        <template #default>
          <p class="text-base">'{{ selectedCustomer?.customer_name }}' adlı müşteriyi silmek istediğinizden emin misiniz?</p>
          <p class="text-red-600 italic text-sm">Bu işlem geri alınamaz</p>
        </template>
        <template #actions>
          <button class="bg-gray-500 hover:bg-gray-600 text-sm text-white px-3 py-2 mx-4 rounded-lg" @click="toggleModal()">Vazgeç</button>
          <button
            class="bg-green-600 hover:bg-green-700 px-3 py-2 text-sm text-white rounded-lg"
            @click="removeCustomer(selectedCustomer!.customer_id), toggleModal()"
          >
            Onayla
          </button>
        </template>
      </ModalVue>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { UserIcon, UserMinusIcon, PencilIcon, PlusIcon } from "@heroicons/vue/24/solid";
import { useCustomerStore } from "@/stores/customer";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { useToast } from "vue-toastification";
import { RouterLink } from "vue-router";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/20/solid";

import ModalVue from "@/components/common/ModalVue.vue";

//STATES
const toast = useToast();
const customerStore = useCustomerStore();
const isHaveAddress = ref(false);
const selectedCustomer = ref<ICustomer>();
const offset = ref(0);
const pages = ref<Array<number>>([]);
const { customers, customersPageCount } = storeToRefs(customerStore);
let modal: HTMLElement | null;
const showModal = ref<boolean>(false);
const currentPage = ref<number>(1);
const loading = ref<boolean>(true);

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

const nextPage = async () => {
  if (currentPage.value < customersPageCount.value) {
    offset.value = offset.value + 15;
    await customerStore.getCustomers(offset.value);
    currentPage.value = currentPage.value + 1;
  }
};

const previousPage = async () => {
  if (currentPage.value > 1) {
    offset.value = offset.value - 15;
    await customerStore.getCustomers(offset.value);
    currentPage.value = currentPage.value - 1;
  }
};
const selCustomer = (customer: any) => {
  selectedCustomer.value = customer;
};

const removeCustomer = async (customer_id: string) => {
  await customerStore.deleteCustomer(customer_id).then(async () => {
    toast.success("Müşteri Başarıyla Silindi!", { timeout: 2000 });
    await customerStore.getCustomers();
  });
};

const changeLoadingState = () => {
  loading.value = !loading.value;
};

const toggleModal = () => {
  showModal.value = !showModal.value;
  console.log(showModal.value);
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
    .then(() => {
      changeLoadingState();
    })
    .catch((e) => {
      changeLoadingState();
    });
  await customerStore.getCustomersPageCount().then(() => {
    for (let i = 1; i <= customersPageCount.value; i++) {
      pages.value.push(i);
    }
  });
  modal = document.getElementById("modal-dialog");
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

.dropdown-icon {
  width: 24px;
}
</style>
