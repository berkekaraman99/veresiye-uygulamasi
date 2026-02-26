<template>
  <header class="text-(--text-light) dark:text-(--text-light) z-20 fixed top-0 left-0 right-0 sm:left-1.5 sm:right-1.5 sm:top-1 h-16">
    <nav class="px-2 shadow-lg sm:px-3.5 bg-linear-to-r from-(--primary) to-(--primary-variant) sm:rounded-xl">
      <div class="relative flex h-16 items-center justify-between">
        <div class="flex items-center">
          <div class="inset-y-0 flex items-center" @click="emit('openSideNav')">
            <div class="rounded-md p-2 hover:bg-(--secondary) transition ease-in-out duration-200">
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
    </nav>
  </header>
</template>

<script setup lang="ts">
import DarkMode from "@/components/shared/DarkMode.vue";

const emit = defineEmits(["openSideNav"]);
</script>
