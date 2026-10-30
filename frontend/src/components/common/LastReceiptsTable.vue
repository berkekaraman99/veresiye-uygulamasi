<template>
  <div class="col-span-12 mb-4">
    <h3
      class="font-semibold text-xl mb-4 inline-block bg-white dark:bg-slate-900 dark:text-white px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-950"
    >
      Yeni Dekontlar
    </h3>
    <table>
      <thead
        class="text-xs bg-linear-to-r from-(--primary) to-(--primary) text-(--text-light) h-12"
      >
        <tr>
          <th scope="col" class="px-3 py-2">Müşteri Adı</th>
          <th scope="col" class="px-3 py-2">Dekont Türü</th>
          <th scope="col" class="px-3 py-2">Bakiye</th>
          <th scope="col" class="px-3 py-2">Oluşturulma Tarihi</th>
          <th scope="col" class="px-3 py-2"></th>
        </tr>
      </thead>

      <tbody
        class="text-sm dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-950"
      >
        <tr
          v-for="lastReceipt in lastReceipts"
          v-bind:key="lastReceipt.receipt_id"
        >
          <td class="px-3 py-2">{{ lastReceipt.customer_name }}</td>
          <td class="px-3 py-2 text-center">
            {{ reformatReceiptType(lastReceipt.receipt_type) }}
          </td>
          <td class="px-3 py-2 text-center">{{ lastReceipt.price }} ₺</td>
          <td class="px-3 py-2 text-center">
            {{ lastReceipt.created_at?.slice(0, 10) }}
          </td>
          <td class="px-3 py-2">
            <UDropdownMenu
              arrow
              :content="{
                align: 'end',
                side: 'bottom',
                sideOffset: 8,
              }"
              :items="menuItems(lastReceipt)"
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
import type { DashboardReceipt } from "@/models/dashboard_receipt_model";
import { reformatReceiptType } from "@/helpers/receipt_helper";
import { useRouter } from "vue-router";
import type { DropdownMenuItem } from "@nuxt/ui";

defineProps<{ lastReceipts: Array<DashboardReceipt> }>();
const emits = defineEmits(["askReceipt"]);
const router = useRouter();

const menuItems = (receipt: DashboardReceipt): DropdownMenuItem[][] => [
  [
    {
      label: "Dekont Bilgileri",
      icon: "fluent:receipt-32-regular",
      onSelect: () =>
        router.push({
          name: "receipt",
          params: { receipt_id: receipt.receipt_id },
        }),
    },
    {
      label: "Dekontu Güncelle",
      icon: "fluent:edit-32-filled",
      onSelect: () =>
        router.push({
          name: "edit-receipt",
          params: { receipt_id: receipt.receipt_id },
        }),
    },
  ],
  [
    {
      label: "Dekontu Sil",
      color: "error",
      icon: "fluent:channel-subtract-24-regular",
      onSelect: () => emits("askReceipt", receipt.receipt_id),
    },
  ],
];
</script>

<style scoped></style>
