import { tr } from "@formkit/i18n";
import { defaultConfig, defineFormKitConfig } from "@formkit/vue";
// import { createAutoHeightTextareaPlugin, createFloatingLabelsPlugin, createMultiStepPlugin } from "@formkit/addons";
import { rootClasses } from "@/themes/formkit.theme";

// import "@formkit/themes/genesis";
// import "@formkit/addons/css/multistep";
// import "@formkit/addons/css/floatingLabels";

export const formkitConfig = defaultConfig({
  config: {
    rootClasses,
  },
  locales: { tr },
  locale: "tr",
});
