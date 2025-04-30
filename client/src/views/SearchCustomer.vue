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
        <UInput
          type="text"
          name="search"
          id="search"
          placeholder="Müşteri ara"
          color="secondary"
          size="xl"
          icon="i-lucide-search"
          class="w-full"
          :ui="{ base: 'py-4' }"
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
            <UButton icon="fluent:chevron-down-32-filled" color="neutral" variant="outline" />
          </UDropdownMenu>
        </div>
      </TransitionGroup>
    </div>

    <Teleport to="body">
      <UModal v-model:open="open" :dismissible="false" title="Silme Onayı">
        <template #body>
          <p class="text-base">'{{ selectedCustomer?.customer_name }}' adlı müşteriyi silmek istediğinizden emin misiniz?</p>
          <p class="text-red-700 dark:text-red-600 italic text-sm">Bu işlem geri alınamaz</p>
        </template>
        <template #footer>
          <div class="w-full flex items-center justify-end-safe">
            <UButton color="neutral" variant="solid" @click="open = false">Vazgeç</UButton>
            <UButton color="success" variant="solid" class="ms-2" @click="removeCustomer(selectedCustomer!.customer_id)"> Onayla </UButton>
          </div>
        </template>
      </UModal>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import { storeToRefs } from "pinia";
import { onBeforeUnmount, ref } from "vue";
import gsap from "gsap";
import { useAppToast } from "@/composables/useAppToast";
import type { ISearchedCustomer } from "@/models/searched_customer_model";
import { useRouter } from "vue-router";

const { toastSuccess } = useAppToast();
const customerStore = useCustomerStore();
const { searchedCustomers } = storeToRefs(customerStore);
const searchQuery = ref("");
const selectedCustomer = ref<ISearchedCustomer>();
const isSearched = ref(false);
let timer: any = null;
const router = useRouter();
const open = ref(false);

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
    } else {
      customerStore.$patch({
        searchedCustomers: [],
      });
      isSearched.value = false;
    }
  }, 500);
};

const selCustomer = (customer: ISearchedCustomer) => {
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
</script>

<style scoped>
.search-input {
  transition: 0.3s ease;
  width: 240px !important;
  padding-left: 2.75rem;
  border-radius: 99px;
}
.search-input:focus {
  width: 100%;
  border-radius: 0.5rem;
}

.dropdown-icon {
  width: 24px;
}
</style>
