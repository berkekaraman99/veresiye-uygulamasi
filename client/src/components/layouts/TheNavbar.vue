<template>
  <header class="bg-[var(--navbar-color)] dark:bg-[var(--navbar-color)] text-[var(--text-light)] z-20 fixed top-0 w-[100%] h-[64px]">
    <div class="px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="flex items-center">
          <div class="inset-y-0 flex items-center" @click="emit('openSideNav')">
            <div class="rounded-md p-2 text-[var(--text-dark)] hover:bg-[var(--secondary)] transition ease-in-out duration-200">
              <UIcon name="heroicons:bars-3" class="block size-6 h-6 w-6 text-[var(--text-light)]" />
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
