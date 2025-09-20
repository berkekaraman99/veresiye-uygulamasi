<script setup lang="ts">
import type { Customers } from "@/models/customers_model";
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  compactCustomers: {
    type: Array<Customers>,
    default: [],
  },
  width: {
    type: Number,
    required: true,
  },
});

const emits = defineEmits(["removeCustomer", "selectCustomer"]);

const router = useRouter();
const visibleCustomers = ref<Array<Customers>>([]);
const page = ref(1);
const chunk = 50;
const loadMoreRef = useTemplateRef("loadMoreRef");
let observer: IntersectionObserver | undefined;
const showLoadingText = ref(true);

const loadMoreItems = () => {
  const start = (page.value - 1) * chunk;
  const end = page.value * chunk;
  const customers = props.compactCustomers.slice(start, end);
  if (customers.length === 0) {
    showLoadingText.value = false;
  }
  visibleCustomers.value.push(...customers);
  page.value++;
};

onMounted(() => {
  loadMoreItems();
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadMoreItems();
    }
  });
  if (loadMoreRef.value) {
    observer.observe(loadMoreRef.value);
  }
});

onBeforeUnmount(() => {
  if (observer && loadMoreRef.value) {
    observer.unobserve(loadMoreRef.value);
  }
});
</script>

<template>
  <div
    class="flex items-center justify-between bg-linear-to-r from-[var(--primary-variant)] to-[var(--primary)] text-[var(--text-light)] py-3 px-4 mt-3 rounded-t-xl text-xs"
  >
    <div class="font-bold">Müşteri Adı</div>
    <div class="font-bold">İşlemler</div>
  </div>
  <ul class="bg-white dark:bg-slate-900 mb-3 rounded-b-xl h-[600px] overflow-y-auto">
    <li v-for="customer in visibleCustomers" class="flex items-center justify-between text-sm py-2 px-4 hover:bg-slate-200 dark:hover:bg-slate-800">
      <div>
        {{ customer.customer_name }}
      </div>
      <div>
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
              {
                label: `${customer.net_bakiye} ₺`,
                icon: 'fluent:money-24-filled',
                disabled: true,
              },
            ],
            [
              {
                label: 'Müşteriyi Sil',
                color: 'error',
                icon: 'fluent:person-subtract-24-regular',
                onSelect() {
                  emits('selectCustomer', customer);
                },
              },
            ],
          ]"
          :ui="{
            content: 'w-48 bg-transparent backdrop-blur-md',
          }"
        >
          <UButton :label="width > 640 ? 'Seçenekler' : undefined" icon="fluent:chevron-down-32-filled" color="neutral" variant="outline" />
        </UDropdownMenu>
      </div>
    </li>
    <div v-if="showLoadingText" ref="loadMoreRef" class="text-center py-4 text-gray-500">Yükleniyor...</div>
  </ul>
</template>

<style scoped></style>
