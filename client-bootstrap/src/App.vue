<script setup lang="ts">
import { RouterView } from "vue-router";
import TheHeader from "@/components/layouts/TheHeader.vue";
</script>

<template>
  <TheHeader></TheHeader>
  <main class="container">
    <RouterView v-slot="{ Component, route }">
      <Transition name="routeAnimation" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </main>
</template>

<style></style>
