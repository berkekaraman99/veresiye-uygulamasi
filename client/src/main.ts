import "./assets/css/main.css";
import "animate.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { plugin } from "@formkit/vue";
import { formkitConfig } from "./configs/formkit.config";
import TheLoading from "./components/shared/TheLoading.vue";
import ui from "@nuxt/ui/vue-plugin";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(plugin, formkitConfig);
app.use(router);
app.use(ui);
app.component("the-loading", TheLoading);

app.mount("#app");
