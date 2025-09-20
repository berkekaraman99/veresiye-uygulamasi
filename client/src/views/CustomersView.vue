<template>
  <div class="grid grid-cols-12">
    <div class="col-span-12 md:col-start-2 md:col-span-10">
      <h1
        class="font-semibold text-4xl mb-8 inline-block bg-white dark:bg-slate-900 dark:text-white px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-950"
      >
        Müşteriler
      </h1>

      <div class="flex items-center justify-center-safe">
        <div class="flex items-center bg-white dark:bg-slate-900 rounded-xl px-2 py-2">
          <h3
            :class="[isCompactMode ? 'bg-slate-200 dark:bg-slate-700 font-bold ' : null]"
            class="px-2 py-2 me-1 text-sm rounded-lg cursor-pointer ease-in-out transition-all duration-200"
            @click="handleCompactMode(true)"
          >
            Kompakt Görünüm
          </h3>
          <h3
            :class="[!isCompactMode ? 'bg-slate-200 dark:bg-slate-700 font-bold ' : null]"
            class="px-2 py-2 ms-1 text-sm rounded-lg cursor-pointer ease-in-out transition-all duration-200"
            @click="handleCompactMode(false)"
          >
            Detaylı Görünüm
          </h3>
        </div>
      </div>

      <RouterLink v-if="!loading" class="create-btn-wrapper" :to="{ name: 'create-customer' }">
        <div class="backdrop-blur-lg bg-[var(--secondary)]/85 hover:bg-[var(--secondary-variant)]/85 create-btn text-white">
          <UIcon name="heroicons:user-plus-16-solid" class="size-8" />
        </div>
      </RouterLink>
      <the-loading v-if="loading"></the-loading>

      <CompactList
        v-if="isCompactMode"
        :width="width"
        :compact-customers="compactCustomers"
        @remove-customer="removeCustomer"
        @select-customer="selCustomer"
      />
      <DetailedList
        v-else
        :is-have-address="isHaveAddress"
        :width="width"
        :detailed-customers="detailedCustomers"
        :customers-page-count="customersPageCount"
        :page-range="pageRange"
        :current-page="currentPage"
        @remove-customer="removeCustomer"
        @select-customer="selCustomer"
        @select-page="selectPage"
        @previous-page="previousPage"
        @next-page="nextPage"
      />
    </div>

    <Teleport to="body">
      <UModal v-model:open="open" :dismissible="false" title="Silme Onayı">
        <template #header>
          <h3 class="text-xl font-bold">Silme Onayı</h3>
        </template>
        <template #body>
          <p class="text-base">'{{ selectedCustomer?.customer_name }}' adlı müşteriyi silmek istediğinizden emin misiniz?</p>
          <p class="text-red-700 dark:text-red-600 italic text-sm">Bu işlem geri alınamaz</p>
        </template>
        <template #footer>
          <div class="flex items-center justify-end w-full">
            <UButton color="neutral" variant="solid" class="rounded-full px-6 py-3 me-2" @click="open = false">Vazgeç</UButton>
            <UButton color="secondary" variant="solid" class="rounded-full px-6 py-3" @click="removeCustomer(selectedCustomer!.customer_id)">
              Onayla
            </UButton>
          </div>
        </template>
      </UModal>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { useAppToast } from "@/composables/useAppToast";

import type { ICustomer } from "@/models/customer_model";
import type { Customers } from "@/models/customers_model";

//STATES
const { toastSuccess } = useAppToast();
const customerStore = useCustomerStore();
const isHaveAddress = ref(false);
const selectedCustomer = ref<ICustomer>();
const offset = ref(0);
const { compactCustomers, detailedCustomers, customersPageCount } = storeToRefs(customerStore);
const currentPage = ref<number>(1);
const loading = ref<boolean>(true);
const open = ref(false);
const width = ref(document.documentElement.clientWidth);
const isCompactMode = ref(true);

const pageRange = computed(() => {
  const range = [];
  const start = Math.max(2, currentPage.value - 2);
  const end = Math.min(customersPageCount.value - 1, currentPage.value + 2);
  for (let index = start; index <= end; index++) {
    range.push(index);
  }
  return range;
});

//FUNCTIONS
const selectPage = async (no: number) => {
  offset.value = (no - 1) * 15;
  await customerStore.getCustomers(offset.value);
  currentPage.value = no;
};

const previousPage = async () => {
  if (currentPage.value > 1) {
    offset.value = offset.value - 15;
    await customerStore.getCustomers(offset.value);
    currentPage.value = currentPage.value - 1;
  }
};

const nextPage = async () => {
  if (currentPage.value < customersPageCount.value) {
    offset.value = offset.value + 15;
    await customerStore.getCustomers(offset.value);
    currentPage.value = currentPage.value + 1;
  }
};

const selCustomer = (customer: ICustomer) => {
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

const changeLoadingState = () => {
  loading.value = !loading.value;
};

const handleCompactMode = async (value: boolean) => {
  isCompactMode.value = value;
};

onMounted(async () => {
  await customerStore.getAllCustomers();
  await customerStore
    .getCustomers(offset.value)
    .then(async () => {
      detailedCustomers.value.forEach((element: Customers) => {
        if (element.customer_address !== "") {
          isHaveAddress.value = true;
        }
      });
    })
    .finally(() => {
      changeLoadingState();
    });

  window.addEventListener("resize", () => {
    width.value = document.documentElement.clientWidth;
  });
});
</script>

<style scoped>
@reference "@/index.css";

.create-btn-wrapper {
  @apply fixed bottom-14 right-2/4 translate-x-2/4 translate-y-2/4 sm:right-4 sm:bottom-3 sm:translate-x-0 sm:translate-y-0 z-50;
}

.create-btn {
  @apply w-16 h-16 rounded-full p-4;
}
</style>
