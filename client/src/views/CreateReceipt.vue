<template>
  <div class="grid grid-cols-12">
    <div class="col-span-12 sm:col-start-2 sm:col-span-10 md:col-span-8 md:col-start-3 lg:col-start-4 lg:col-span-6">
      <div class="flex items-center justify-center">
        <h1
          class="font-semibold text-4xl mb-8 inline-block bg-white dark:bg-slate-900 dark:text-white px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-950"
        >
          {{ receiptTypeReturn }}
        </h1>
      </div>
      <div class="relative">
        <div class="bg-white dark:bg-slate-900 dark:text-white rounded-lg shadow-lg p-8 border-2 border-slate-200 dark:border-slate-950">
          <UForm :schema="schema" :state="state" @submit="createReceipt" class="space-y-6 mx-4">
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
                :ui="{ base: 'h-12 text-lg' }"
                placeholder="Müşteri Adı"
                v-model="customerName"
                type="text"
                list="customers"
                @input="searchCustomer"
              />
            </UFormField>
            <datalist id="customers">
              <option v-for="customer in searchedCustomers" :value="customer.customer_name" :key="customer.customer_id"></option>
            </datalist>

            <UFormField label="Fiyat" name="price">
              <UInput class="w-full" :ui="{ base: 'h-12 text-lg' }" v-model="state.price" type="number" />
            </UFormField>

            <UFormField label="Tarih" name="date">
              <UInput
                class="w-full"
                :ui="{ base: 'h-12 text-lg' }"
                @change="
                  () => {
                    console.log(state.created_at);
                  }
                "
                v-model="state.created_at"
                type="datetime-local"
              />
            </UFormField>

            <UFormField label="Açıklama" name="description">
              <UTextarea class="w-full" :ui="{ base: 'h-12 text-lg' }" v-model="state.description" />
            </UFormField>

            <div class="text-center">
              <UButton class="px-4 py-3 font-bold" color="secondary" :disabled="buttonDisabled" type="submit"> Fatura Oluştur </UButton>
            </div>
          </UForm>
        </div>
        <div
          v-if="customer"
          class="bg-white dark:bg-slate-900 my-4 dark:text-white rounded-lg shadow-lg p-8 border-2 border-slate-200 dark:border-slate-950 xl:absolute xl:w-fit xl:-right-80 xl:top-1/6"
        >
          <h2 class="text-2xl font-medium mb-4">{{ customer.customer_name }}</h2>
          <p v-if="customer.customer_address">{{ customer.customer_address }}</p>
          <p>Bakiye: {{ customer.net_bakiye }}₺</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReceiptStore } from "@/stores/receipt";
import { storeToRefs } from "pinia";
import { computed, ref, onBeforeUnmount, watch } from "vue";
import { v4 as uuidv4 } from "uuid";
import { useCustomerStore } from "@/stores/customer";
import { ResponseStatus } from "@/constants/response_status_enum";
import { useAppToast } from "@/composables/useAppToast";
import { useDuration } from "@/composables/useDuration";
import { object, string, number } from "yup";

interface Props {
  receipt_type?: number;
}

//STATES
const props = withDefaults(defineProps<Props>(), {
  receipt_type: 0,
});
const { toastSuccess, toastError } = useAppToast();
const { shortTime } = useDuration();
const customerStore = useCustomerStore();
const receiptStore = useReceiptStore();
const { statusCode } = storeToRefs(receiptStore);
const { searchedCustomers, customer } = storeToRefs(customerStore);
const customerName = ref();
const today = new Date().toISOString().slice(0, 16);
let timer: ReturnType<typeof setTimeout> | null = null;
let timer2: ReturnType<typeof setTimeout> | null = null;

const schema = object({
  customer_id: string(),
  price: string().required(),
  description: string(),
  created_at: string().required(),
  receipt_type: number().required(),
});

const initialState = {
  customer_id: "",
  price: "0",
  description: "",
  created_at: today,
  receipt_type: isNaN(Number(props.receipt_type)) ? 0 : props.receipt_type,
};
const state = ref({ ...initialState });

//FUNCTIONS
const receiptTypeReturn = computed(() => {
  return state.value.receipt_type === 0 ? "Ödeme Dekontu" : "Alacak Dekontu";
});

const buttonDisabled = computed(() => {
  return !!(statusCode.value === 200 || state.value.price == "0" || state.value.price == "");
});

const createReceipt = async () => {
  if (customerName.value !== "") {
    state.value.customer_id = searchedCustomers.value[0].customer_id;
    const receipt_id = uuidv4();

    await receiptStore
      .createReceipt({
        ...state.value,
        receipt_id: receipt_id,
      })
      .then(() => {
        if (statusCode.value === ResponseStatus.SUCCESS) {
          toastSuccess({ title: "Dekont oluşturuldu!" });
          Object.assign(state.value, initialState);
          customerName.value = undefined;
          setTimeout(() => {
            receiptStore.$patch({
              statusCode: 0,
            });
          }, shortTime);
        } else {
          toastError({ title: "Bir hata oluştu, lütfen daha sonra tekrar deneyiniz" });
        }
      });
  }
};

const getCustomerInfo = async () => {
  await customerStore.getCustomerByName(customerName.value);
};

const searchCustomer = async () => {
  if (timer != null) {
    clearTimeout(timer);
  }
  timer = setTimeout(async () => {
    await customerStore.searchCustomers(customerName.value);
  }, 500);
};

watch(customerName, () => {
  if (timer2) {
    clearTimeout(timer2);
  }
  let sleep = 500;
  timer2 = setTimeout(() => {
    getCustomerInfo();
  }, sleep);
});

onBeforeUnmount(() => {
  customerStore.$patch({
    searchedCustomers: [],
  });
});
</script>
