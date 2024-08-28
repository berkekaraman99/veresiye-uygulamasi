<template>
  <div>
    <h1 class="fw-bold ps-2 mb-3">Hızlı İşlemler</h1>
    <div class="row gy-2 row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4">
      <RouterLink v-for="item in items" :key="item.name" class="col" :to="item.href">
        <div class="interactive-card bg-body text-body">
          <h1 class="mb-0 mb-md-4">{{ item.name }}</h1>
          <div class="text-center"><component :is="item.component" class="action-icon" /></div>
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
  { name: "Borç Ekle", href: { name: "create-receipt", params: { receipt_type: routerReceiptType.borc } }, component: DocumentMinusIcon },
  { name: "Müşteri Ekle", href: { name: "create-customer" }, component: UserPlusIcon },
  { name: "Müşteriler", href: { name: "customers" }, component: UsersIcon },
  { name: "Rapor Al", href: { name: "report" }, component: DocumentDuplicateIcon },
  { name: "Müşteri Arama", href: { name: "search-customer" }, component: MagnifyingGlassIcon },
];
</script>

<style scoped lang="scss">
.action-icon {
  & {
    @media only screen and (max-width: 768px) {
      width: 4rem;
      margin-right: 0.75rem;
    }
    @media only screen and (min-width: 768px) {
      width: 10rem;
      margin-right: 0.75rem;
    }
  }
}
</style>
