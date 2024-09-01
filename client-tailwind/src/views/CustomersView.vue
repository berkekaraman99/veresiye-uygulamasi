<template>
  <div class="grid grid-cols-12">
    <div class="col-start-2 col-span-10">
      <h1 class="text-center font-semibold text-3xl mb-8">Müşteriler</h1>

      <RouterLink :to="{ name: 'create-customer' }">
        <div class="bg-purple-800 hover:bg-purple-600 create-btn text-white"><PlusIcon /></div>
      </RouterLink>

      <table id="customersTable" class="table w-full shadow" v-if="searchedCustomers.length !== 0">
        <thead class="text-xs bg-gray-200">
          <tr>
            <th scope="col" class="px-3 py-2" @click="sortTable(0)">Müşteri</th>
            <th v-if="isHaveAddress" scope="col" class="px-3 py-2" @click="sortTable(1)">Müşteri Adresi</th>
            <th scope="col" class="px-3 py-2" @click="sortTable(2)">Oluşturulma Tarihi</th>
            <th scope="col" class="px-3 py-2">İşlem</th>
          </tr>
        </thead>

        <tbody class="text-sm bg-white">
          <tr v-for="customer in searchedCustomers" v-bind:key="customer.customer_id">
            <td class="px-5 py-2">{{ customer.customer_name }}</td>
            <td v-if="isHaveAddress" class="px-3 py-2">{{ customer.customer_address }}</td>
            <td class="px-5 py-2">{{ customer.created_at.slice(0, 10) }}</td>
            <td class="px-5 py-3">
              <Menu as="div" class="relative inline-block text-left">
                <div>
                  <MenuButton
                    class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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
                    class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <div class="py-2">
                      <RouterLink :to="{ name: 'customer', params: { customer_id: customer.customer_id } }">
                        <MenuItem v-slot="{ active }">
                          <a class="flex items-center" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">
                            <span class="dropdown-icon"><UserIcon /></span> <span class="ps-3">Müşteri Bilgileri</span>
                          </a>
                        </MenuItem>
                      </RouterLink>
                      <RouterLink :to="{ name: 'edit-customer', params: { customer_id: customer.customer_id } }">
                        <MenuItem v-slot="{ active }">
                          <a class="flex items-center" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">
                            <span class="dropdown-icon"><PencilIcon /></span> <span class="ps-3">Müşteri Güncelle</span>
                          </a>
                        </MenuItem>
                      </RouterLink>
                      <MenuItem v-slot="{ active }" @click="selCustomer(customer)">
                        <a
                          class="flex items-center text-red-500"
                          :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
                        >
                          <span class="dropdown-icon"><UserMinusIcon /></span> <span class="ps-3">Müşteriyi Sil</span>
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
      <div class="flex items-center justify-center mt-8">
        <div
          v-for="page in pages"
          v-bind:key="page"
          :class="{ 'font-bold underline ': offset / 15 + 1 === page }"
          class="mx-1 fs-6"
          @click="selectPage(page)"
        >
          {{ page }}
        </div>
      </div>
    </div>
    <Teleport to="body">
      <!-- Modal -->
      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Silme Onayı</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>'{{ selectedCustomer?.customer_name }}' adlı müşteriyi silmek istediğinizden emin misiniz?</p>
              <p class="text-danger-emphasis">Bu işlem geri alınamaz</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Vazgeç</button>
              <button type="button" class="btn btn-danger" @click="removeCustomer(selectedCustomer?.customer_id!)" data-bs-dismiss="modal">
                Sil
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
    <ModalVue />
  </div>
</template>

<script setup lang="ts">
import { UserIcon, UserMinusIcon, PencilIcon, PlusIcon } from "@heroicons/vue/24/solid";
import { useCustomerStore } from "@/stores/customer";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useToast } from "vue-toastification";
import { RouterLink } from "vue-router";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import ModalVue from "@/components/common/ModalVue.vue";

//STATES
const toast = useToast();
const customerStore = useCustomerStore();
const isHaveAddress = ref(false);
const selectedCustomer = ref<ICustomer>();
const offset = ref(0);
const pages = ref<Array<number>>([]);
const { customers, searchedCustomers, customersPageCount } = storeToRefs(customerStore);

//FUNCTIONS
const selectPage = async (no: number) => {
  offset.value = (no - 1) * 15;
  if (offset.value / 15 - 1 !== no) {
    await customerStore.getCustomers(offset.value);
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
  await customerStore.getCustomers(offset.value).then(async () => {
    customers.value.forEach((element) => {
      if (element.customer_address !== "") {
        isHaveAddress.value = true;
      }
    });
  });
  await customerStore.getCustomersPageCount().then(() => {
    for (let i = 1; i <= customersPageCount.value; i++) {
      pages.value.push(i);
    }
  });
});
</script>

<style lang="scss" scoped>
.create-btn {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  border-radius: 4rem;
  height: 4rem;
  width: 4rem;
  padding: 1rem;
}

.dropdown-icon {
  width: 24px;
}
</style>
