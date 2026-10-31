<template>
  <div class="my-4 px-2">
    <h3 class="text-right text-sm font-light">
      ©{{ year }}, Veresiye App - V1.0.0
    </h3>
  </div>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<style scoped></style>
