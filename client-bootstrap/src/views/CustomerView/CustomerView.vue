<template>
  <div>
    <div class="row">
      <div class="col-12 offset-sm-1 col-sm-10 offset-lg-2 col-lg-8 offset-xl-3 col-xl-6">
        <div class="">
          <h1 class="text-center my-3 fw-bold">Müşteri Bilgileri</h1>
          <div class="p-4 bg-body rounded-4 shadow-sm">
            <table>
              <tbody>
                <tr>
                  <th class="px-2 py-2">Müşteri Adı:</th>
                  <td class="px-2 py-2">{{ customer?.customer_name }}</td>
                </tr>
                <tr v-if="customer?.customer_address !== ''">
                  <th class="px-2 py-2">Müşteri Adresi:</th>
                  <td class="px-2 py-2">{{ customer?.customer_address }}</td>
                </tr>
                <tr>
                  <th class="px-2 py-2">Müşterinin Eklenme Tarihi:</th>
                  <td class="px-2 py-2">{{ customer?.created_at }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="row my-3" v-if="customerReceipts.length !== 0">
      <div class="col-12 col-sm-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8">
        <div class="text-sm">
          <h1 class="text-center my-3 fw-bold">Faturalar</h1>
          <table id="receiptsTable" class="table table-striped">
            <thead class="text-xs text-secondary">
              <tr>
                <th scope="col" class="px-3 py-2" @click="sortTable(0)">Fatura No</th>
                <th scope="col" class="px-3 py-2" @click="sortTable(1)">Tarih</th>
                <th scope="col" class="px-3 py-2" @click="sortTable(2)">Fatura Türü</th>
                <th v-if="isHaveDescription" scope="col" class="px-3 py-2" @click="sortTable(3)">Açıklama</th>
                <th scope="col" class="px-3 py-2" @click="sortTable(4)">Bakiye</th>
                <th scope="col" class="px-3 py-2">İşlem</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="receipt in customerReceipts" v-bind:key="receipt.receipt_id">
                <td class="px-3 py-2">{{ receipt.receipt_id }}</td>
                <td class="px-3 py-2">{{ receipt.created_date.slice(0, 10) }}</td>
                <td class="px-3 py-2">{{ reformatReceiptType(receipt.receipt_type) }}</td>
                <td v-if="isHaveDescription" class="px-3 py-2">{{ receipt.description }}</td>
                <td class="px-3 py-2">{{ receipt.price + " ₺" }}</td>
                <td class="px-3 py-2">
                  <div class="dropdown">
                    <a
                      class="btn border dropdown-toggle shadow-sm fw-semibold text-sm"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Seçenekler
                    </a>

                    <ul class="dropdown-menu dropdown-menu-end">
                      <li>
                        <RouterLink :to="{ name: 'receipt', params: { receipt_id: receipt.receipt_id } }" class="dropdown-item"
                          ><DocumentTextIcon /> Fatura Bilgileri</RouterLink
                        >
                      </li>
                      <li>
                        <RouterLink :to="{ name: 'edit-receipt', params: { receipt_id: receipt.receipt_id } }" class="dropdown-item"
                          ><PencilIcon /> Faturayı Güncelle</RouterLink
                        >
                      </li>
                      <li>
                        <a class="dropdown-item text-danger" @click="removeReceipt(receipt.receipt_id)"><TrashIcon /> Faturayı Sil</a>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import { useReceiptStore } from "@/stores/receipt";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { reformatReceiptType } from "@/utils/receipt_helper";
import { DocumentTextIcon, TrashIcon, PencilIcon } from "@heroicons/vue/24/solid";

const props = defineProps({
  customer_id: {
    type: String,
    required: true,
  },
});

const isHaveDescription = ref(false);

const receiptStore = useReceiptStore();
const customerStore = useCustomerStore();
const { customer, customerReceipts } = storeToRefs(customerStore);

const removeReceipt = async (receipt_id: string) => {
  await receiptStore.deleteReceipt(receipt_id).then(async () => {
    await customerStore.getCustomerReceipts(props.customer_id);
  });
};

onMounted(async () => {
  await customerStore.getCustomerById(props.customer_id);
  await customerStore.getCustomerReceipts(props.customer_id).then(() => {
    customerReceipts.value.forEach((element) => {
      if (element.description !== "") {
        isHaveDescription.value = true;
      }
    });
  });
});

const sortTable = (n: number) => {
  let table: HTMLTableElement,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementById("receiptsTable") as HTMLTableElement;
  switching = true;
  dir = "asc";

  while (switching) {
    switching = false;
    rows = table.rows;

    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];

      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode!.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
};
</script>

<style scoped lang="scss">
th {
  & {
    cursor: pointer;
  }

  &:first-child {
    border-top-left-radius: 0.5rem;
  }
  &:last-child {
    border-top-right-radius: 0.5rem;
  }
}

tr {
  &:last-child td {
    &:first-child {
      border-bottom-left-radius: 0.5rem;
    }
    &:last-child {
      border-bottom-right-radius: 0.5rem;
    }
  }
}

td {
  align-content: center;
}

li svg {
  width: 24px;
}
</style>
