<script setup lang="ts">
import { reactive } from "vue";
import { RouterLink } from "vue-router";
import { UserPlusIcon, DocumentPlusIcon, DocumentMinusIcon, DocumentDuplicateIcon } from "@heroicons/vue/24/solid";

const routerReceiptType = reactive({
  alacak: 1,
  borc: 0,
});
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12 md:col-span-6">
      <RouterLink :to="{ name: 'create-receipt', params: { receipt_type: routerReceiptType.alacak } }">
        <div class="interactive-card bg-gray-300 hover:bg-gray-400 rounded-lg">
          <h1 class="text-3xl font-semibold mb-4">Alacak Ekle</h1>
          <div><DocumentPlusIcon class="w-40" /></div>
        </div>
      </RouterLink>
    </div>
    <div class="col-span-12 md:col-span-6">
      <RouterLink :to="{ name: 'create-receipt', params: { receipt_type: routerReceiptType.borc } }">
        <div class="interactive-card bg-gray-300 hover:bg-gray-400 rounded-lg">
          <h1 class="text-3xl font-semibold mb-4">Borç Ekle</h1>
          <div><DocumentMinusIcon class="w-40" /></div>
        </div>
      </RouterLink>
    </div>
    <div class="col-span-12 md:col-span-6">
      <RouterLink :to="{ name: 'create-customer' }">
        <div class="interactive-card bg-gray-300 hover:bg-gray-400 rounded-lg">
          <h1 class="text-3xl font-semibold mb-4">Müşteri Ekle</h1>
          <div><UserPlusIcon class="w-40" /></div>
        </div>
      </RouterLink>
    </div>
    <div class="col-span-12 md:col-span-6">
      <RouterLink :to="{ name: 'report' }">
        <div class="interactive-card bg-gray-300 hover:bg-gray-400 rounded-lg">
          <h1 class="text-3xl font-semibold mb-4">Rapor Al</h1>
          <div><DocumentDuplicateIcon class="w-40" /></div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.interactive-card {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0.5rem 0rem;
  cursor: pointer;
}
</style>
