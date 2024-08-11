<script setup lang="ts">
import { reactive } from "vue";
import { RouterLink } from "vue-router";
import { UserPlusIcon, DocumentPlusIcon, UsersIcon, DocumentMinusIcon, DocumentDuplicateIcon } from "@heroicons/vue/24/solid";

const routerReceiptType = reactive({
  alacak: 1,
  borc: 0,
});
</script>

<template>
  <div>
    <h1 class="fw-bold ps-2 mb-3">Hızlı İşlemler</h1>
    <div class="row gy-2 row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4">
      <RouterLink class="col" :to="{ name: 'create-receipt', params: { receipt_type: routerReceiptType.alacak } }">
        <div class="interactive-card bg-body text-body">
          <h1 class="mb-0 mb-md-4">Alacak Ekle</h1>
          <div class="text-center"><DocumentPlusIcon class="action-icon" /></div>
        </div>
      </RouterLink>
      <RouterLink class="col" :to="{ name: 'create-receipt', params: { receipt_type: routerReceiptType.borc } }">
        <div class="interactive-card bg-body text-body">
          <h1 class="mb-0 mb-md-4">Borç Ekle</h1>
          <div class="text-center"><DocumentMinusIcon class="action-icon" /></div>
        </div>
      </RouterLink>
      <RouterLink class="col" :to="{ name: 'create-customer' }">
        <div class="interactive-card bg-body text-body">
          <h1 class="mb-0 mb-md-4">Müşteri Ekle</h1>
          <div class="text-center"><UserPlusIcon class="action-icon" /></div>
        </div>
      </RouterLink>
      <RouterLink class="col" :to="{ name: 'customers' }">
        <div class="interactive-card bg-body text-body">
          <h1 class="mb-0 mb-md-4">Müşteriler</h1>
          <div class="text-center"><UsersIcon class="action-icon" /></div>
        </div>
      </RouterLink>
      <RouterLink class="col" :to="{ name: 'report' }">
        <div class="interactive-card bg-body text-body">
          <h1 class="mb-0 mb-md-4">Rapor Al</h1>
          <div class="text-center"><DocumentDuplicateIcon class="action-icon" /></div>
        </div>
      </RouterLink>
    </div>
    <!-- Button trigger modal -->
    <!-- <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Launch demo modal</button> -->
  </div>
</template>

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
