export const useAppToast = () => {
  const toast = useToast();

  return {
    toastSuccess: ({ title, description }: { title: string; description?: string }) => {
      toast.add({
        title: title,
        description,
        icon: "i-heroicons-check-circle",
        color: "success",
      });
    },
    toastError: ({ title, description }: { title: string; description?: string }) => {
      toast.add({
        title: title,
        description: description,
        icon: "i-heroicons-exclamation-circle",
        color: "error",
      });
    },
  };
};
