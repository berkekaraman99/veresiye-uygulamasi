<template>
  <div>
    <div class="grid grid-cols-12">
      <div class="col-span-12 sm:col-span-12 lg:col-start-3 lg:col-span-8 xl:col-start-4 xl:col-span-6">
        <div class="py-6 px-0 sm:px-4 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 bg-white border rounded-lg">
          <h1 class="text-center mb-12 font-bold text-2xl">Müşteri Bilgileri</h1>
          <div class="p-4">
            <p>Müşteri Adı: {{ customer?.customer_name }}</p>
            <p>Müşteri Adresi: {{ customer?.customer_address }}</p>
            <p>Müşterinin Eklenme Tarihi: {{ customer?.created_at }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-12 my-3" v-if="customerReceipts.length !== 0">
      <div class="col-span-12">
        <div class="py-6 px-0 sm:px-4 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 bg-white border rounded-lg">
          <h1 class="text-center mb-12 font-bold text-2xl">Rapor</h1>

          <table id="receiptsTable" class="table-auto w-full border-collapse border">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3" @click="sortTable(0)">Fatura No</th>
                <th scope="col" class="px-6 py-3" @click="sortTable(1)">Tarih</th>
                <th scope="col" class="px-6 py-3" @click="sortTable(2)">Fatura Türü</th>
                <th scope="col" class="px-6 py-3" @click="sortTable(3)">Açıklama</th>
                <th scope="col" class="px-6 py-3" @click="sortTable(4)">Bakiye</th>
                <th scope="col" class="px-6 py-3">İşlem</th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                v-for="receipt in customerReceipts"
                v-bind:key="receipt.receipt_id"
              >
                <td class="px-6 py-4">{{ receipt.receipt_id }}</td>
                <td class="px-6 py-4">{{ receipt.created_date.slice(0, 10) }}</td>
                <td class="px-6 py-4">{{ reformatReceiptType(receipt.receipt_type) }}</td>
                <td class="px-6 py-4">{{ receipt.description }}</td>
                <td class="px-6 py-4">{{ receipt.price + " ₺" }}</td>
                <td class="px-6 py-4">
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
                        <div class="py-1">
                          <MenuItem v-slot="{ active }">
                            <RouterLink
                              :to="{ name: 'receipt', params: { receipt_id: receipt.receipt_id } }"
                              :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
                              >Fatura Bilgileri</RouterLink
                            >
                          </MenuItem>
                          <MenuItem v-slot="{ active }">
                            <RouterLink
                              :to="{ name: 'edit-receipt', params: { receipt_id: receipt.receipt_id } }"
                              :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
                              >Faturayı Güncelle</RouterLink
                            >
                          </MenuItem>
                          <MenuItem v-slot="{ active }">
                            <a
                              href="#"
                              :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm text-red-500']"
                              @click="removeReceipt(receipt.receipt_id)"
                              >Faturayı Sil</a
                            >
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
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import { useCustomerStore } from "@/stores/customer";
import { useReceiptStore } from "@/stores/receipt";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { RouterLink } from "vue-router";
import { reformatReceiptType } from "@/utils/receipt_helper";

const props = defineProps({
  customer_id: {
    type: String,
    required: true,
  },
});

const receiptStore = useReceiptStore();
const customerStore = useCustomerStore();
const { customer, customerReceipts } = storeToRefs(customerStore);

const removeReceipt = async (receipt_id: string) => {
  await receiptStore.deleteReceipt(receipt_id).then(async () => {
    await customerStore.getCustomerReceipts(props.customer_id);
  });
};

onMounted(async () => {
  await customerStore.getCustomerById(props.customer_id);
  await customerStore.getCustomerReceipts(props.customer_id);
});

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
