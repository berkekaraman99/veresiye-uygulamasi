<template>
  <div>
    <h1 class="font-semibold text-4xl mb-8 inline-block bg-white px-4 py-2 rounded-lg border-2 border-slate-200">Hızlı İşlemler</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <RouterLink v-for="item in items" :key="item.name" class="col" :to="item.href">
        <div class="interactive-card border-2 bg-slate-50 text-[var(--primary-variant)] hover:text-[var(--primary)] hover:bg-white text-2xl">
          <h1 class="mb-0 md:mb-4">{{ item.name }}</h1>
          <div class="text-center">
            <component :is="item.component" class="action-icon" />
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { RouterLink } from "vue-router";
import { UserPlusIcon, DocumentPlusIcon, UsersIcon, MagnifyingGlassIcon, DocumentMinusIcon, DocumentDuplicateIcon } from "@heroicons/vue/24/solid";

const routerReceiptType = reactive({
  alacak: 1,
  borc: 0,
});

const items = [
  { name: "Alacak Ekle", href: { name: "create-receipt", params: { receipt_type: routerReceiptType.alacak } }, component: DocumentPlusIcon },
  { name: "Ödeme Ekle", href: { name: "create-receipt", params: { receipt_type: routerReceiptType.borc } }, component: DocumentMinusIcon },
  { name: "Müşteri Ekle", href: { name: "create-customer" }, component: UserPlusIcon },
  { name: "Müşteriler", href: { name: "customers" }, component: UsersIcon },
  { name: "Rapor Al", href: { name: "report" }, component: DocumentDuplicateIcon },
  { name: "Müşteri Arama", href: { name: "search-customer" }, component: MagnifyingGlassIcon },
];
</script>

<style scoped lang="scss">
.action-icon {
  @apply w-16 me-3 md:w-32 lg:w-40;
  // & {
  //     @media only screen and (max-width: 768px) {
  //         @apply w-16 me-3;
  //     }

  //     @media only screen and (min-width: 768px) {
  //         @apply w-40 me-3;
  //     }
  // }
}
</style>
