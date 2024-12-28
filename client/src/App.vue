<template>
  <div class="relative">
    <TheNavbar @open-side-nav="() => (openSideNav = !openSideNav)"></TheNavbar>

    <div
      id="SideNav"
      class="h-[100%] fixed z-0 border-r border-r-[var(--primary)]"
      :class="!openSideNav ? 'w-[70px] bg-[var(--primary-variant)]' : 'w-[240px] bg-[var(--primary)]'"
    >
      <ul class="mt-[64px] w-full" :class="[!openSideNav ? 'p-2' : 'px-5 pb-2 pt-[7px]']">
        <RouterLink v-for="item in navigation" :key="item.name" :to="{ name: item.href }">
          <li
            class="group flex items-center rounded-lg py-2 text-base font-medium hover:bg-[var(--primary-variant)]"
            :class="[!openSideNav ? 'p-0 justify-center' : 'px-3']"
          >
            <div
              class="my-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg"
              :class="[!openSideNav ? 'group-hover:bg-white' : 'bg-gray-50 group-hover:bg-white']"
            >
              <component
                :is="item.icon"
                :class="[!openSideNav ? 'text-white group-hover:text-[var(--primary-variant)]' : 'text-gray-600']"
                class="h-6 w-6"
              />
            </div>
            <div v-if="openSideNav" class="font-semibold text-[var(--text-dark)] text-[14px] ms-4">{{ item.name }}</div>
          </li>
        </RouterLink>
      </ul>
    </div>

    <main
      class="w-[100%] h-[calc(100vh-64px)] absolute right-0 top-[64px] px-4"
      :class="{ 'w-[calc(100%-70px)]': !openSideNav, 'w-[calc(100%-240px)]': openSideNav }"
    >
      <div class="max-w-6xl mx-auto">
        <RouterView v-slot="{ Component, route }">
          <Transition name="routeAnimation" mode="out-in">
            <component :is="Component" :key="route.path" />
          </Transition>
        </RouterView>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import TheNavbar from "@/components/layouts/TheNavbar.vue";
import { DocumentDuplicateIcon, UsersIcon, UserPlusIcon, DocumentPlusIcon, MagnifyingGlassIcon } from "@heroicons/vue/24/solid";
import { ref } from "vue";

const openSideNav = ref(true);

const navigation = [
  { name: "Müşteriler", href: "customers", icon: UsersIcon },
  { name: "Müşteri Oluştur", href: "create-customer", icon: UserPlusIcon },
  { name: "Dekont Oluştur", href: "create-receipt", icon: DocumentPlusIcon },
  { name: "Rapor", href: "report", icon: DocumentDuplicateIcon },
  { name: "Arama", href: "search-customer", icon: MagnifyingGlassIcon },
];
</script>

<style lang="scss">
#app {
  min-height: 100vh;
}
</style>
