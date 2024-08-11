<script setup lang="ts">
import { RouterView } from "vue-router";
import TheHeader from "@/components/layouts/TheHeader.vue";
import TheSidebar from "./components/layouts/TheSidebar.vue";
import { onMounted, watchEffect } from "vue";

// let body: HTMLBodyElement | null;

// window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ({ matches }) => {
//   if (matches) {
//     body?.setAttribute("data-bs-theme", "dark");
//   } else {
//     body?.setAttribute("data-bs-theme", "light");
//   }
// });

// watchEffect(() => {
//   if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
//     body?.setAttribute("data-bs-theme", "dark");
//   } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
//     body?.setAttribute("data-bs-theme", "light");
//   }
// });

// onMounted(() => {
//   body = document.querySelector("body");
// });
</script>

<template>
  <TheHeader></TheHeader>
  <TheSidebar></TheSidebar>
  <main class="container">
    <RouterView v-slot="{ Component, route }">
      <Transition name="routeAnimation" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </main>
</template>

<style scoped></style>
