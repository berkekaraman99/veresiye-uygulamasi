<template>
  <h1 class="page-heading">{{ props.headingText }}</h1>
</template>

<script setup lang="ts">
const props = defineProps({
  headingText: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
@reference "@/index.css";

.page-heading {
  @apply font-semibold text-4xl mb-8 inline-block bg-white dark:bg-slate-900 dark:text-white px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-950;
}
</style>
