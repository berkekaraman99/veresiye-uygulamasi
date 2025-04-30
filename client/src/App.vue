<script setup lang="ts">
import { RouterView } from "vue-router";
import MainLayout from "@/components/layouts/MainLayout.vue";
</script>

<template>
  <UApp>
    <MainLayout>
      <RouterView v-slot="{ Component, route }">
        <Transition name="routeAnimation" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </MainLayout>
  </UApp>
</template>
