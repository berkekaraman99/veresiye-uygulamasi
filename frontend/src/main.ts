import "./assets/css/main.css";
import "animate.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import TheLoading from "./components/shared/TheLoading.vue";
import ui from "@nuxt/ui/vue-plugin";

import App from "./App.vue";
import router from "./router";
import PageHeader from "./components/shared/PageHeader.vue";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(ui);
app.component("the-loading", TheLoading);
app.component("page-header", PageHeader);

app.mount("#app");
