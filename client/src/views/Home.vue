<template>
  <div>
    <h1
      class="font-semibold text-4xl mb-8 inline-block bg-white dark:bg-slate-900 dark:text-white px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-950"
    >
      Hızlı İşlemler
    </h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <RouterLink v-for="item in items" :key="item.name" class="col" :to="item.href">
        <div class="interactive-card">
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

<style scoped>
@reference "@/index.css";

.action-icon {
  @apply w-16 me-3 md:w-32 lg:w-40;
}

.interactive-card {
  @apply cursor-pointer flex border-2 border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800 text-[var(--secondary)] hover:text-[var(--primary)] text-2xl;

  margin: 0.5rem 0rem;
  transition: 0.3s ease;
  border-radius: 1rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.interactive-card:hover {
  transform: translateY(-8px);
  box-shadow: 0px 4px 1rem -6px black;
}

.interactive-card:active {
  transform: scale(95%);
}

@media screen and (max-width: 768px) {
  .interactive-card {
    align-items: center;
    justify-content: flex-end;
    flex-direction: row-reverse;
    height: 100px;
    padding: 1rem 1.25rem;
  }
}

@media screen and (min-width: 768px) {
  .interactive-card {
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 320px;
  }
}
</style>
