<script setup lang="ts">
defineProps<{ pageCount: number; pageSize: number }>();
const page = defineModel<number>("page", { required: true });
</script>

<template>
  <div v-if="pageCount > 1" class="my-3 flex justify-center select-none">
    <UPagination
      v-model:page="page"
      :total="pageCount * pageSize"
      :items-per-page="pageSize"
      :sibling-count="1"
      show-edges
      color="neutral"
      active-color="secondary"
    />
  </div>
</template>

<style scoped></style>
