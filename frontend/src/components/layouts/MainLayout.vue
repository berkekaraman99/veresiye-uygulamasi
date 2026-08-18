<script setup lang="ts">
import TheNavbar from "@/components/layouts/TheNavbar.vue";
import { ref, onMounted } from "vue";

const openSideNav = ref(true);
const openSideNavOverlay = ref(false);
const width = ref(document.documentElement.clientWidth);

onMounted(() => {
  resize();
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
</script>

<template>
  <div class="relative">
    <TheNavbar @open-side-nav="isNavOverlay" />

    <TheSidebar @open-side-nav-or-overlay="isNavOverlay" :width="width" :open-side-nav="openSideNav" :open-side-nav-overlay="openSideNavOverlay" />

    <main
      class="h-[calc(100vh-64px)] absolute right-0 top-16 px-4 transition-all duration-300 flex flex-col justify-between"
      :class="{ 'w-[calc(100%-76px)]': !openSideNav && width > 640, 'w-[calc(100%-240px)]': openSideNav, 'w-screen': width < 639 }"
    >
      <div class="max-w-6xl mx-auto w-full">
        <slot />
      </div>
      <TheFooter />
    </main>
  </div>
</template>
