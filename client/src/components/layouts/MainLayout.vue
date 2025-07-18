<script setup lang="ts">
import TheNavbar from "@/components/layouts/TheNavbar.vue";
import { ref, useTemplateRef, onMounted } from "vue";

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
  if (width.value <= 640) {
    openSideNavOverlay.value = !openSideNavOverlay.value;
  }
  if (width.value > 640) {
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
  { name: "Ana Sayfa", href: "home", icon: "fluent:home-24-filled" },
  { name: "Dashboard", href: "dashboard", icon: "fluent:glance-horizontal-24-filled" },
  { name: "Müşteriler", href: "customers", icon: "fluent:people-24-filled" },
  { name: "Müşteri Oluştur", href: "create-customer", icon: "fluent:person-add-24-filled" },
  { name: "Dekont Oluştur", href: "create-receipt", icon: "fluent:document-add-24-filled" },
  { name: "Rapor", href: "report", icon: "fluent:document-multiple-24-filled" },
  { name: "Arama", href: "search-customer", icon: "fluent:search-24-filled" },
];
</script>

<template>
  <div class="relative">
    <TheNavbar @open-side-nav="isNavOverlay()" />

    <div
      v-if="width > 640"
      id="SideNav"
      class="fixed z-0 transition-all duration-300 ease-in-out bg-[var(--sidebar-color)]/80 backdrop-blur-md ml-[6px] top-[72px] bottom-2 rounded-xl border-r border-b border-white dark:border-gray-600 shadow-lg"
      :style="{ width: openSideNav ? '240px' : '70px' }"
    >
      <ul class="w-full" :class="[!openSideNav ? 'p-2' : 'px-2 pb-2 pt-[7px]']">
        <RouterLink v-for="item in navigation" :key="item.name" :to="{ name: item.href }">
          <li
            class="flex items-center rounded-lg my-1.5 font-medium hover:bg-[var(--secondary)] text-[var(--text-light)] dark:text-[var(--text-light)] dark:hover:bg-[var(--primary-variant)]"
            :class="[openSideNav ? ' justify-start px-3' : ' justify-center ps-4']"
          >
            <div class="my-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg">
              <UIcon :name="item.icon" class="h-6 w-6" />
            </div>
            <div
              class="sidebar-item-text"
              :class="{
                'opacity-0 scale-0 w-0': !openSideNav,
                'opacity-100 scale-100 w-auto': openSideNav,
              }"
            >
              {{ item.name }}
            </div>
          </li>
        </RouterLink>
      </ul>
    </div>

    <div
      @click="openSideNavOverlay = false"
      class="bg-black/50 bg-opacity-70 fixed z-50 w-full h-screen"
      :class="openSideNavOverlay ? 'animate__animated animate__fadeIn animate__faster' : 'hidden z-[-1]'"
    ></div>

    <div
      id="SideNavOverlay"
      ref="sideNavOverlay"
      class="h-[100%] fixed z-50 bg-transparent backdrop-blur-lg border-r border-gray-200/30 w-[240px] animate__animated"
      :class="[openSideNavOverlay ? 'animate__slideInLeft animate__faster' : 'animate__slideOutLeft animate__faster']"
    >
      <div class="flex items-center mx-2 my-3">
        <button
          @click="isNavOverlay()"
          class="relative inline-flex items-center justify-center rounded-md p-2 text-[var(--text-light)] hover:bg-[var(--primary)] focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-white transition ease-in-out"
        >
          <UIcon name="heroicons:bars-3" class="block h-6 w-6" />
        </button>
        <div class="mx-2"></div>
        <RouterLink to="/" class="flex shrink-0 items-center font-semibold text-white">Veresiye</RouterLink>
      </div>

      <ul class="mt-4 w-full px-3 pb-2 pt-[7px]">
        <RouterLink v-for="item in navigation" :key="item.name" :to="{ name: item.href }">
          <li class="sidebar-item group">
            <div class="my-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
              <UIcon :name="item.icon" class="h-6 w-6 size-6 text-gray-600 group-hover:text-[var(--primary-variant)]" aria-hidden="true" />
            </div>
            <div class="font-semibold text-[14px] ms-4">{{ item.name }}</div>
          </li>
        </RouterLink>
      </ul>
    </div>

    <main
      class="w-[100%] h-[calc(100vh-64px)] absolute right-0 top-[64px] px-4 transition-all duration-300"
      :class="{ 'w-[calc(100%-76px)]': !openSideNav && width > 640, 'w-[calc(100%-240px)]': openSideNav, 'w-[100vw]': width < 639 }"
    >
      <div class="max-w-6xl mx-auto">
        <slot />
      </div>
    </main>
  </div>
</template>

<style lang="css" scoped>
@reference "@/index.css";

.sidebar-item {
  @apply flex items-center rounded-lg py-2 text-white font-medium hover:bg-[var(--primary)] px-3;
}

.sidebar-item-text {
  @apply font-semibold text-[14px] ms-4 text-nowrap overflow-hidden transition-all duration-300;
}
</style>
