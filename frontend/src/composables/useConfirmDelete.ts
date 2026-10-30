import { ref } from "vue";

export function useConfirmDelete<T>(onConfirm: (item: T) => Promise<void>) {
  const open = ref(false);
  const item = ref<T>();
  const loading = ref(false);

  const ask = (value: T) => {
    item.value = value;
    open.value = true;
  };

  const confirm = async () => {
    if (item.value === undefined) return;
    loading.value = true;
    try {
      await onConfirm(item.value);
    } finally {
      loading.value = false;
      open.value = false;
    }
  };

  return { open, item, loading, ask, confirm };
}
