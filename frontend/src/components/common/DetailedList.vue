<script setup lang="ts">
import type { Customers } from "@/models/customers_model";
import { useRouter } from "vue-router";
import { useSortedRows } from "@/composables/useSortedRows";
import { toRef } from "vue";
import type { DropdownMenuItem } from "@nuxt/ui";

const props = defineProps({
  detailedCustomers: {
    type: Array<Customers>,
    default: [],
  },
  width: {
    type: Number,
    required: true,
  },
  isHaveAddress: {
    type: Boolean,
    default: false,
  },
});

const detailedCustomersRef = toRef(props, "detailedCustomers");

const { sortedRows, sortBy } = useSortedRows(detailedCustomersRef);
const emits = defineEmits(["removeCustomer"]);
const router = useRouter();

const menuItems = (customer: Customers): DropdownMenuItem[][] => [
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
      onSelect: () => emits("removeCustomer", customer),
    },
  ],
];
</script>

<template>
  <div>
    <table id="customersTable" class="mt-3">
      <thead
        class="text-xs bg-linear-to-r from-(--primary) to-(--primary) text-(--text-light) h-12"
      >
        <tr>
          <th scope="col" class="px-3 py-2" @click="sortBy('customer_name')">
            Müşteri
          </th>
          <th
            v-if="isHaveAddress"
            scope="col"
            class="px-3 py-2"
            @click="sortBy('customer_address')"
          >
            Müşteri Adresi
          </th>
          <th scope="col" class="px-3 py-2" @click="sortBy('created_at')">
            Oluşturulma Tarihi
          </th>
          <th scope="col" class="px-3 py-2" @click="sortBy('net_bakiye')">
            Net Bakiye
          </th>
          <th scope="col" class="px-3 py-2">İşlem</th>
        </tr>
      </thead>

      <tbody
        class="text-sm dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-950"
      >
        <tr v-for="customer in sortedRows" v-bind:key="customer.customer_id">
          <td class="px-3 py-2">{{ customer.customer_name }}</td>
          <td v-if="isHaveAddress" class="px-3 py-2">
            {{ customer.customer_address }}
          </td>
          <td class="px-3 py-2 text-center">
            {{ customer.created_at.slice(0, 10) }}
          </td>
          <td class="px-3 py-2 text-center">
            {{ customer.net_bakiye.toFixed(2) }} ₺
          </td>
          <td class="px-3 py-2 text-center">
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
                :label="width > 640 ? 'Seçenekler' : undefined"
                icon="fluent:chevron-down-32-filled"
                color="neutral"
                variant="outline"
              />
            </UDropdownMenu>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
@reference "@/index.css";

.paging-item {
  @apply relative cursor-pointer inline-flex items-center px-4 py-2 text-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:z-20 focus:outline-offset-0;
}
</style>
