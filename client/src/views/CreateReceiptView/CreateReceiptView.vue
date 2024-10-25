<template>
  <div class="grid grid-cols-12">
    <div class="col-start-4 col-span-6">
      <h1 class="text-center mb-8 font-semibold text-3xl">{{ receiptTypeReturn }}</h1>
      <div class="bg-white rounded-lg shadow-lg p-8">
        <FormKit
          type="form"
          id="receipt-form"
          @submit="createReceipt"
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

          <FormKit
            type="text"
            name="customer_name"
            label="Müşteri"
            placeholder="Müşteri Adı"
            validation="required"
            v-model="customerName"
            list="customers"
            @input="searchCustomer()"
            autofocus
          />
          <datalist id="customers">
            <option v-for="customer in searchedCustomers" :value="customer.customer_name"></option>
          </datalist>

          <!-- <select v-show="showSelect" ref="customerSelect" class="form-select" aria-label="Default select example">
            <option v-for="customer in searchedCustomers" :value="customer.customer_id">{{ customer.customer_name }}</option>
          </select> -->
          <FormKit
            type="number"
            name="price"
            label="Fiyat"
            placeholder="Fiyat"
            min="0"
            step="0.1"
            validation="required"
            v-model="receiptForm.price"
          />
          <FormKit type="datetime-local" label="Tarih" :validation="'required|date_before' + maxDate" v-model="receiptForm.created_date" />
          <FormKit type="textarea" name="description" label="Açıklama" placeholder="Açıklama" v-model="receiptForm.description" />

          <FormKit type="submit" label="Oluştur" :disabled="statusCode === 200" :wrapper-class="{ 'flex justify-center': true }" />
        </FormKit>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReceiptStore } from "@/stores/receipt";
import { storeToRefs } from "pinia";
import { computed, nextTick, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { useCustomerStore } from "@/stores/customer";
import { ResponseStatus } from "@/constants/response_status_enum";

interface Props {
  receipt_type?: number;
}

const receiptTypeReturn = computed(() => {
  return receiptForm.receipt_type === 0 ? "Ödeme Oluştur" : "Alacak Oluştur";
});

//STATES
const props = withDefaults(defineProps<Props>(), {
  receipt_type: 0,
});
const toast = useToast();
const router = useRouter();
const customerStore = useCustomerStore();
const receiptStore = useReceiptStore();
const { statusCode } = storeToRefs(receiptStore);
const { searchedCustomers } = storeToRefs(customerStore);
const receiptForm = reactive({
  customer_id: "",
  price: "0",
  description: "",
  created_date: moment().format("YYYY-MM-DD HH:mm:ss"),
  receipt_type: isNaN(Number(props.receipt_type)) ? 0 : props.receipt_type,
});
let timer: any = null;
const customerName = ref("");
const latestDate = new Date();
latestDate.setDate(latestDate.getDate() + 1);
const maxDate = latestDate.toISOString().slice(0, 10);

//FUNCTIONS
const createReceipt = async () => {
  if (customerName.value !== "") {
    receiptForm.customer_id = searchedCustomers.value[0].customer_id;
    const receipt_id = uuidv4();
    // const created_date = moment().format("DD-MM-YYYY HH:mm");

    await receiptStore
      .createReceipt({
        ...receiptForm,
        receipt_id: receipt_id,
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
