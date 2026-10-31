<template>
  <div class="col-span-12 lg:col-span-6">
    <h3
      class="font-semibold text-xl mb-4 inline-block bg-white dark:bg-slate-900 dark:text-white px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-950"
    >
      Yeni Müşteriler
    </h3>
    <table>
      <thead
        class="text-xs bg-linear-to-r from-(--primary) to-(--primary) text-(--text-light) h-12"
      >
        <tr>
          <th scope="col" class="px-3 py-2">Müşteri Adı</th>
          <th scope="col" class="px-3 py-2">Net Bakiye</th>
          <th scope="col" class="px-3 py-2">Oluşturulma Tarihi</th>
          <th scope="col" class="px-3 py-2"></th>
        </tr>
      </thead>

      <tbody
        class="text-sm dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-950"
      >
        <tr
          v-for="lastCustomer in lastCustomers"
          v-bind:key="lastCustomer.customer_id"
        >
          <td class="px-3 py-2">{{ lastCustomer.customer_name }}</td>
          <td class="px-3 py-2 text-center">{{ lastCustomer.net_bakiye }} ₺</td>
          <td class="px-3 py-2 text-center">
            {{ lastCustomer.created_at?.slice(0, 10) }}
          </td>
          <td class="px-3 py-2 text-center">
            <UDropdownMenu
              :modal="false"
              arrow
              :content="{
                align: 'end',
                side: 'bottom',
                sideOffset: 8,
              }"
              :items="menuItems(lastCustomer)"
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
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { DashboardCustomer } from "@/models/dashboard_customer_model";
import type { DropdownMenuItem } from "@nuxt/ui";
import { useRouter } from "vue-router";

defineProps<{ lastCustomers: Array<DashboardCustomer> }>();
const emits = defineEmits(["askCustomer"]);

const router = useRouter();

const menuItems = (customer: DashboardCustomer): DropdownMenuItem[][] => [
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
      onSelect: () => emits("askCustomer", customer),
    },
  ],
];
</script>

<style scoped></style>
