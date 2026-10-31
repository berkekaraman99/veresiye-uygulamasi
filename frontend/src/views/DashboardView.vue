<template>
  <div>
    <page-header heading-text="Dashboard" />
    <div class="grid grid-cols-12 gap-4">
      <div
        class="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 col-span-12 lg:col-span-6 min-h-60"
      >
        <DebtReceivableChart
          v-if="debtReceivableResult"
          :alacak="debtReceivableResult.alacak"
          :borc="debtReceivableResult.odeme"
        />
      </div>
      <LastCustomersTable
        :last-customers="lastCustomers"
        @ask-customer="askCustomer"
      />
      <LastReceiptsTable
        :last-receipts="lastReceipts"
        @ask-receipt="askReceipt"
      />
    </div>

    <ConfirmDeleteModal
      v-model="customerOpen"
      :message="`'${customerItem?.customer_name}' adlı müşteriyi silmek istediğinizden emin misiniz?`"
      :loading="customerLoading"
      @confirm="confirmCustomer"
    />

    <ConfirmDeleteModal
      v-model="receiptOpen"
      message="Bu dekontu silmek istediğinizden emin misiniz?"
      :loading="receiptLoading"
      @confirm="confirmReceipt"
    />
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import { useReceiptStore } from "@/stores/receipt";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useAppToast } from "@/composables/useAppToast";
import { useConfirmDelete } from "@/composables/useConfirmDelete";
import type { ICustomer } from "@/models/customer_model";
import LastCustomersTable from "@/components/common/LastCustomersTable.vue";

const customerStore = useCustomerStore();
const receiptStore = useReceiptStore();
const { toastSuccess, toastError } = useAppToast();
const { lastCustomers } = storeToRefs(customerStore);
const { lastReceipts, debtReceivableResult } = storeToRefs(receiptStore);

const {
  open: customerOpen,
  item: customerItem,
  loading: customerLoading,
  ask: askCustomer,
  confirm: confirmCustomer,
} = useConfirmDelete<ICustomer>(async (c) => {
  try {
    await customerStore.deleteCustomer(c.customer_id);
    toastSuccess({ title: "Müşteri başarıyla silindi!" });
    await customerStore.getLastCustomers();
  } catch {
    toastError({ title: "Müşteri silinemedi" });
  }
});

const {
  open: receiptOpen,
  loading: receiptLoading,
  ask: askReceipt,
  confirm: confirmReceipt,
} = useConfirmDelete<string>(async (receipt_id) => {
  try {
    await receiptStore.deleteReceipt(receipt_id);
    toastSuccess({ title: "Dekont başarıyla silindi!" });
    await receiptStore.getLastReceipts();
  } catch {
    toastError({ title: "Dekont silinemedi" });
  }
});

onMounted(async () => {
  await customerStore.getLastCustomers();
  await receiptStore.getLastReceipts();
  await receiptStore.getDebtAndReceivable();
});
</script>

<style scoped></style>
