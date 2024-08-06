<script setup lang="ts">
import { RouterView } from "vue-router";
import TheHeader from "@/components/layouts/TheHeader.vue";
import TheSidebar from "./components/layouts/TheSidebar.vue";
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

<style></style>
