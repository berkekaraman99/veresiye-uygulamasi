<template>
  <div class="row">
    <div class="col-12 col-sm-12 offset-lg-2 col-lg-8">
      <div class="text-sm">
        <h1 class="text-center fw-bold my-3">Müşteriler</h1>
        <table id="customersTable" class="table table-striped table-hover table-borderless" v-if="customers.length !== 0">
          <thead class="text-xs text-secondary bg-body">
            <tr>
              <th scope="col" class="px-3 py-2" @click="sortTable(0)">Müşteri</th>
              <th v-if="isHaveAddress" scope="col" class="px-3 py-2" @click="sortTable(1)">Müşteri Adresi</th>
              <th scope="col" class="px-3 py-2" @click="sortTable(2)">Oluşturulma Tarihi</th>
              <th scope="col" class="px-3 py-2">İşlem</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in customers" v-bind:key="customer.customer_id">
              <td class="px-3 py-2">{{ customer.customer_name }}</td>
              <td v-if="isHaveAddress" class="px-3 py-2">{{ customer.customer_address }}</td>
              <td class="px-3 py-2">{{ customer.created_at.slice(0, 10) }}</td>
              <td class="px-3 py-2">
                <div class="dropdown">
                  <a
                    class="btn border dropdown-toggle shadow-sm fw-semibold text-sm"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Seçenekler
                  </a>

                  <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                      <RouterLink :to="{ name: 'customer', params: { customer_id: customer.customer_id } }" class="dropdown-item"
                        ><UserIcon /> Müşteri Bilgileri</RouterLink
                      >
                    </li>
                    <li>
                      <RouterLink :to="{ name: 'edit-customer', params: { customer_id: customer.customer_id } }" class="dropdown-item"
                        ><PencilIcon /> Müşteri Güncelle</RouterLink
                      >
                    </li>
                    <li>
                      <a class="dropdown-item text-danger" @click="removeCustomer(customer.customer_id)"><UserMinusIcon /> Müşteriyi Sil</a>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserIcon, UserMinusIcon, PencilIcon } from "@heroicons/vue/24/solid";
import { useCustomerStore } from "@/stores/customer";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useToast } from "vue-toastification";
import { RouterLink } from "vue-router";

const toast = useToast();
const customerStore = useCustomerStore();
const isHaveAddress = ref(false);

const { customers } = storeToRefs(customerStore);

const removeCustomer = async (customer_id: string) => {
  await customerStore.deleteCustomer(customer_id).then(async () => {
    toast.success("Müşteri Başarıyla Silindi!", { timeout: 2000 });
    await customerStore.getCustomers();
  });
};

onMounted(async () => {
  await customerStore.getCustomers().then(() => {
    customers.value.forEach((element) => {
      if (element.customer_address !== "") {
        isHaveAddress.value = true;
      }
    });
  });
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

td {
  align-content: center;
}
// thead {
//   background-image: linear-gradient(90deg, red 0%, blue 100%);
// }

// th,
// td {
//   text-align: center;
// }

li svg {
  width: 24px;
}
</style>
