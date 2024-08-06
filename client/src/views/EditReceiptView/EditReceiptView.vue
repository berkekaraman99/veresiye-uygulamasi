<template>
  <div class="grid grid-cols-12">
    <div class="col-span-12 sm:col-start-2 sm:col-span-10 lg:col-start-4 lg:col-span-6 xl:col-start-4 xl:col-span-6">
      <div class="bg-white py-6 border rounded-lg">
        <h1 class="text-center mb-12 font-bold text-2xl">Faturayı Düzenle</h1>
        <FormKit
          type="form"
          id="debt-form"
          @submit="updateReceipt"
          :actions="false"
          :config="{
            classes: {
              outer: 'mx-auto',
              wrapper: 'mx-auto',
              messages: 'text-center',
            },
          }"
        >
          <FormKit
            type="select"
            name="receipt_type"
            label="Dekont Türü"
            placeholder="Dekont türünü seçiniz"
            :options="[
              { label: 'Borç', value: 0 },
              { label: 'Alacak', value: 1 },
            ]"
            v-model="receiptForm.receipt_type"
          />

          <FormKit type="text" name="customer_name" label="Müşteri" placeholder="Müşteri Adı" validation="required" v-model="customerName" disabled />
          <FormKit type="number" name="price" label="Fiyat" placeholder="Fiyat" min="0" validation="required" v-model="receiptForm.price" />
          <FormKit type="textarea" name="description" label="Açıklama" placeholder="Açıklama" v-model="receiptForm.description" />

          <FormKit type="submit" label="Faturayı Güncelle" :wrapper-class="{ 'flex justify-center': true }" />
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
import { useToast } from "vue-toastification";

const props = defineProps({
  receipt_id: {
    type: String,
    required: true,
  },
});

const toast = useToast();
const router = useRouter();

const receiptStore = useReceiptStore();

const { statusCode, receipt } = storeToRefs(receiptStore);

const receiptForm = reactive({
  receipt_id: "",
  price: 0,
  description: "",
  receipt_type: 0,
});

const customerName = ref("");

const updateReceipt = async () => {
  await receiptStore.updateReceipt(receiptForm).then(() => {
    if (statusCode.value === ResponseStatus.SUCCESS) {
      toast.success("Fatura güncellendi!", {
        timeout: 2000,
      });
      setTimeout(() => {
        receiptStore.$patch({
          statusCode: 0,
        });
        router.push({ name: "home" });
      }, 2000);
    } else {
      toast.error("Bir hata oluştu, lütfen daha sonra tekrar deneyiniz", {
        timeout: 2000,
      });
    }
  });
};

onMounted(async () => {
  await receiptStore.getReceiptById(props.receipt_id).then(() => {
    receiptForm.receipt_id = receipt.value?.receipt_id ?? "";
    customerName.value = receipt.value?.customer_name ?? "";
    receiptForm.description = receipt.value?.description ?? "";
    receiptForm.price = receipt.value?.price ?? 0;
    receiptForm.receipt_type = receipt.value?.receipt_type ?? 0;
  });
});
</script>

<style scoped></style>
