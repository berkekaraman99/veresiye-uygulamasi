<template>
  <div class="grid grid-cols-12">
    <div
      class="col-span-12 sm:col-start-2 sm:col-span-10 md:col-span-8 md:col-start-3 lg:col-start-4 lg:col-span-6"
    >
      <div class="flex justify-center">
        <page-header heading-text="Faturayı Düzenle" />
      </div>
      <div
        class="bg-white dark:bg-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-950 rounded-3xl shadow-lg px-4 py-8"
      >
        <UForm
          :schema="schema"
          :state="state"
          @submit="updateReceipt"
          class="space-y-6 mx-4"
          v-if="ready"
        >
          <UFormField label="Dekont Türü" name="receipt_type">
            <USelect
              class="w-full"
              :ui="{ base: 'h-12 text-lg' }"
              v-model="state.receipt_type"
              :items="[
                { label: 'Ödeme', value: 0 },
                { label: 'Alacak', value: 1 },
              ]"
            />
          </UFormField>

          <UFormField label="Müşteri Adı" name="customer_name">
            <UInput
              class="w-full"
              color="neutral"
              :ui="{ base: 'h-12 text-lg' }"
              placeholder="Müşteri Adı"
              v-model="customerName"
              type="text"
              disabled
            />
          </UFormField>

          <UFormField label="Fiyat" name="price" :required="true">
            <UInput
              class="w-full"
              color="neutral"
              :ui="{ base: 'h-12 text-lg' }"
              v-model.number="state.price"
              type="number"
            />
          </UFormField>

          <UFormField label="Açıklama" name="description">
            <UTextarea
              class="w-full"
              color="neutral"
              :ui="{ base: 'h-12 text-lg' }"
              v-model="state.description"
            />
          </UFormField>

          <div class="text-center">
            <UButton
              class="px-4 py-3 font-bold gradient-button"
              color="neutral"
              variant="soft"
              :disabled="loading"
              :loading="loading"
              type="submit"
            >
              Fatura Güncelle
            </UButton>
          </div>
        </UForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReceiptStore } from "@/stores/receipt";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAppToast } from "@/composables/useAppToast";
import { useDuration } from "@/composables/useDuration";
import { object, string, number } from "yup";

interface Props {
  receipt_id: string;
}

//STATES
const { toastSuccess, toastError } = useAppToast();
const { shortTime } = useDuration();
const props = defineProps<Props>();
const router = useRouter();
const receiptStore = useReceiptStore();
const { receipt } = storeToRefs(receiptStore);
const customerName = computed(() => receipt.value?.customer_name ?? "");

const schema = object({
  receipt_id: string().required(),
  price: string().required(),
  description: string(),
  receipt_type: number().required(),
});

const initialState = {
  receipt_id: "",
  price: "0",
  description: "",
  receipt_type: 0,
};
const state = ref({ ...initialState });
const loading = ref(false);
const ready = ref(false);

//FUNCTIONS
const updateReceipt = async () => {
  try {
    loading.value = true;
    await receiptStore.updateReceipt(state.value).then(() => {
      toastSuccess({ title: "Fatura güncellendi!" });
      setTimeout(() => {
        router.back();
      }, shortTime);
    });
  } catch {
    toastError({
      title: "Bir hata oluştu, lütfen daha sonra tekrar deneyiniz",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    await receiptStore.getReceiptById(props.receipt_id);
    const r = receipt.value;
    if (!r || r.receipt_id !== props.receipt_id) {
      throw new Error("Dekont bulunamadı");
    }

    Object.assign(state.value, {
      receipt_id: props.receipt_id,
      description: r.description ?? "",
      price: r.price,
      receipt_type: r.receipt_type,
    });

    ready.value = true;
  } catch {
    toastError({ title: "Dekont yüklenemedi" });
    router.back();
  }
});
</script>
