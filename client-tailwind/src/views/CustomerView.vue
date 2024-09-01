<template>
  <div>
    <div class="grid grid-cols-12">
      <div class="col-start-2 col-span-10">
        <div class="">
          <h1 class="text-center mb-8 font-semibold text-3xl">Müşteri Bilgileri</h1>
          <div class="p-4 bg-white rounded-lg shadow-lg">
            <table class="table w-full">
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-12 mt-8" v-if="customerReceipts.length !== 0">
      <div class="col-span-12">
        <div>
          <h1 class="text-center mb-8 font-semibold text-2xl">Faturalar</h1>
          <table id="receiptsTable" class="table w-full">
            <thead class="text-xs bg-gray-200">
              <tr>
                <th scope="col" class="px-3 py-2" @click="sortTable(0)">Fatura No</th>
                <th scope="col" class="px-3 py-2" @click="sortTable(1)">Tarih</th>
                <th scope="col" class="px-3 py-2" @click="sortTable(2)">Fatura Türü</th>
                <th v-if="isHaveDescription" scope="col" class="px-3 py-2" @click="sortTable(3)">Açıklama</th>
                <th scope="col" class="px-3 py-2" @click="sortTable(4)">Bakiye</th>
                <th scope="col" class="px-3 py-2">İşlem</th>
              </tr>
            </thead>
            <tbody class="text-sm bg-white">
              <tr v-for="receipt in customerReceipts" v-bind:key="receipt.receipt_id">
                <td class="px-4 py-2">{{ receipt.receipt_id }}</td>
                <td class="px-3 py-2">{{ receipt.created_date.slice(0, 10) }}</td>
                <td class="px-3 py-2">{{ reformatReceiptType(receipt.receipt_type) }}</td>
                <td v-if="isHaveDescription" class="px-3 py-2">{{ receipt.description }}</td>
                <td class="px-3 py-2">{{ receipt.price + " ₺" }}</td>
                <td class="px-3 py-2">
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
                          <RouterLink :to="{ name: 'receipt', params: { receipt_id: receipt.receipt_id } }">
                            <MenuItem v-slot="{ active }">
                              <a
                                class="flex items-center"
                                :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
                              >
                                <span class="dropdown-icon"><DocumentTextIcon /></span> <span class="ps-3">Fatura Bilgileri</span>
                              </a>
                            </MenuItem>
                          </RouterLink>
                          <RouterLink :to="{ name: 'edit-receipt', params: { receipt_id: receipt.receipt_id } }">
                            <MenuItem v-slot="{ active }">
                              <a
                                class="flex items-center"
                                :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
                              >
                                <span class="dropdown-icon"><PencilIcon /></span> <span class="ps-3">Faturayı Güncelle</span>
                              </a>
                            </MenuItem>
                          </RouterLink>
                          <MenuItem v-slot="{ active }" @click="removeReceipt(receipt.receipt_id)">
                            <a
                              class="flex items-center text-red-500"
                              :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
                            >
                              <span class="dropdown-icon"><TrashIcon /></span> <span class="ps-3">Faturayı Sil</span>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import { useReceiptStore } from "@/stores/receipt";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { reformatReceiptType } from "@/utils/receipt_helper";
import { DocumentTextIcon, TrashIcon, PencilIcon } from "@heroicons/vue/24/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";

interface Props {
  customer_id: string;
}

//STATES
const props = defineProps<Props>();
const isHaveDescription = ref<boolean>(false);
const receiptStore = useReceiptStore();
const customerStore = useCustomerStore();
const { customer, customerReceipts } = storeToRefs(customerStore);

//FUNCTIONS
const removeReceipt = async (receipt_id: string) => {
  await receiptStore.deleteReceipt(receipt_id).then(async () => {
    await customerStore.getCustomerReceipts(props.customer_id);
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
    customerReceipts.value.forEach((element) => {
      if (element.description !== "") {
        isHaveDescription.value = true;
      }
    });
  });
});
</script>

<style scoped lang="scss">
.dropdown-icon {
  width: 24px;
}
</style>
