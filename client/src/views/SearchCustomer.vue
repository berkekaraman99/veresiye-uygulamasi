<script setup lang="ts">
import { UserIcon, UserMinusIcon, PencilIcon, MagnifyingGlassIcon } from "@heroicons/vue/24/solid";
import { useCustomerStore } from "@/stores/customer";
import { storeToRefs } from "pinia";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useToast } from "vue-toastification";
import gsap from "gsap";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";

import ModalVue from "@/components/common/ModalVue.vue";

const toast = useToast();
const customerStore = useCustomerStore();
const { searchedCustomers } = storeToRefs(customerStore);
const searchQuery = ref("");
const selectedCustomer = ref<ICustomer>();
const isSearched = ref(false);
let timer: any = null;
let modal: HTMLElement | null;
const showModal = ref<boolean>(false);

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

const toggleModal = () => {
  showModal.value = !showModal.value;
  console.log(showModal.value);
};

onBeforeUnmount(() => {
  customerStore.$patch({
    searchedCustomers: [],
  });
});

const beforeEnterSearch: any = (el: HTMLElement) => {
  el.style.opacity = "0";
  el.style.transform = "translateX(-64px)";
};
const enterSearch: any = (el: HTMLElement) => {
  const index = el.dataset.index ? parseInt(el.dataset.index) : 0;
  gsap.to(el, {
    opacity: 1,
    x: 0,
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
    x: 100,
    duration: 0.6,
    delay: 0.1 * index,
  });
};

onMounted(() => {
  modal = document.getElementById("modal-dialog");
});
</script>
<template>
  <div>
    <div class="flex items-center justify-center">
      <h1
        class="font-semibold text-4xl mb-8 inline-block bg-white dark:bg-slate-900 dark:text-white px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-950"
      >
        Arama
      </h1>
    </div>
    <div class="flex items-center justify-center mb-6">
      <div class="relative max-w-lg w-full">
        <MagnifyingGlassIcon class="absolute left-[10px] top-[25%] h-6 text-slate-400" />
        <input
          type="search"
          name="search"
          id="search"
          placeholder="Müşteri ara"
          class="dark:text-white border-2 border-slate-300 dark:border-slate-950 dark:bg-slate-900 text-[100%] rounded-lg p-4 pl-10 h-[48px] w-[100%]"
          v-model="searchQuery"
          @input="searchCustomer()"
        />
      </div>
    </div>

    <div class="flex justify-center">
      <h1
        class="font-semibold text-2xl mb-6 inline-block bg-white dark:bg-slate-900 dark:text-white px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-950"
        v-if="isSearched"
      >
        Arama Sonucu
      </h1>
    </div>
    <h3 class="text-center fs-5 fw-light my-5" v-if="isSearched && searchedCustomers.length === 0">Müşteri bulunamadı</h3>
    <div class="grid grid-cols-12 h-full">
      <!-- <h1 class="col-span-12 text-center">Müşteri aramak için yazınız...</h1> -->
      <TransitionGroup appear @before-enter="beforeEnterSearch" @enter="enterSearch" @before-leave="beforeLeaveSearch" @leave="leaveSearch">
        <div
          class="flex items-center justify-between border-2 dark:border-slate-950 dark:text-white bg-white dark:bg-slate-900 my-2 p-4 shadow-md rounded-lg col-span-12 md:col-start-3 md:col-span-8"
          v-for="(customer, index) in searchedCustomers"
          v-bind:key="customer.customer_id"
          :data-index="index"
        >
          <div class="text-sm font-semibold">{{ customer.customer_name }}</div>
          <Menu as="div" class="relative inline-block text-left">
            <div>
              <MenuButton
                class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white dark:bg-slate-900 dark:text-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Seçenekler
                <ChevronDownIcon class="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
              </MenuButton>
            </div>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-50"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute right-0 bottom-12 z-20 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-slate-900 shadow-lg border dark:border-slate-700 ring-1 ring-black ring-opacity-5 focus:outline-none"
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
                  <MenuItem v-slot="{ active }" @click="selCustomer(customer.customer_id), toggleModal()">
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
        </div>
      </TransitionGroup>
    </div>

    <!-- <h1 v-if="searchedCustomers.length === 0">Müşteri Bulunamadı</h1> -->

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

<style scoped lang="scss">
.search-input {
  transition: 0.3s ease;
  width: 240px !important;
  padding-left: 2.75rem;
  border-radius: 99px;

  &:focus {
    width: 100%;
    border-radius: 0.5rem;
  }
}

// .search-icon {
//   position: absolute;
//   left: 33%;
//   top: 36%;
//   transform: translateY(-50%);
//   width: 24px;
//   height: 24px;
//   fill: #888;
//   margin-left: 0.3rem;
// }
.dropdown-icon {
  width: 24px;
}
</style>
