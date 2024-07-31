<template>
  <div class="grid grid-cols-12">
    <div class="col-span-12 sm:col-span-12 lg:col-start-3 lg:col-span-8 xl:col-start-4 xl:col-span-6">
      <div class="py-6 px-0 sm:px-4 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 bg-white border rounded-lg">
        <h1 class="text-center mb-12 font-bold text-2xl">Müşteriler</h1>
        <table class="table-auto w-full border-collapse border" v-if="customers.length !== 0">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3" @click="sortTable(0)">Müşteri</th>
              <th scope="col" class="px-6 py-3" @click="sortTable(1)">Müşteri Adresi</th>
              <th scope="col" class="px-6 py-3" @click="sortTable(2)">Oluşturulma Tarihi</th>
              <th scope="col" class="px-6 py-3">İşlem</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
              v-for="customer in customers"
              v-bind:key="customer.customer_id"
            >
              <td class="px-6 py-4">{{ customer.customer_name }}</td>
              <td class="px-6 py-4">{{ customer.customer_address }}</td>
              <td class="px-6 py-4">{{ customer.created_at }}</td>
              <td class="px-6 py-4">
                <Menu as="div" class="relative inline-block text-left">
                  <div>
                    <MenuButton
                      class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Options
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
                            :to="{ name: 'customer', params: { customer_id: customer.customer_id } }"
                            :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
                            >Müşteri Bilgileri</RouterLink
                          >
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                          <RouterLink
                            :to="{ name: 'edit-customer', params: { customer_id: customer.customer_id } }"
                            :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']"
                            >Müşteri Güncelle</RouterLink
                          >
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                          <a
                            href="#"
                            :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm text-red-500']"
                            @click="removeCustomer(customer.customer_id)"
                            >Müşteriyi Sil</a
                          >
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </transition>
                </Menu>
              </td>
            </tr>
            <!-- <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <td class="px-6 py-4">1</td>
              <td class="px-6 py-4">2</td>
              <td class="px-6 py-4">3</td>
            </tr> -->
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import { useToast } from "vue-toastification";
import { RouterLink } from "vue-router";

const toast = useToast();
const customerStore = useCustomerStore();

const { customers } = storeToRefs(customerStore);
onMounted(async () => {
  await customerStore.getCustomers();
});

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

<style lang="scss" scoped>
th {
  cursor: pointer;

  &:first-child {
    border-top-left-radius: 0.5rem;
  }
  &:last-child {
    border-top-right-radius: 0.5rem;
  }
}

tr {
  &:last-child td {
    &:first-child {
      border-bottom-left-radius: 0.5rem;
    }
    &:last-child {
      border-bottom-right-radius: 0.5rem;
    }
  }
}

thead tr,
thead tr th {
  background-color: transparent;
}

// thead {
//   background-image: linear-gradient(90deg, red 0%, blue 100%);
// }

th,
td {
  text-align: center;
}
</style>
