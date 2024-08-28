<template>
  <div>
    <div class="d-flex align-items-center justify-content-center my-4 position-relative">
      <MagnifyingGlassIcon class="search-icon" />
      <input
        id="search-input"
        class="form-control form-control-lg"
        placeholder="Müşteri ara"
        type="search"
        v-model="searchQuery"
        @input="searchCustomer()"
      />
    </div>

    <h1 class="text-center fw-bold mb-4" v-if="isSearched">Arama Sonucu</h1>
    <h3 class="text-center fs-5 fw-light my-5" v-if="isSearched && searchedCustomers.length === 0">Müşteri bulunamadı</h3>
    <TransitionGroup appear @before-enter="beforeEnterSearch" @enter="enterSearch" @before-leave="beforeLeaveSearch" @leave="leaveSearch">
      <div
        class="d-flex align-items-center justify-content-between bg-body my-2 p-3 shadow-sm rounded-3"
        v-for="(customer, index) in searchedCustomers"
        v-bind:key="customer.customer_id"
        :data-index="index"
      >
        <div class="text-sm">{{ customer.customer_name }}</div>
        <div class="dropup z-n1">
          <a class="btn border dropdown-toggle shadow-sm fw-semibold text-sm" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Seçenekler
          </a>

          <ul class="dropdown-menu dropdown-menu-end z-n1">
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
      </div>
    </TransitionGroup>

    <!-- <h1 v-if="searchedCustomers.length === 0">Müşteri Bulunamadı</h1> -->

    <Teleport to="body">
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
import { UserIcon, UserMinusIcon, PencilIcon, MagnifyingGlassIcon } from "@heroicons/vue/24/solid";
import { useCustomerStore } from "@/stores/customer";
import { storeToRefs } from "pinia";
import { onBeforeUnmount, ref } from "vue";
import { useToast } from "vue-toastification";
import gsap from "gsap";

const toast = useToast();
const customerStore = useCustomerStore();
const { searchedCustomers } = storeToRefs(customerStore);
const searchQuery = ref("");
const selectedCustomer = ref<ICustomer>();
const isSearched = ref(false);
let timer: any = null;

const searchCustomer = () => {
  if (timer != null) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    if (searchQuery.value != "") {
      customerStore.searchCustomers(searchQuery.value).then(() => {
        if (!isSearched.value) {
          isSearched.value = true;
        }
      });
    }
  }, 500);
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

onBeforeUnmount(() => {
  customerStore.$patch({
    searchedCustomers: [],
  });
});

const beforeEnterSearch: any = (el: HTMLElement) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(64px)";
};
const enterSearch: any = (el: HTMLElement) => {
  const index = el.dataset.index ? parseInt(el.dataset.index) : 0;
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    delay: 0.1 * index,
  });
};
const beforeLeaveSearch: any = (el: HTMLElement) => {
  el.style.opacity = "1";
};
const leaveSearch: any = (el: HTMLElement) => {
  const index = el.dataset.index ? parseInt(el.dataset.index) : 0;
  gsap.to(el, {
    opacity: 0,
    y: 100,
    duration: 0.6,
    delay: 0.1 * index,
  });
};
</script>

<style scoped lang="scss"></style>
