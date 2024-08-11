import "./assets/css/main.scss";
import "vue-toastification/dist/index.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { plugin } from "@formkit/vue";
import { formkitConfig } from "./configs/formkit.config";
import Toast, { type PluginOptions, POSITION } from "vue-toastification";

import App from "./App.vue";
import router from "./router";

const options: PluginOptions = {
  position: POSITION.BOTTOM_RIGHT,
};

const app = createApp(App);

app.use(createPinia());
app.use(plugin, formkitConfig);
app.use(Toast, options);
app.use(router);

app.mount("#app");
