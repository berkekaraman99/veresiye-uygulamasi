<template>
  <div>
    <div class="flex items-center justify-center">
      <page-header heading-text="Arama" />
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
          icon="fluent:search-24-filled"
          class="w-full"
          :ui="{ base: 'py-4 rounded-lg' }"
          v-model="searchQuery"
          @input="searchCustomer()"
        />
      </div>
    </div>

    <div class="grid grid-cols-12 h-full">
      <div
        class="my-5 p-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-950 shadow-md rounded-lg col-span-12 md:col-start-3 md:col-span-8"
        v-if="isSearched && searchedCustomers.length === 0"
      >
        <h3 class="text-center fs-5 fw-light">Müşteri bulunamadı</h3>
      </div>

      <TransitionGroup appear name="searchItem">
        <div
          class="relative flex items-center justify-between border border-slate-200 dark:border-slate-950 dark:text-white bg-white dark:bg-slate-900 my-2 p-4 shadow-md rounded-lg col-span-12 md:col-start-3 md:col-span-8"
          v-for="customer in searchedCustomers"
          :key="customer.customer_id"
        >
          <div class="text-sm font-semibold">{{ customer.customer_name }}</div>
          <UDropdownMenu
            arrow
            :content="{
              align: 'end',
              side: 'bottom',
              sideOffset: 8,
            }"
            :items="menuItems(customer)"
            :ui="{
              content:
                'w-48 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-md',
            }"
          >
            <UButton
              class="gradient-button"
              icon="fluent:chevron-down-32-filled"
              color="neutral"
              variant="outline"
            />
          </UDropdownMenu>
        </div>
      </TransitionGroup>
    </div>

    <ConfirmDeleteModal
      v-model="open"
      :message="`'${selectedCustomer?.customer_name}' adlı müşteriyi silmek istediğinizden emin misiniz?`"
      :loading="loading"
      @confirm="confirm"
    />
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import { storeToRefs } from "pinia";
import { onBeforeUnmount, ref } from "vue";
import { useAppToast } from "@/composables/useAppToast";
import { useRouter } from "vue-router";
import type { SearchedCustomer } from "@/models/searched_customer_model";
import { useConfirmDelete } from "@/composables/useConfirmDelete";
import type { DropdownMenuItem } from "@nuxt/ui";

const { toastSuccess, toastError } = useAppToast();
const customerStore = useCustomerStore();
const { searchedCustomers } = storeToRefs(customerStore);
const searchQuery = ref("");
const isSearched = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;
const router = useRouter();

const {
  open,
  item: selectedCustomer,
  loading,
  ask,
  confirm,
} = useConfirmDelete<SearchedCustomer>(async (customer) => {
  try {
    await customerStore.deleteCustomer(customer.customer_id);
    toastSuccess({ title: "Müşteri başarıyla silindi!" });
    await customerStore.getCustomers();
  } catch {
    toastError({ title: "Müşteri silinemedi" });
  }
});

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

const menuItems = (customer: SearchedCustomer): DropdownMenuItem[][] => [
  [
    {
      label: "Müşteri Bilgileri",
      icon: "fluent:person-32-regular",
      onSelect: () =>
        router.push({
          name: "customer",
          params: { customer_id: customer.customer_id },
        }),
    },
    {
      label: "Müşteri Güncelle",
      icon: "fluent:edit-32-filled",
      onSelect: () =>
        router.push({
          name: "edit-customer",
          params: { customer_id: customer.customer_id },
        }),
    },
  ],
  [
    {
      label: "Müşteriyi Sil",
      color: "error",
      icon: "fluent:person-subtract-24-regular",
      onSelect: () => ask(customer),
    },
  ],
];

onBeforeUnmount(() => {
  customerStore.$patch({
    searchedCustomers: [],
  });
});
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

.searchItem-move,
.searchItem-enter-active,
.searchItem-leave-active {
  transition: all 0.5s ease;
}

.searchItem-enter-from,
.searchItem-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.searchItem-leave-active {
  position: absolute;
}
</style>
