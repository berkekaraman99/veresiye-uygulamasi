<template>
  <div class="min-h-screen min-w-full bg-slate-50">
    <TheNavbar></TheNavbar>

    <main class="container max-w-6xl px-4">
      <RouterView v-slot="{ Component, route }">
        <Transition name="routeAnimation" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>
  </div>
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
