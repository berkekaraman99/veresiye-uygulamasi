<template>
  <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="offcanvasExampleLabel">Veresiye</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <RouterLink v-for="item in products" v-bind:key="item.name" :to="{ name: item.href }" class="text-body w-100 h-100"
        ><div class="my-2 sidebar-item">
          <component :is="item.icon" class="icon" /> <span>{{ item.name }}</span>
        </div></RouterLink
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { DocumentDuplicateIcon, UsersIcon, UserPlusIcon, DocumentPlusIcon, HomeIcon } from "@heroicons/vue/24/solid";
import { RouterLink } from "vue-router";

const products = [
  { name: "Anasayfa", href: "home", icon: HomeIcon },
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

.sidebar-item {
  transition: 0.3s ease;
  padding: 0.6rem 0.75rem;
  border-radius: 1rem;
  &:hover {
    // background-color: lightgrey;
    box-shadow: 0px 5px 1rem -6px black;
    transform: scale(1.01) translateY(-5px);
  }
}

.offcanvas {
  padding-right: 0.5rem;
  width: 336px;
}
</style>
