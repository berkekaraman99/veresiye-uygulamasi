<template>
  <header class="navbar">
    <nav class="inner-navbar">
      <div class="relative flex h-16 items-center justify-between">
        <div class="flex items-center">
          <div class="inset-y-0 flex items-center" @click="emit('openSideNav')">
            <div
              class="rounded-md p-2 hover:bg-(--secondary) transition ease-in-out duration-200"
            >
              <UIcon name="heroicons:bars-3" class="block size-6 h-6 w-6" />
            </div>
          </div>
          <div class="mx-2">
            <RouterLink to="/" class="navbar-brand">Veresiye</RouterLink>
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

<style scoped>
@reference "@/index.css";

.navbar {
  @apply text-(--text-dark) dark:text-(--text-light) z-20 fixed top-0 left-0 right-0 h-16;
}

.inner-navbar {
  @apply px-2 shadow-lg sm:px-3.5 bg-white dark:bg-slate-950;
}

.navbar-brand {
  @apply flex shrink-0 items-center font-semibold text-xl;
  background: linear-gradient(
    90deg,
    var(--gradient-left) 0%,
    var(--gradient-middle) 50%,
    var(--gradient-right) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
