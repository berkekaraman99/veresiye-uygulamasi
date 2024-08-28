<template>
  <div class="row">
    <div class="col-12 col-sm-12 offset-lg-2 col-lg-8">
      <div class="text-sm">
        <h1 class="text-center fw-bold my-3">Müşteriler</h1>
        <button class="btn btn-primary create-btn">
          <RouterLink :to="{ name: 'create-customer' }" class="text-white"><PlusIcon /></RouterLink>
        </button>

        <table id="customersTable" class="table table-striped table-hover table-borderless" v-if="searchedCustomers.length !== 0">
          <thead class="text-xs text-secondary bg-body">
            <tr>
              <th scope="col" class="px-3 py-2" @click="sortTable(0)">Müşteri</th>
              <th v-if="isHaveAddress" scope="col" class="px-3 py-2" @click="sortTable(1)">Müşteri Adresi</th>
              <th scope="col" class="px-3 py-2" @click="sortTable(2)">Oluşturulma Tarihi</th>
              <th scope="col" class="px-3 py-2">İşlem</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="customer in searchedCustomers" v-bind:key="customer.customer_id">
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
                      <a class="dropdown-item text-danger" @click="selCustomer(customer)" data-bs-toggle="modal" data-bs-target="#exampleModal"
                        ><UserMinusIcon /> Müşteriyi Sil</a
                      >
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="d-flex align-items-center justify-content-center mt-4">
          <div
            v-for="page in pages"
            v-bind:key="page"
            :class="{ 'fw-bold text-decoration-underline ': offset / 15 + 1 === page }"
            class="mx-1 fs-6"
            @click="selectPage(page)"
          >
            {{ page }}
          </div>
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
  </div>
</template>

<script setup lang="ts">
import { UserIcon, UserMinusIcon, PencilIcon, PlusIcon } from "@heroicons/vue/24/solid";
import { useCustomerStore } from "@/stores/customer";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useToast } from "vue-toastification";
import { RouterLink } from "vue-router";

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
</style>
