<template>
  <div class="grid grid-cols-12">
    <div class="col-span-12 sm:col-start-2 sm:col-span-10 lg:col-start-4 lg:col-span-6 xl:col-start-4 xl:col-span-6">
      <div class="bg-white py-6 border rounded-lg">
        <h1 class="text-center mb-12 font-bold text-2xl">{{ receiptForm.receipt_type === 0 ? "Borç Oluştur" : "Alacak Oluştur" }}</h1>
        <FormKit
          type="form"
          id="debt-form"
          @submit="createReceipt"
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

          <FormKit
            type="text"
            name="customer_name"
            label="Müşteri"
            placeholder="Müşteri Adı"
            validation="required"
            v-model="customerName"
            list="customers"
            @input="searchCustomer()"
          />
          <datalist id="customers">
            <option v-for="customer in searchedCustomers" :value="customer.customer_name"></option>
          </datalist>
          <FormKit type="number" name="price" label="Fiyat" placeholder="Fiyat" min="0" validation="required" v-model="receiptForm.price" />
          <FormKit type="textarea" name="description" label="Açıklama" placeholder="Açıklama" v-model="receiptForm.description" />

          <FormKit type="submit" label="Oluştur" :wrapper-class="{ 'flex justify-center': true }" />
        </FormKit>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReceiptStore } from "@/stores/receipt";
import { storeToRefs } from "pinia";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { useCustomerStore } from "@/stores/customer";
import { ResponseStatus } from "@/constants/response_status_enum";

const props = defineProps({
  receipt_type: {
    type: Number,
    required: false,
  },
});

const toast = useToast();
const router = useRouter();

const customerStore = useCustomerStore();
const receiptStore = useReceiptStore();

const { statusCode } = storeToRefs(receiptStore);
const { searchedCustomers } = storeToRefs(customerStore);

const receiptForm = reactive({
  customer_id: "",
  price: 0,
  description: "",
  receipt_type: props.receipt_type ?? 0,
});

const createReceipt = async () => {
  if (customerName.value !== "") {
    receiptForm.customer_id = searchedCustomers.value[0].customer_id;
    const receipt_id = uuidv4();
    const created_date = moment().format("YYYY-MM-DD HH:mm:ss");

    await receiptStore
      .createReceipt({
        ...receiptForm,
        receipt_id: receipt_id,
        created_date: created_date,
      })
      .then(() => {
        if (statusCode.value === ResponseStatus.SUCCESS) {
          toast.success("Dekont oluşturuldu!", {
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
  }
};

let timer: any = null;
const customerName = ref("");

const searchCustomer = async () => {
  if (timer != null) {
    clearTimeout(timer);
  }
  timer = setTimeout(async () => {
    await customerStore.searchCustomers(customerName.value);
  }, 500);
};
</script>

<style scoped></style>
