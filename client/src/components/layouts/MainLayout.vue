<script setup lang="ts">
import { RouterView } from "vue-router";
import TheNavbar from "@/components/layouts/TheNavbar.vue";
import { DocumentDuplicateIcon, UsersIcon, UserPlusIcon, DocumentPlusIcon, MagnifyingGlassIcon } from "@heroicons/vue/24/solid";
import { ref, useTemplateRef, onMounted } from "vue";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";

const openSideNav = ref(true);
const openSideNavOverlay = ref(false);
const width = ref(document.documentElement.clientWidth);
const sideNavOverlay = useTemplateRef("sideNavOverlay");

onMounted(() => {
  resize();
  sideNavOverlay.value!.classList.add("hidden");
  window.addEventListener("resize", () => {
    width.value = document.documentElement.clientWidth;
    resize();
  });
});

const isNavOverlay = () => {
  if (width.value < 640) {
    openSideNavOverlay.value = !openSideNavOverlay.value;
  }
  if (width.value >= 640) {
    openSideNav.value = !openSideNav.value;
  }
};

const resize = () => {
  if (width.value < 1280 && openSideNav.value) {
    openSideNav.value = false;
  }
  if (width.value > 1279 && !openSideNav.value) {
    openSideNav.value = true;
  }
};

const navigation = [
  { name: "Müşteriler", href: "customers", icon: UsersIcon },
  { name: "Müşteri Oluştur", href: "create-customer", icon: UserPlusIcon },
  { name: "Dekont Oluştur", href: "create-receipt", icon: DocumentPlusIcon },
  { name: "Rapor", href: "report", icon: DocumentDuplicateIcon },
  { name: "Arama", href: "search-customer", icon: MagnifyingGlassIcon },
];
</script>

<template>
  <div class="relative">
    <TheNavbar @open-side-nav="isNavOverlay()" />

    <div
      v-if="width > 639"
      id="SideNav"
      class="h-[100%] fixed z-0 bg-[var(--sidebar-color)] border-r border-r-[var(--secondary-variant)]"
      :class="!openSideNav ? 'w-[70px]' : 'w-[240px]'"
    >
      <ul class="mt-[64px] w-full" :class="[!openSideNav ? 'p-2' : 'px-2 pb-2 pt-[7px]']">
        <RouterLink v-for="item in navigation" :key="item.name" :to="{ name: item.href }">
          <li class="group flex items-center rounded-lg py-2 text-base font-medium" :class="[!openSideNav ? 'p-0 justify-center' : 'px-3']">
            <div
              class="my-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg"
              :class="[!openSideNav ? 'group-hover:bg-white' : 'bg-gray-50 group-hover:bg-white']"
            >
              <component
                :is="item.icon"
                :class="[!openSideNav ? 'text-white group-hover:text-[var(--secondary)]' : 'text-gray-600']"
                class="h-6 w-6"
              />
            </div>
            <div v-if="openSideNav" class="font-semibold text-[var(--text-light)] text-[14px] ms-4">{{ item.name }}</div>
          </li>
        </RouterLink>
      </ul>
    </div>

    <div
      @click="openSideNavOverlay = false"
      class="bg-black bg-opacity-70 fixed z-50 w-full h-screen"
      :class="openSideNavOverlay ? 'animate__animated animate__fadeIn animate__faster' : 'hidden z-[-1]'"
    ></div>

    <div
      id="SideNavOverlay"
      ref="sideNavOverlay"
      class="h-[100%] fixed z-50 bg-[var(--primary-variant)] w-[240px] animate__animated"
      :class="[openSideNavOverlay ? 'animate__slideInLeft animate__faster' : 'animate__slideOutLeft animate__faster']"
    >
      <div class="flex items-center mx-2 my-3">
        <button
          @click="isNavOverlay()"
          class="relative inline-flex items-center justify-center rounded-md p-2 text-[var(--text-dark)] hover:bg-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition ease-in-out"
        >
          <Bars3Icon class="block h-6 w-6" />
        </button>
        <div class="mx-2"></div>
        <RouterLink to="/" class="flex flex-shrink-0 items-center font-semibold text-white">Veresiye</RouterLink>
      </div>

      <ul class="mt-4 w-full px-3 pb-2 pt-[7px]">
        <RouterLink v-for="item in navigation" :key="item.name" :to="{ name: item.href }">
          <li class="group flex items-center rounded-lg py-2 text-base font-medium hover:bg-[var(--primary)] px-3">
            <div class="my-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
              <component :is="item.icon" class="h-6 w-6 text-gray-600" />
            </div>
            <div class="font-semibold text-[var(--text-dark)] text-[14px] ms-4">{{ item.name }}</div>
          </li>
        </RouterLink>
      </ul>
    </div>

    <main
      class="w-[100%] h-[calc(100vh-64px)] absolute right-0 top-[64px] px-4"
      :class="{ 'w-[calc(100%-70px)]': !openSideNav && width > 640, 'w-[calc(100%-240px)]': openSideNav, 'w-[100vw]': width < 639 }"
    >
      <div class="max-w-6xl mx-auto">
        <slot />
      </div>
    </main>
  </div>
</template>

<style lang="scss">
#app {
  min-height: 100vh;
}

html.dark {
  color-scheme: dark;
}
</style>
