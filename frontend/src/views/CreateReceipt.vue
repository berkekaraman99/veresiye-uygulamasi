<template>
  <div class="grid grid-cols-12">
    <div
      class="col-span-12 sm:col-start-2 sm:col-span-10 md:col-span-8 md:col-start-3 lg:col-start-4 lg:col-span-6"
    >
      <div class="flex items-center justify-center">
        <page-header :heading-text="receiptTypeReturn" />
      </div>
      <div class="relative">
        <div
          class="bg-white dark:bg-slate-900 dark:text-white rounded-3xl shadow-lg px-4 py-8 border-2 border-slate-200 dark:border-slate-950"
        >
          <UForm
            :schema="schema"
            :state="state"
            @submit="createReceipt"
            class="space-y-6 mx-4"
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

            <UFormField label="Müşteri Adı" name="customer_id" :required="true">
              <UInputMenu
                v-model="selectedCustomer"
                v-model:search-term="searchTerm"
                :items="searchedCustomers"
                label-key="customer_name"
                :loading="searching"
                ignore-filter
                placeholder="Müşteri adı yazın (en az 2 harf)"
                class="w-full"
                color="neutral"
                :ui="{ base: 'h-12 text-lg' }"
              >
                <template #empty>
                  {{
                    searchTerm.trim().length < 2
                      ? "Aramak için yazmaya başlayın"
                      : "Müşteri bulunamadı"
                  }}
                </template>
              </UInputMenu>
            </UFormField>

            <UFormField label="Fiyat" name="price" :required="true">
              <UInput
                class="w-full"
                :ui="{ base: 'h-12 text-lg' }"
                v-model="state.price"
                type="number"
                color="neutral"
              />
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
                color="neutral"
              />
            </UFormField>

            <UFormField label="Açıklama" name="description">
              <UTextarea
                class="w-full"
                :ui="{ base: 'h-12 text-lg' }"
                color="neutral"
                v-model="state.description"
              />
            </UFormField>

            <div class="text-center">
              <UButton
                class="px-4 py-3 font-bold gradient-button"
                color="neutral"
                variant="soft"
                :loading="loading"
                type="submit"
              >
                Fatura Oluştur
              </UButton>
            </div>
          </UForm>
        </div>
        <div
          v-if="customer"
          id="customer-popup"
          :class="[isPopupHidden ? 'p-2' : 'p-6']"
          class="bg-white dark:bg-slate-900 my-4 dark:text-white rounded-lg shadow-lg border-2 border-slate-200 dark:border-slate-950 fixed bottom-2 right-4"
        >
          <div v-if="!isPopupHidden">
            <div class="flex items-center mb-4 justify-between">
              <h2 class="text-xl font-medium pe-4">
                {{ customer.customer_name }}
              </h2>
              <UButton
                icon="fluent:dismiss-24-regular"
                variant="outline"
                color="neutral"
                @click="closePopup"
              />
            </div>
            <div class="text-sm">
              <p v-if="customer.customer_address">
                {{ customer.customer_address }}
              </p>
              <p>Bakiye: {{ customer.net_bakiye }}₺</p>
            </div>
          </div>
          <div v-else>
            <UButton
              icon="fluent:chevron-left-24-regular"
              size="xl"
              variant="outline"
              color="neutral"
              @click="closePopup"
            />
          </div>
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
import { useAppToast } from "@/composables/useAppToast";
import { object, string, number } from "yup";
import { watchDebounced } from "@vueuse/core";
import { type SearchedCustomer } from "@/models/searched_customer_model";

interface Props {
  receipt_type?: number;
}

//STATES
const props = withDefaults(defineProps<Props>(), {
  receipt_type: 0,
});
const { toastSuccess, toastError } = useAppToast();
const customerStore = useCustomerStore();
const receiptStore = useReceiptStore();
const { searchedCustomers, customer } = storeToRefs(customerStore);

const selectedCustomer = ref<SearchedCustomer>();
const searchTerm = ref("");
const searching = ref(false);
const isPopupHidden = ref(false);

const schema = object({
  customer_id: string().required("Müşteri seçiniz"),
  price: string().required(),
  description: string(),
  created_at: string().required(),
  receipt_type: number().required(),
});

const initialState = {
  customer_id: "",
  price: "0",
  description: "",
  created_at: new Date().toISOString().slice(0, 16),
  receipt_type: isNaN(Number(props.receipt_type)) ? 0 : props.receipt_type,
};
const state = ref({ ...initialState });
const loading = ref(false);

//FUNCTIONS
const receiptTypeReturn = computed(() => {
  return state.value.receipt_type === 0 ? "Ödeme Dekontu" : "Alacak Dekontu";
});

const closePopup = () => {
  isPopupHidden.value = !isPopupHidden.value;
};

const createReceipt = async () => {
  try {
    loading.value = true;
    await receiptStore
      .createReceipt({ ...state.value, receipt_id: uuidv4() })
      .then(() => {
        toastSuccess({ title: "Dekont oluşturuldu!" });
        Object.assign(state.value, initialState);
        selectedCustomer.value = undefined;
        searchTerm.value = "";
      });
  } catch {
    toastError({
      title: "Bir hata oluştu, lütfen daha sonra tekrar deneyiniz",
    });
  } finally {
    loading.value = false;
  }
};

watchDebounced(
  searchTerm,
  async (text) => {
    const q = text.trim();
    if (q.length < 2) {
      customerStore.$patch({ searchedCustomers: [] });
      return;
    }
    searching.value = true;
    try {
      await customerStore.searchCustomers(q);
    } finally {
      searching.value = false;
    }
  },
  { debounce: 300 },
);

watch(selectedCustomer, (c) => {
  state.value.customer_id = c?.customer_id ?? "";
  if (c) customerStore.getCustomerById(c.customer_id);
  else customerStore.$patch({ customer: undefined });
});

onBeforeUnmount(() => {
  customerStore.$patch({
    searchedCustomers: [],
  });
});
</script>
