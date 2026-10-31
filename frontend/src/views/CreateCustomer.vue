<template>
  <div class="grid grid-cols-12">
    <div
      class="col-span-12 sm:col-start-2 sm:col-span-10 md:col-span-8 md:col-start-3 lg:col-start-4 lg:col-span-6"
    >
      <div class="flex items-center justify-center">
        <page-header heading-text="Müşteri Oluştur" />
      </div>
      <div
        class="bg-white dark:bg-slate-900 dark:text-white rounded-3xl shadow-lg px-4 py-8 border-2 border-slate-200 dark:border-slate-950"
      >
        <UForm
          :schema="schema"
          :state="state"
          @submit="createCustomer"
          class="space-y-6 mx-4"
        >
          <UFormField label="Müşteri Adı" name="customer_name" :required="true">
            <UInput
              class="w-full"
              color="neutral"
              :ui="{ base: 'h-12 text-lg' }"
              placeholder="Müşteri Adı"
              v-model="state.customer_name"
              type="text"
            />
          </UFormField>

          <UFormField label="Müşteri Adresi" name="customer_address">
            <UInput
              class="w-full"
              color="neutral"
              :ui="{ base: 'h-12 text-lg' }"
              placeholder="Müşteri Adresi"
              v-model="state.customer_address"
              type="text"
            />
          </UFormField>

          <UFormField label="Telefon Numarası" name="phone_number">
            <UInput
              class="w-full"
              color="neutral"
              :ui="{ base: 'h-12 text-lg' }"
              placeholder="Telefon Numarası"
              v-model="state.phone_number"
              type="text"
            />
          </UFormField>

          <div class="text-center">
            <UButton
              class="px-4 py-3 font-bold gradient-button"
              color="neutral"
              variant="soft"
              :disabled="loading"
              type="submit"
              :loading="loading"
            >
              Müşteri Oluştur
            </UButton>
          </div>
        </UForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { useCustomerStore } from "@/stores/customer";
import { useAppToast } from "@/composables/useAppToast";
import { object, string } from "yup";

//STATES
const { toastSuccess, toastError } = useAppToast();
const customerStore = useCustomerStore();

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
const loading = ref(false);

//FUNCTIONS
const createCustomer = async () => {
  try {
    loading.value = true;
    if (state.value.customer_name.length >= 2) {
      const customer_id = uuidv4();

      await customerStore
        .createCustomer({
          ...state.value,
          customer_id: customer_id,
        })
        .then(() => {
          toastSuccess({ title: "Müşteri oluşturuldu!" });
          Object.assign(state.value, initialState);
        });
    }
  } catch {
    toastError({
      title: "Bir hata oluştu, lütfen daha sonra tekrar deneyiniz",
    });
  } finally {
    loading.value = false;
  }
};
</script>
