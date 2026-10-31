import { computed, ref, type Ref } from "vue";

export function useSortedRows<T extends Record<string, any>>(rows: Ref<T[]>) {
  const sortKey = ref<keyof T>();
  const sortDir = ref<"asc" | "desc">("asc");

  const sortBy = (key: keyof T) => {
    if (sortKey.value === key) {
      sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
    } else {
      sortKey.value = key;
      sortDir.value = "asc";
    }
  };

  const sortedRows = computed(() => {
    const key = sortKey.value;
    if (!key) return rows.value;
    const dir = sortDir.value === "asc" ? 1 : -1;
    return [...rows.value].sort((a, b) => {
      const x = a[key];
      const y = b[key];
      if (typeof x === "number" && typeof y === "number") return (x - y) * dir;
      return (
        String(x ?? "").localeCompare(String(y ?? ""), "tr", {
          numeric: true,
        }) * dir
      );
    });
  });

  return { sortedRows, sortBy, sortKey, sortDir };
}
