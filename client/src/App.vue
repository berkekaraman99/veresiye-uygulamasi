<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
// import TheHeader from "./components/layouts/TheHeader.vue";
import TheHeader from "./components/layouts/TheHeader.vue";
</script>

<template>
  <!-- <TheHeader></TheHeader> -->
  <TheHeader></TheHeader>
  <main class="container px-2 sm:px-4">
    <RouterView v-slot="{ Component, route }">
      <Transition name="routeAnimation" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </main>
</template>

<style></style>
