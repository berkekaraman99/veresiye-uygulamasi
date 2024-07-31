<template>
  <div class="row row-cols-1 row-cols-sm-1 row-cols-lg-2 py-5">
    <div class="col-6">
      <RouterLink :to="{ name: 'receivable' }">
        <div class="interactive-card">
          <h1>Alacak Ekle</h1>
          <div class="text-center"><DocumentPlusIcon class="w-50"></DocumentPlusIcon></div>
        </div>
      </RouterLink>
    </div>
    <div class="">
      <RouterLink :to="{ name: 'debt' }">
        <div class="interactive-card">
          <h1>Borç Ekle</h1>
          <div class="text-center"><DocumentMinusIcon class="w-50"></DocumentMinusIcon></div>
        </div>
      </RouterLink>
    </div>
    <div class="">
      <RouterLink :to="{ name: 'add-customer' }">
        <div class="interactive-card">
          <h1>Müşteri Ekle</h1>
          <!-- <div><i class="fa-solid fa-user-plus fa-6x"></i></div> -->
          <div class="text-center"><UserPlusIcon class="w-50"></UserPlusIcon></div>
        </div>
      </RouterLink>
    </div>
    <div class="">
      <RouterLink :to="{ name: 'report' }">
        <div class="interactive-card">
          <h1>Rapor Al</h1>
          <div class="text-center"><DocumentDuplicateIcon class="w-50"></DocumentDuplicateIcon></div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { UserPlusIcon, DocumentPlusIcon, DocumentMinusIcon, DocumentDuplicateIcon } from "@heroicons/vue/24/solid";
</script>

<style lang="scss" scoped>
.interactive-card {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0.5rem 0rem;
  cursor: pointer;
  background-color: lightgray;
  border-radius: 1rem;
  transition: 0.3s ease-in-out;

  &:hover {
    background-color: dimgray;
    color: whitesmoke;
  }
}
</style>
