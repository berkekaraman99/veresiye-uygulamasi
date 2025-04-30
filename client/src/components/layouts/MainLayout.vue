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
  { name: "Müşteriler", href: "customers", icon: "heroicons:users-solid" },
  { name: "Müşteri Oluştur", href: "create-customer", icon: "heroicons:user-plus-solid" },
  { name: "Dekont Oluştur", href: "create-receipt", icon: "heroicons:document-plus-solid" },
  { name: "Rapor", href: "report", icon: "heroicons:document-duplicate-solid" },
  { name: "Arama", href: "search-customer", icon: "heroicons:magnifying-glass-solid" },
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
          <li
            class="flex items-center rounded-lg my-1.5 text-base font-medium hover:bg-[var(--secondary)] dark:hover:bg-[var(--primary-variant)]"
            :class="[!openSideNav ? 'p-0 justify-center' : 'px-3']"
          >
            <div class="my-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg">
              <UIcon :name="item.icon" class="h-6 w-6 text-white" />
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
          class="relative inline-flex items-center justify-center rounded-md p-2 text-[var(--text-dark)] dark:text-[var(--text-light)] hover:bg-[var(--primary)] focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-white transition ease-in-out"
        >
          <UIcon name="heroicons:bars-3" class="block h-6 w-6" />
        </button>
        <div class="mx-2"></div>
        <RouterLink to="/" class="flex shrink-0 items-center font-semibold text-white">Veresiye</RouterLink>
      </div>

      <ul class="mt-4 w-full px-3 pb-2 pt-[7px]">
        <RouterLink v-for="item in navigation" :key="item.name" :to="{ name: item.href }">
          <li class="group flex items-center rounded-lg py-2 text-base font-medium hover:bg-[var(--primary)] px-3">
            <div class="my-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
              <UIcon :name="item.icon" class="h-6 w-6 size-6 text-gray-600 group-hover:text-[var(--primary-variant)]" aria-hidden="true" />
            </div>
            <div class="font-semibold text-[var(--text-dark)] dark:text-[var(--text-light)] text-[14px] ms-4">{{ item.name }}</div>
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
