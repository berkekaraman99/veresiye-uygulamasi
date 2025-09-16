<template>
  <div class="grid grid-cols-12">
    <div class="col-span-12 sm:col-start-2 sm:col-span-10 md:col-span-8 md:col-start-3 lg:col-start-4 lg:col-span-6">
      <div class="flex justify-center">
        <h1
          class="font-semibold text-3xl mb-8 inline-block bg-white dark:bg-slate-900 dark:text-white px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-950"
        >
          Müşteri Güncelleme
        </h1>
      </div>
      <div class="bg-white dark:bg-slate-900 dark:text-white rounded-lg shadow-lg p-8 border-2 border-slate-200 dark:border-slate-950">
        <UForm :schema="schema" :state="state" @submit="updateCustomer" class="space-y-6 mx-4">
          <UFormField label="Müşteri Adı" name="customer_name" :required="true">
            <UInput class="w-full" :ui="{ base: 'h-12 text-lg' }" placeholder="Müşteri Adı" v-model="state.customer_name" type="text" />
          </UFormField>

          <UFormField label="Müşteri Adresi" name="customer_address">
            <UInput class="w-full" :ui="{ base: 'h-12 text-lg' }" placeholder="Müşteri Adresi" v-model="state.customer_address" type="text" />
          </UFormField>

          <UFormField label="Telefon Numarası" name="phone_number">
            <UInput class="w-full" :ui="{ base: 'h-12 text-lg' }" placeholder="Telefon Numarası" v-model="state.phone_number" type="text" />
          </UFormField>

          <div class="text-center">
            <UButton class="px-4 py-3 font-bold" color="secondary" :disabled="statusCode === 200" type="submit"> Müşteri Güncelle </UButton>
          </div>
        </UForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ResponseStatus } from "@/constants/response_status_enum";
import { useCustomerStore } from "@/stores/customer";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAppToast } from "@/composables/useAppToast";
import { useDuration } from "@/composables/useDuration";
import { object, string } from "yup";

interface Props {
  customer_id: string;
}
//STATES
const { toastSuccess, toastError } = useAppToast();
const { shortTime } = useDuration();
const props = defineProps<Props>();
const router = useRouter();
const customerStore = useCustomerStore();
const { customer, statusCode } = storeToRefs(customerStore);

const schema = object({
  customer_name: string().required("Müşteri adı gereklidir."),
  customer_address: string(),
  phone_number: string(),
});

const initialState = {
  customer_name: "",
  customer_address: "",
  phone_number: "",
};
const state = ref({ ...initialState });

//FUNCTIONS
const updateCustomer = async () => {
  if (state.value.customer_name !== "") {
    await customerStore.updateCustomer({ ...state.value, customer_id: props.customer_id }).then(() => {
      if (statusCode.value === ResponseStatus.SUCCESS) {
        toastSuccess({ title: "Müşteri bilgileri güncellendi!" });
        setTimeout(() => {
          customerStore.$patch({
            statusCode: 0,
          });
          router.push({ name: "customers" });
        }, shortTime);
      } else {
        toastError({ title: "Bir hata oluştu, lütfen daha sonra tekrar deneyiniz" });
      }
    });
  }
};

onMounted(async () => {
  await customerStore.getCustomerById(props.customer_id).then(() => {
    state.value.customer_name = customer.value?.customer_name ?? "";
    state.value.customer_address = customer.value?.customer_address ?? "";
    state.value.phone_number = customer.value?.phone_number ?? "";
  });
});
</script>
