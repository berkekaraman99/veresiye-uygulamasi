<template>
  <UModal v-model:open="open" :dismissible="false" title="Silme Onayı">
    <template #header>
      <h3 class="text-xl font-bold">Silme Onayı</h3>
    </template>
    <template #content></template>
    <template #title></template>
    <template #body>
      <p class="text-base">
        {{ message }}
      </p>
      <p class="text-red-700 dark:text-red-600 italic text-sm">
        {{ warning }}
      </p>
    </template>
    <template #footer>
      <div class="flex items-center justify-end w-full">
        <UButton
          color="neutral"
          variant="subtle"
          class="rounded-full px-6 py-3 me-2"
          :disabled="loading"
          @click="open = false"
          >Vazgeç</UButton
        >
        <UButton
          color="error"
          class="rounded-full px-6 py-3"
          :loading="loading"
          @click="emit('confirm')"
        >
          {{ confirmLabel }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
interface Props {
  message: string;
  title?: string;
  warning?: string;
  confirmLabel?: string;
  loading?: boolean;
}
withDefaults(defineProps<Props>(), {
  title: "Silme Onayı",
  warning: "Bu işlem geri alınamaz",
  confirmLabel: "Sil",
  loading: false,
});

const open = defineModel({ type: Boolean });
const emit = defineEmits<{ confirm: [] }>();
</script>

<style scoped></style>
