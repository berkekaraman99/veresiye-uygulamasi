<template>
  <div class="grid grid-cols-12">
    <div class="col-span-12 md:col-start-2 md:col-span-10 relative">
      <page-header heading-text="Müşteriler" />

      <div class="flex items-center justify-center-safe">
        <div class="customers-toggle">
          <h3
            :class="[
              isCompactMode
                ? 'bg-white shadow dark:bg-slate-900 font-bold'
                : null,
            ]"
            class="px-2 py-2 me-1 text-sm rounded-lg cursor-pointer ease-in-out transition-all duration-200"
            @click="handleCompactMode(true)"
          >
            Kompakt Görünüm
          </h3>
          <h3
            :class="[
              !isCompactMode
                ? 'bg-white shadow dark:bg-slate-900 font-bold'
                : null,
            ]"
            class="px-2 py-2 ms-1 text-sm rounded-lg cursor-pointer ease-in-out transition-all duration-200"
            @click="handleCompactMode(false)"
          >
            Detaylı Görünüm
          </h3>
        </div>
      </div>

      <RouterLink
        v-if="!pageLoading"
        class="create-btn-wrapper"
        :to="{ name: 'create-customer' }"
      >
        <div class="create-btn">
          <UIcon name="heroicons:user-plus-16-solid" class="size-8" />
        </div>
      </RouterLink>
      <the-loading v-if="pageLoading"></the-loading>

      <Transition name="fade" mode="out-in">
        <CompactList
          v-if="isCompactMode && !pageLoading"
          :width="width"
          :compact-customers="compactCustomers"
          @remove-customer="ask"
        />
        <DetailedList
          v-else-if="!isCompactMode && !pageLoading"
          :is-have-address="isHaveAddress"
          :width="width"
          :detailed-customers="detailedCustomers"
          @remove-customer="ask"
        />
      </Transition>
      <Transition name="fade" mode="out-in">
        <AppPagination
          v-if="!isCompactMode && !pageLoading"
          v-model:page="currentPage"
          :page-count="customersPageCount"
          :page-size="PAGE_SIZE"
        />
      </Transition>
    </div>

    <ConfirmDeleteModal
      v-model="open"
      :message="`'${selectedCustomer?.customer_name}' adlı müşteriyi silmek istediğinizden emin misiniz?`"
      :loading="deleting"
      @confirm="confirm"
    />
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import { storeToRefs } from "pinia";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import { useAppToast } from "@/composables/useAppToast";

import type { ICustomer } from "@/models/customer_model";
import type { Customers } from "@/models/customers_model";
import { useConfirmDelete } from "@/composables/useConfirmDelete";

//STATES
const { toastSuccess, toastError } = useAppToast();
const customerStore = useCustomerStore();
const isHaveAddress = ref(false);
const { compactCustomers, detailedCustomers, customersPageCount } =
  storeToRefs(customerStore);

const PAGE_SIZE = 15;
const currentPage = ref<number>(1);
const width = ref(document.documentElement.clientWidth);
const isCompactMode = ref(true);
const pageLoading = ref(false);

const {
  open,
  item: selectedCustomer,
  loading: deleting,
  ask,
  confirm,
} = useConfirmDelete<ICustomer>(async (customer) => {
  try {
    await customerStore.deleteCustomer(customer.customer_id);
    toastSuccess({ title: "Müşteri başarıyla silindi!" });
    await Promise.all([customerStore.getCustomers(), loadCustomers()]);
    if (currentPage.value > customersPageCount.value) {
      currentPage.value = Math.max(1, customersPageCount.value);
    }
  } catch {
    toastError({ title: "Müşteri silinemedi" });
  }
});

//FUNCTIONS
const loadCustomers = async () =>
  await customerStore.getCustomers((currentPage.value - 1) * PAGE_SIZE);

watch(currentPage, loadCustomers);

const changePageLoadingState = () => {
  pageLoading.value = !pageLoading.value;
};

const handleCompactMode = async (value: boolean) => {
  isCompactMode.value = value;
};

const resizeFunc = () => {
  width.value = document.documentElement.clientWidth;
};

onMounted(async () => {
  window.addEventListener("resize", resizeFunc);

  try {
    changePageLoadingState();
    await customerStore.getAllCustomers();
    await loadCustomers().then(async () => {
      detailedCustomers.value.forEach((element: Customers) => {
        if (element.customer_address !== "") {
          isHaveAddress.value = true;
        }
      });
    });
  } catch (error) {
    toastError({ title: "Sayfa yüklenirken bir hata oluştu." });
    console.error(error);
  } finally {
    changePageLoadingState();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeFunc);
});
</script>

<style scoped>
@reference "@/index.css";

.create-btn-wrapper {
  @apply fixed bottom-14 right-2/4 translate-x-2/4 translate-y-2/4 sm:right-6 sm:bottom-8 sm:translate-x-0 sm:translate-y-0 z-50;
}

.create-btn {
  @apply w-14 h-14 rounded-full transition duration-300 hover:scale-110  ease-in-out p-3 flex items-center justify-center backdrop-blur-lg bg-(--secondary) hover:bg-(--secondary)/85  text-white;
}

.customers-toggle {
  @apply flex items-center bg-white dark:bg-slate-900 rounded-xl px-2 py-2;
}
</style>
