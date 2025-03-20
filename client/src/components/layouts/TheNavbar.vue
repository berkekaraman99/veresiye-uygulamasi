<template>
  <Disclosure
    as="nav"
    class="bg-[var(--navbar-color)] dark:bg-[var(--navbar-color)] text-[var(--text-light)] z-20 fixed w-[100%] h-[64px]"
    v-slot="{ open }"
  >
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="flex items-center">
          <div class="inset-y-0 flex items-center" @click="emit('openSideNav')">
            <!-- Mobile menu button-->
            <DisclosureButton
              class="relative inline-flex items-center justify-center rounded-md p-2 text-[var(--text-dark)] hover:bg-[var(--secondary)] focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-white transition ease-in-out"
            >
              <span class="absolute -inset-0.5" />
              <span class="sr-only">Open main menu</span>
              <Bars3Icon class="block h-6 w-6 text-[var(--text-light)]" />
            </DisclosureButton>
          </div>
          <div class="mx-2">
            <RouterLink to="/" class="flex shrink-0 items-center font-semibold">Veresiye</RouterLink>
          </div>
        </div>
        <div class="mx-2">
          <DarkMode />
        </div>
        <!-- <div class="flex flex-1 items-center ms-12 sm:ms-0 sm:items-stretch sm:justify-start">
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <NavbarMenu />
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </Disclosure>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";
import { DocumentDuplicateIcon, UsersIcon, UserPlusIcon, DocumentPlusIcon, MagnifyingGlassIcon } from "@heroicons/vue/24/solid";
import DarkMode from "@/components/shared/DarkMode.vue";

const emit = defineEmits(["openSideNav"]);

const navigation = [
  { name: "Müşteriler", href: "customers", icon: UsersIcon },
  { name: "Müşteri Oluştur", href: "create-customer", icon: UserPlusIcon },
  { name: "Dekont Oluştur", href: "create-receipt", icon: DocumentPlusIcon },
  { name: "Rapor", href: "report", icon: DocumentDuplicateIcon },
  { name: "Arama", href: "search-customer", icon: MagnifyingGlassIcon },
];
</script>

<style scoped></style>
