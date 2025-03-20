<script setup lang="ts">
import { RouterView } from "vue-router";
import MainLayout from "@/components/layouts/MainLayout.vue";
</script>

<template>
  <MainLayout>
    <RouterView v-slot="{ Component, route }">
      <Transition name="routeAnimation" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </MainLayout>
</template>

<style lang="css">
@reference "@/index.css";
</style>
