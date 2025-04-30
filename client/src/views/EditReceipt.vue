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
      <div class="bg-white dark:bg-slate-900 dark:text-white border-2 dark:border-slate-950 rounded-lg shadow-lg p-8">
        <FormKit
          type="form"
          id="receipt-form"
          @submit="updateReceipt"
          :actions="false"
          :config="{
            classes: {
              outer: 'mx-auto',
            },
          }"
        >
          <FormKit
            type="select"
            name="receipt_type"
            label="Dekont Türü"
            placeholder="Dekont türünü seçiniz"
            :options="[
              { label: 'Ödeme', value: 0 },
              { label: 'Alacak', value: 1 },
            ]"
            v-model="receiptForm.receipt_type"
          />

          <FormKit type="text" name="customer_name" label="Müşteri" placeholder="Müşteri Adı" validation="required" v-model="customerName" disabled />
          <FormKit
            type="number"
            name="price"
            label="Fiyat"
            placeholder="Fiyat"
            step="0.1"
            min="0"
            validation="required"
            v-model="receiptForm.price"
          />
          <FormKit type="textarea" name="description" label="Açıklama" placeholder="Açıklama" v-model="receiptForm.description" />

          <FormKit type="submit" label="Faturayı Güncelle" :disabled="statusCode === 200" :wrapper-class="{ 'flex justify-center': true }" />
        </FormKit>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ResponseStatus } from "@/constants/response_status_enum";
import { useReceiptStore } from "@/stores/receipt";
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAppToast } from "@/composables/useAppToast";

interface Props {
  receipt_id: string;
}

//STATES
const { toastSuccess, toastError } = useAppToast();
const props = defineProps<Props>();
const router = useRouter();
const receiptStore = useReceiptStore();
const { statusCode, receipt } = storeToRefs(receiptStore);
const customerName = ref("");
const receiptForm = reactive({
  receipt_id: "",
  price: "0",
  description: "",
  receipt_type: 0,
});

//FUNCTIONS
const updateReceipt = async () => {
  await receiptStore.updateReceipt(receiptForm).then(() => {
    if (statusCode.value === ResponseStatus.SUCCESS) {
      toastSuccess({ title: "Fatura güncellendi!" });
      setTimeout(() => {
        receiptStore.$patch({
          statusCode: 0,
        });
        router.push({ name: "home" });
      }, 2000);
    } else {
      toastError({ title: "Bir hata oluştu, lütfen daha sonra tekrar deneyiniz" });
    }
  });
};

onMounted(async () => {
  await receiptStore.getReceiptById(props.receipt_id).then(() => {
    receiptForm.receipt_id = receipt.value?.receipt_id ?? "";
    customerName.value = receipt.value?.customer_name ?? "";
    receiptForm.description = receipt.value?.description ?? "";
    receiptForm.price = String(receipt.value?.price);
    receiptForm.receipt_type = receipt.value?.receipt_type ?? 0;
  });
});
</script>
