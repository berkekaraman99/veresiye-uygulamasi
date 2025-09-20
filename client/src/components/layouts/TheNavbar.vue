<template>
  <header
    class="text-[var(--text-light)] dark:text-[var(--text-light)] z-20 fixed top-0 left-0 right-0 sm:left-[6px] sm:right-[6px] sm:top-1 h-[64px]"
  >
    <div class="px-2 shadow-lg sm:px-3.5 bg-[var(--navbar-color)]/80 backdrop-blur-md sm:rounded-xl">
      <div class="relative flex h-16 items-center justify-between">
        <div class="flex items-center">
          <div class="inset-y-0 flex items-center" @click="emit('openSideNav')">
            <div class="rounded-md p-2 hover:bg-[var(--secondary)] transition ease-in-out duration-200">
              <UIcon name="heroicons:bars-3" class="block size-6 h-6 w-6" />
            </div>
          </div>
          <div class="mx-2">
            <RouterLink to="/" class="flex shrink-0 items-center font-semibold">Veresiye</RouterLink>
          </div>
        </div>
        <div class="mx-2">
          <DarkMode />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import DarkMode from "@/components/shared/DarkMode.vue";

const emit = defineEmits(["openSideNav"]);
</script>

<style scoped></style>
