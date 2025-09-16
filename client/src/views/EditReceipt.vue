<template>
  <div class="grid grid-cols-12">
    <div class="col-span-12 sm:col-start-2 sm:col-span-10 md:col-span-8 md:col-start-3 lg:col-start-4 lg:col-span-6">
      <div class="flex justify-center">
        <h1
          class="font-semibold text-4xl mb-8 inline-block bg-white dark:bg-slate-900 dark:text-white px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-950"
        >
          Faturayı Düzenle
        </h1>
      </div>
      <div class="bg-white dark:bg-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-950 rounded-lg shadow-lg p-8">
        <UForm :schema="schema" :state="state" @submit="updateReceipt" class="space-y-6 mx-4">
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
            <UInput class="w-full" :ui="{ base: 'h-12 text-lg' }" placeholder="Müşteri Adı" v-model="customerName" type="text" disabled />
          </UFormField>

          <UFormField label="Fiyat" name="price" :required="true">
            <UInput class="w-full" :ui="{ base: 'h-12 text-lg' }" v-model="state.price" type="number" />
          </UFormField>

          <UFormField label="Açıklama" name="description">
            <UTextarea class="w-full" :ui="{ base: 'h-12 text-lg' }" v-model="state.description" />
          </UFormField>

          <div class="text-center">
            <UButton class="px-4 py-3 font-bold" color="secondary" :disabled="buttonDisabled" type="submit"> Fatura Güncelle </UButton>
          </div>
        </UForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ResponseStatus } from "@/constants/response_status_enum";
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
const { statusCode, receipt } = storeToRefs(receiptStore);
const customerName = ref("");

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

const buttonDisabled = computed(() => {
  return !!(statusCode.value === 200 || state.value.price == "0" || state.value.price == "");
});

//FUNCTIONS
const updateReceipt = async () => {
  await receiptStore.updateReceipt(state.value).then(() => {
    if (statusCode.value === ResponseStatus.SUCCESS) {
      toastSuccess({ title: "Fatura güncellendi!" });
      setTimeout(() => {
        receiptStore.$patch({
          statusCode: 0,
        });
        router.push({ name: "home" });
      }, shortTime);
    } else {
      toastError({ title: "Bir hata oluştu, lütfen daha sonra tekrar deneyiniz" });
    }
  });
};

onMounted(async () => {
  await receiptStore.getReceiptById(props.receipt_id).then(() => {
    state.value.receipt_id = receipt.value?.receipt_id ?? "";
    customerName.value = receipt.value?.customer_name ?? "";
    state.value.description = receipt.value?.description ?? "";
    state.value.price = receipt.value?.price ?? "0";
    state.value.receipt_type = receipt.value?.receipt_type ?? 0;
  });
});
</script>
