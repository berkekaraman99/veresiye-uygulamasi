<template>
  <nav class="navbar navbar-expand-md bg-body-secondary fixed-top mb-3 pt-0 px-0 px-md-3">
    <div class="container-lg bg-body-tertiary py-2 rounded-bottom-4 shadow-sm border-secondary border-bottom">
      <a class="text-body d-block d-md-none" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample"
        ><Bars3Icon class="bars"></Bars3Icon
      ></a>
      <RouterLink :to="{ name: 'home' }">
        <span class="mx-3 text-body fw-bold text-lg">Veresiye</span>
      </RouterLink>
      <div class="d-none d-md-block">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <li class="nav-item align-content-center" @click="changeTheme">
            <Transition name="themeIcon" mode="out-in">
              <SunIcon class="theme-icon" v-if="theme === 'light'" />
              <MoonIcon class="theme-icon" v-else />
            </Transition>
          </li>
          <li class="nav-item">
            <RouterLink :to="{ name: 'home' }" class="nav-link text-body">Ana Sayfa</RouterLink>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"> İşlemler </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li v-for="item in products" v-bind:key="item.name">
                <RouterLink :to="{ name: item.href }" class="dropdown-item" href="#"
                  ><component :is="item.icon" class="icon" /> <span>{{ item.name }}</span></RouterLink
                >
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { DocumentDuplicateIcon, Bars3Icon, UsersIcon, UserPlusIcon, DocumentPlusIcon, SunIcon, MoonIcon } from "@heroicons/vue/24/solid";
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";

let body: HTMLBodyElement | null;
const products = [
  { name: "Müşteriler", href: "customers", icon: UsersIcon },
  { name: "Müşteri Oluştur", href: "create-customer", icon: UserPlusIcon },
  { name: "Dekont Oluştur", href: "create-receipt", icon: DocumentPlusIcon },
  { name: "Rapor", href: "report", icon: DocumentDuplicateIcon },
];
const theme = ref();
const changeTheme = () => {
  if (theme.value === "dark") {
    theme.value = "light";
  } else {
    theme.value = "dark";
  }

  body?.setAttribute("data-bs-theme", theme.value);
  localStorage.setItem("theme", theme.value);
};

onMounted(() => {
  body = document.querySelector("body");
  const savedValue = localStorage.getItem("theme");
  if (savedValue) {
    theme.value = savedValue;
    body?.setAttribute("data-bs-theme", theme.value);
  }
});
</script>

<style scoped lang="scss">
.icon {
  width: 24px;
}

.bars {
  width: 40px;
  padding: 4px;
  cursor: pointer;
  transition: 0.3s ease;
  border-radius: 1rem;

  &:hover {
    background-color: lightgray;
  }
}

.router-link-active,
.router-link-exact-active {
  transition: 0.3s ease;
  font-weight: bold;
}

.theme-icon {
  height: 24px;
  width: 24px;
  cursor: pointer;
  margin: 0rem 0.75rem;
}
</style>
