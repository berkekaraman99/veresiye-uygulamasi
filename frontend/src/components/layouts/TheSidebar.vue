<template>
  <aside
    v-if="width > 640"
    id="SideNav"
    class="fixed z-1 transition-all duration-300 ease-in-out bg-linear-to-b from-(--primary) to-(--primary-variant) ml-1.5 top-[76px] bottom-2 rounded-xl shadow-lg"
    :style="{ width: openSideNav ? '240px' : '70px' }"
  >
    <ul class="w-full" :class="[!openSideNav ? 'p-2' : 'px-2 pb-2 pt-[7px]']">
      <RouterLink v-for="item in navigation" :key="item.name" :to="{ name: item.href }">
        <li class="sidebar-item-link" :class="[openSideNav ? ' justify-start px-3' : ' justify-center ps-4']">
          <div class="my-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg">
            <UIcon :name="item.icon" class="h-6 w-6" />
          </div>
          <div
            class="sidebar-item-text"
            :class="{
              'opacity-0 scale-0 w-0': !openSideNav,
              'opacity-100 scale-100 w-auto': openSideNav,
            }"
          >
            {{ item.name }}
          </div>
        </li>
      </RouterLink>
    </ul>
  </aside>

  <div
    @click="handleNav"
    class="bg-black/50 backdrop-blur-lg bg-opacity-70 fixed z-50 w-full h-screen"
    :class="openSideNavOverlay ? 'animate__animated animate__fadeIn animate__faster' : 'hidden z-[-1]'"
  ></div>

  <aside
    id="SideNavOverlay"
    ref="sideNavOverlay"
    class="h-full fixed z-50 bg-linear-to-b from-(--primary)/90 to-(--primary-variant)/90 border-r border-gray-200/10 w-60 animate__animated"
    :class="[openSideNavOverlay ? 'animate__slideInLeft animate__faster' : 'animate__slideOutLeft animate__faster']"
  >
    <div class="flex items-center mx-4 mb-3 mt-5">
      <button
        @click="handleNav"
        class="relative inline-flex items-center justify-center rounded-md p-2 text-(--text-light) hover:bg-(--primary) focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-white transition ease-in-out"
      >
        <UIcon name="heroicons:bars-3" class="block h-6 w-6" />
      </button>
      <div class="mx-2"></div>
      <RouterLink to="/" class="flex shrink-0 items-center font-semibold text-white">Veresiye</RouterLink>
    </div>

    <ul class="mt-4 w-full px-3 pb-2 pt-[7px]">
      <RouterLink
        v-for="item in navigation"
        :key="item.name"
        :to="{ name: item.href }"
        @click="
          () => {
            handleNav();
          }
        "
      >
        <li class="sidebar-item group">
          <div
            class="my-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-slate-900"
          >
            <UIcon :name="item.icon" class="h-6 w-6 size-6 text-gray-600 dark:text-gray-200" aria-hidden="true" />
          </div>
          <div class="font-semibold text-[14px] ms-4">{{ item.name }}</div>
        </li>
      </RouterLink>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { useTemplateRef, onMounted } from "vue";

const sideNavOverlay = useTemplateRef("sideNavOverlay");

const props = defineProps({
  openSideNav: { type: Boolean, required: true },
  openSideNavOverlay: { type: Boolean, required: true },
  width: { type: Number, required: true },
});

const emit = defineEmits(["openSideNavOrOverlay"]);

const handleNav = () => {
  emit("openSideNavOrOverlay");
};

const navigation = [
  { name: "Ana Sayfa", href: "home", icon: "fluent:home-24-filled" },
  { name: "Dashboard", href: "dashboard", icon: "fluent:glance-horizontal-24-filled" },
  { name: "Müşteriler", href: "customers", icon: "fluent:people-24-filled" },
  { name: "Müşteri Oluştur", href: "create-customer", icon: "fluent:person-add-24-filled" },
  { name: "Dekont Oluştur", href: "create-receipt", icon: "fluent:document-add-24-filled" },
  { name: "Rapor", href: "report", icon: "fluent:document-multiple-24-filled" },
  { name: "Arama", href: "search-customer", icon: "fluent:search-24-filled" },
];

onMounted(() => {
  sideNavOverlay.value!.classList.add("hidden");
});
</script>

<style scoped>
@reference "@/index.css";

.sidebar-item {
  @apply flex items-center rounded-lg py-2 text-white font-medium hover:bg-(--primary) px-3;
}

.sidebar-item-link {
  @apply flex items-center rounded-lg my-1.5 font-medium hover:bg-(--secondary) text-(--text-light) dark:text-(--text-light) dark:hover:bg-(--primary-variant);
}

.sidebar-item-text {
  @apply font-semibold text-[14px] ms-4 text-nowrap overflow-hidden transition-all duration-300;
}
</style>
