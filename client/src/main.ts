import "./assets/css/main.scss";
import "vue-toastification/dist/index.css";
import "./index.css";
import "animate.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { plugin } from "@formkit/vue";
import { formkitConfig } from "./configs/formkit.config";
import Toast, { type PluginOptions, POSITION } from "vue-toastification";
import TheLoading from "./components/shared/TheLoading.vue";

import App from "./App.vue";
import router from "./router";

const options: PluginOptions = {
  position: POSITION.BOTTOM_RIGHT,
};

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(plugin, formkitConfig);
app.use(Toast, options);
app.use(router);
app.component("the-loading", TheLoading);

app.mount("#app");
