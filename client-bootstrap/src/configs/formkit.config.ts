import { tr } from "@formkit/i18n";
import { defaultConfig } from "@formkit/vue";
import { createAutoHeightTextareaPlugin, createFloatingLabelsPlugin, createMultiStepPlugin } from "@formkit/addons";

import "@formkit/themes/genesis";
import "@formkit/addons/css/multistep";
import "@formkit/addons/css/floatingLabels";

export const formkitConfig = defaultConfig({
  plugins: [
    createMultiStepPlugin(),
    createFloatingLabelsPlugin({
      useAsDefault: false,
    }),
    createAutoHeightTextareaPlugin(),
  ],
  locales: { tr },
  locale: "tr",
});
