<template>
  <nav class="navbar navbar-expand-md bg-body-secondary mb-3 px-0 px-md-3">
    <div class="container-lg bg-body-tertiary py-2 rounded-4 shadow-sm">
      <a class="text-body d-block d-md-none" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample"
        ><Bars3Icon class="bars"></Bars3Icon
      ></a>
      <RouterLink :to="{ name: 'home' }">
        <span class="mx-3 text-body fw-bold text-lg">Veresiye</span>
      </RouterLink>
      <div class="d-none d-md-block">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <li class="nav-item">
            <RouterLink :to="{ name: 'home' }" class="nav-link">Ana Sayfa</RouterLink>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"> İşlemler </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li v-for="item in products" v-bind:key="item.name">
                <RouterLink :to="{ name: item.href }" class="dropdown-item" href="#"
                  ><component :is="item.icon" class="icon" /> <span>{{ item.name }}</span></RouterLink
                >
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { DocumentDuplicateIcon, Bars3Icon, UsersIcon, UserPlusIcon, DocumentPlusIcon } from "@heroicons/vue/24/solid";
import { RouterLink } from "vue-router";

const products = [
  { name: "Müşteriler", href: "customers", icon: UsersIcon },
  { name: "Müşteri Oluştur", href: "create-customer", icon: UserPlusIcon },
  { name: "Dekont Oluştur", href: "create-receipt", icon: DocumentPlusIcon },
  { name: "Rapor", href: "report", icon: DocumentDuplicateIcon },
];
</script>

<style scoped lang="scss">
.icon {
  width: 24px;
}

.bars {
  width: 40px;
  padding: 4px;
  cursor: pointer;
  transition: 0.3s ease;
  border-radius: 1rem;

  &:hover {
    background-color: lightgray;
  }
}

.router-link-active,
.router-link-exact-active {
  transition: 0.3s ease;
  font-weight: bold;
}
</style>
