<template>
    <div class="grid grid-cols-12">
        <div class="col-start-2 col-span-10">
            <h1 class="text-center font-semibold text-3xl mb-8">Müşteriler</h1>

            <RouterLink :to="{ name: 'create-customer' }">
                <div class="bg-purple-800 hover:bg-purple-600 create-btn text-white">
                    <PlusIcon />
                </div>
            </RouterLink>

            <table id="customersTable" class="table w-full shadow" v-if="searchedCustomers.length !== 0">
                <thead class="text-xs bg-gray-200">
                    <tr>
                        <th scope="col" class="px-3 py-2" @click="sortTable(0)">Müşteri</th>
                        <th v-if="isHaveAddress" scope="col" class="px-3 py-2" @click="sortTable(1)">Müşteri Adresi</th>
                        <th scope="col" class="px-3 py-2" @click="sortTable(2)">Oluşturulma Tarihi</th>
                        <th scope="col" class="px-3 py-2">İşlem</th>
                    </tr>
                </thead>

                <tbody class="text-sm bg-white">
                    <tr v-for="customer in searchedCustomers" v-bind:key="customer.customer_id">
                        <td class="px-5 py-2">{{ customer.customer_name }}</td>
                        <td v-if="isHaveAddress" class="px-3 py-2">{{ customer.customer_address }}</td>
                        <td class="px-5 py-2 text-center">{{ customer.created_at.slice(0, 10) }}</td>
                        <td class="px-5 py-3 text-center">
                            <Menu as="div" class="relative inline-block text-left">
                                <div>
                                    <MenuButton
                                        class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                        Seçenekler
                                        <ChevronDownIcon class="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </MenuButton>
                                </div>

                                <transition enter-active-class="transition ease-out duration-100"
                                    enter-from-class="transform opacity-0 scale-95"
                                    enter-to-class="transform opacity-100 scale-100"
                                    leave-active-class="transition ease-in duration-75"
                                    leave-from-class="transform opacity-100 scale-100"
                                    leave-to-class="transform opacity-0 scale-95">
                                    <MenuItems
                                        class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div class="py-2">
                                            <RouterLink
                                                :to="{ name: 'customer', params: { customer_id: customer.customer_id } }">
                                                <MenuItem v-slot="{ active }">
                                                <a class="flex items-center"
                                                    :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">
                                                    <span class="dropdown-icon">
                                                        <UserIcon />
                                                    </span> <span class="ps-3">Müşteri Bilgileri</span>
                                                </a>
                                                </MenuItem>
                                            </RouterLink>
                                            <RouterLink
                                                :to="{ name: 'edit-customer', params: { customer_id: customer.customer_id } }">
                                                <MenuItem v-slot="{ active }">
                                                <a class="flex items-center"
                                                    :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">
                                                    <span class="dropdown-icon">
                                                        <PencilIcon />
                                                    </span> <span class="ps-3">Müşteri Güncelle</span>
                                                </a>
                                                </MenuItem>
                                            </RouterLink>
                                            <MenuItem v-slot="{ active }"
                                                @click="selCustomer(customer.customer_id), toggleModal()">
                                            <a class="flex items-center text-red-500"
                                                :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">
                                                <span class="dropdown-icon">
                                                    <UserMinusIcon />
                                                </span> <span class="ps-3">Müşteriyi Sil</span>
                                            </a>
                                            </MenuItem>
                                        </div>
                                    </MenuItems>
                                </transition>
                            </Menu>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- <div class="flex items-center justify-center mt-8">
                <div v-for="page in pages" v-bind:key="page"
                    :class="{ 'font-bold underline ': offset / 15 + 1 === page }" class="mx-1 fs-6"
                    @click="selectPage(page)">
                    {{ page }}
                </div>
            </div> -->

            <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div class="flex flex-1 justify-between sm:hidden">
                    <a href="#"
                        class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
                    <a href="#"
                        class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
                </div>
                <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
                    <div>
                        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <a @click="previousPage()"
                                class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                                <span class="sr-only">Previous</span>
                                <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
                            </a>
                            <a @click="selectPage(1)"
                                class="relative cursor-pointer inline-flex items-center px-4 py-2 text-sm  text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">1</a>
                            <span v-if="currentPage > 4"
                                class="relative cursor-pointer inline-flex items-center px-4 py-2 text-sm  text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">...</span>
                            <a v-for="page in pageRange" :key="page" @click="selectPage(page)"
                                class="relative cursor-pointer inline-flex items-center px-4 py-2 text-sm  text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                :class="{ 'font-bold underline bg-violet-600': offset / 15 + 1 === page }">{{
                                    page }}</a>
                            <span v-if="currentPage < customersPageCount - 3"
                                class="relative cursor-pointer inline-flex items-center px-4 py-2 text-sm  text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">...</span>
                            <a @click="selectPage(customersPageCount)"
                                class="relative cursor-pointer inline-flex items-center px-4 py-2 text-sm  text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">{{
                                    customersPageCount }}</a>
                            <a @click="nextPage()"
                                class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                                <span class="sr-only">Next</span>
                                <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
                            </a>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

        <Teleport to="body" v-if="showModal">
            <ModalVue @close="toggleModal()">
                <template #header>
                    <h2 class="text-xl">Silme Onayı</h2>
                    <span id="close-btn" class="close" @click="toggleModal()">&times;</span>
                </template>
                <template #default>
                    <p class="text-base">'{{ selectedCustomer?.customer_name }}' adlı müşteriyi silmek istediğinizden
                        emin misiniz?</p>
                    <p class="text-red-600 italic text-sm">Bu işlem geri alınamaz</p>
                </template>
                <template #actions>
                    <button class="bg-gray-500 hover:bg-gray-600 text-sm text-white px-3 py-2 mx-4 rounded-lg"
                        @click="toggleModal()">Vazgeç</button>
                    <button class="bg-green-600 hover:bg-green-700 px-3 py-2 text-sm text-white rounded-lg"
                        @click="removeCustomer(selectedCustomer!.customer_id), toggleModal()">
                        Onayla
                    </button>
                </template>
            </ModalVue>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { UserIcon, UserMinusIcon, PencilIcon, PlusIcon } from "@heroicons/vue/24/solid";
import { useCustomerStore } from "@/stores/customer";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { useToast } from "vue-toastification";
import { RouterLink } from "vue-router";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import ModalVue from "@/components/common/ModalVue.vue";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'

//STATES
const toast = useToast();
const customerStore = useCustomerStore();
const isHaveAddress = ref(false);
const selectedCustomer = ref<ICustomer>();
const offset = ref(0);
const pages = ref<Array<number>>([]);
const { customers, searchedCustomers, customersPageCount } = storeToRefs(customerStore);
let modal: HTMLElement | null;
const showModal = ref<boolean>(false);
const currentPage = ref<number>(1)

const pageRange = computed(() => {
    const range = [];
    const start = Math.max(2, currentPage.value - 2);
    const end = Math.min(customersPageCount.value - 1, currentPage.value + 2);
    for (let index = start; index <= end; index++) {
        range.push(index)

    }
    return range;
})

//FUNCTIONS
const selectPage = async (no: number) => {
    if (offset.value / 15 - 1 !== no) {
        offset.value = (no - 1) * 15;
        await customerStore.getCustomers(offset.value);
        currentPage.value = no
    }
};

const nextPage = async () => {
    if (offset.value / 15 - 1 < customersPageCount.value * 15) {
        offset.value = offset.value + 15;
        await customerStore.getCustomers(offset.value);
        currentPage.value = currentPage.value + 1
    }
}

const previousPage = async () => {
    if (offset.value / 15 - 1 > 0) {
        offset.value = offset.value - 15;
        await customerStore.getCustomers(offset.value);
        currentPage.value = currentPage.value - 1
    }
}
const selCustomer = (customer: any) => {
    selectedCustomer.value = customer;
};

const removeCustomer = async (customer_id: string) => {
    await customerStore.deleteCustomer(customer_id).then(async () => {
        toast.success("Müşteri Başarıyla Silindi!", { timeout: 2000 });
        await customerStore.getCustomers();
    });
};

const toggleModal = () => {
    showModal.value = !showModal.value;
    console.log(showModal.value);
};

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
    table = document.getElementById("customersTable") as HTMLTableElement;
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

onMounted(async () => {
    await customerStore.getCustomers(offset.value).then(async () => {
        customers.value.forEach((element) => {
            if (element.customer_address !== "") {
                isHaveAddress.value = true;
            }
        });
    });
    await customerStore.getCustomersPageCount().then(() => {
        for (let i = 1; i <= customersPageCount.value; i++) {
            pages.value.push(i);
        }
    });
    modal = document.getElementById("modal-dialog");
});
</script>

<style lang="scss" scoped>
.create-btn {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    border-radius: 4rem;
    height: 4rem;
    width: 4rem;
    padding: 1rem;
}

.dropdown-icon {
    width: 24px;
}
</style>
