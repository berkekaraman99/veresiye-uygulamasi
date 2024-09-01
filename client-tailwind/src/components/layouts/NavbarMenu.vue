<template>
  <Popover class="relative">
    <PopoverButton class="inline-flex items-center gap-x-1 text-sm leading-6 text-gray-800 dark:text-gray-100">
      <span>İşlemler</span>
      <ChevronDownIcon class="h-5 w-5" aria-hidden="true" />
    </PopoverButton>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <PopoverPanel class="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
        <div class="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
          <div class="p-4">
            <div v-for="item in products" :key="item.name" class="group relative flex items-center gap-x-6 rounded-lg p-4 hover:bg-gray-50">
              <div class="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                <component :is="item.icon" class="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
              </div>
              <div>
                <RouterLink :to="{ name: item.href }" class="font-semibold text-gray-900">
                  {{ item.name }}
                  <span class="absolute inset-0" />
                </RouterLink>
                <!-- <p class="mt-1 text-gray-600">{{ item.description }}</p> -->
              </div>
            </div>
          </div>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import { DocumentDuplicateIcon, UsersIcon, UserPlusIcon, DocumentPlusIcon, MagnifyingGlassIcon, SunIcon, MoonIcon } from "@heroicons/vue/24/solid";

const products = [
  { name: "Müşteriler", href: "customers", icon: UsersIcon },
  { name: "Müşteri Oluştur", href: "create-customer", icon: UserPlusIcon },
  { name: "Dekont Oluştur", href: "create-receipt", icon: DocumentPlusIcon },
  { name: "Rapor", href: "report", icon: DocumentDuplicateIcon },
  { name: "Arama", href: "search-customer", icon: MagnifyingGlassIcon },
];
</script>
