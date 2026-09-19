<template>
  <div>
    <page-header heading-text="Hızlı İşlemler" />
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <RouterLink
        v-for="item in items"
        :key="item.name"
        class="col"
        :to="item.href"
      >
        <div class="interactive-card">
          <h1 class="mb-0 md:mb-4">{{ item.name }}</h1>
          <div class="text-center">
            <UIcon :name="item.component" class="action-icon" />
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { RouterLink } from "vue-router";

const routerReceiptType = reactive({
  alacak: 1,
  borc: 0,
});

const items = [
  {
    name: "Dashboard",
    href: { name: "dashboard" },
    component: "fluent:glance-horizontal-24-filled",
  },
  {
    name: "Alacak Ekle",
    href: {
      name: "create-receipt",
      params: { receipt_type: routerReceiptType.alacak },
    },
    component: "fluent:document-add-24-filled",
  },
  {
    name: "Ödeme Ekle",
    href: {
      name: "create-receipt",
      params: { receipt_type: routerReceiptType.borc },
    },
    component: "fluent:document-dismiss-24-filled",
  },
  {
    name: "Müşteri Ekle",
    href: { name: "create-customer" },
    component: "fluent:person-add-24-filled",
  },
  {
    name: "Müşteriler",
    href: { name: "customers" },
    component: "fluent:people-24-filled",
  },
  {
    name: "Rapor Al",
    href: { name: "report" },
    component: "fluent:document-multiple-24-filled",
  },
  {
    name: "Müşteri Arama",
    href: { name: "search-customer" },
    component: "fluent:search-24-filled",
  },
];
</script>

<style scoped>
@reference "@/index.css";

.action-icon {
  @apply w-16 me-3 md:w-32 lg:w-40 size-40;
}

.interactive-card {
  @apply cursor-pointer border transition rounded-2xl shadow ease-in-out duration-200 flex my-2 border-slate-200 dark:border-slate-950 bg-white dark:bg-slate-900  text-(--text-dark) dark:text-(--text-light) text-2xl;
}

.interactive-card:hover {
  @apply -translate-y-2 shadow-xl bg-slate-50 dark:bg-slate-800;
}

.interactive-card:active {
  @apply transform scale-95 bg-white;
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
