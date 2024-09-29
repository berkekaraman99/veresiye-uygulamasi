import { tr } from "@formkit/i18n";
import { defaultConfig } from "@formkit/vue";
import { rootClasses } from "./formkit.theme";

export const formkitConfig = defaultConfig({
  config: {
    rootClasses,
  },
  locale: "tr",
  locales: { tr },
});
