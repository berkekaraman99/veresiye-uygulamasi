<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";
import { computed } from "vue";

const isDark = useDark();
const toggleDark = useToggle(isDark);

const themeText = computed(() => {
  return isDark.value ? "Koyu Tema" : "Açık Tema";
});
</script>

<template>
  <div @click="toggleDark()" class="theme-change-btn">
    <div class="flex items-center">
      <UIcon name="fluent:weather-moon-24-filled" class="w-6 size-6" v-if="isDark" />
      <UIcon name="fluent:weather-sunny-24-filled" class="w-6 size-6" v-else />
      <span class="ms-2 text-sm">{{ themeText }}</span>
    </div>
  </div>
</template>

<style scoped>
@reference "@/index.css";

.theme-change-btn {
  @apply p-2  rounded-lg cursor-pointer bg-[var(--light-color-mode)] hover:bg-[var(--secondary)];
}
</style>
