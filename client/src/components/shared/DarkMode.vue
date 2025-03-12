<script setup lang="ts">
import { SunIcon, MoonIcon } from "@heroicons/vue/20/solid";
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <div @click="toggleDark()" class="theme-change-btn">
    <div class="flex items-center" v-if="isDark">
      <MoonIcon class="w-6" />
      <span class="ms-2 text-sm">Dark Mode</span>
    </div>
    <div class="flex items-center" v-else>
      <SunIcon class="w-6" />
      <span class="ms-2 text-sm">Light Mode</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.theme-change-btn {
  @apply p-2 text-[var(--text-light)] rounded-lg cursor-pointer bg-[var(--light-color-mode)] hover:bg-[var(--secondary)];
}
</style>
