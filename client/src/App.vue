<template>
  <TheNavbar></TheNavbar>
  <main class="container max-w-6xl px-4">
    <RouterView v-slot="{ Component, route }">
      <Transition name="routeAnimation" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </main>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import TheNavbar from "@/components/layouts/TheNavbar.vue";
</script>

<style lang="scss">
#app {
  min-height: 100vh;
}
</style>
