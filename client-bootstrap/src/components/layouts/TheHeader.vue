<template>
  <nav class="navbar navbar-expand-md bg-body-tertiary">
    <div class="container-fluid">
      <RouterLink :to="{ name: 'home' }" class="navbar-brand">Veresiye</RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <li class="nav-item">
            <RouterLink :to="{ name: 'home' }" class="nav-link">Ana Sayfa</RouterLink>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false"> İşlemler </a>
            <ul class="dropdown-menu">
              <li>
                <RouterLink :to="{ name: 'customers' }" class="dropdown-item"><UsersIcon></UsersIcon> Müşteriler</RouterLink>
              </li>
              <li>
                <RouterLink :to="{ name: 'add-customer' }" class="dropdown-item"><UserPlusIcon></UserPlusIcon> Müşteri Ekle</RouterLink>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <RouterLink :to="{ name: 'receivable' }" class="dropdown-item"><DocumentPlusIcon></DocumentPlusIcon> Alacak Ekle</RouterLink>
              </li>
              <li>
                <RouterLink :to="{ name: 'debt' }" class="dropdown-item"><DocumentMinusIcon></DocumentMinusIcon> Borç Ekle</RouterLink>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <RouterLink :to="{ name: 'report' }" class="dropdown-item"><DocumentDuplicateIcon></DocumentDuplicateIcon> Rapor</RouterLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { UsersIcon, UserPlusIcon, DocumentPlusIcon, DocumentMinusIcon, DocumentDuplicateIcon } from "@heroicons/vue/24/solid";
import { RouterLink } from "vue-router";

const mobileMenuOpen = ref(false);
</script>

<style scoped>
svg {
  height: 24px;
}
</style>
