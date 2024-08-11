import { tr } from "@formkit/i18n";
import { defaultConfig } from "@formkit/vue";
import { generateClasses } from "@formkit/themes";

// import "@formkit/themes/genesis";
// import "@formkit/addons/css/multistep";
// import "@formkit/addons/css/floatingLabels";

export const formkitConfig = defaultConfig({
  config: {
    classes: generateClasses({
      global: {
        outer: "$reset mb-3",
        input: "form-control",
        label: "form-label fw-semibold",
        help: "form-text",
        message: "text-danger text-center list-unstyled my-2 text-sm",
        messages: "p-0",
      },
      form: {
        form: "col-12 col-sm-10 offset-sm-1 col-lg-8 mt-5 mx-auto p-5 border rounded-4 shadow-sm bg-body",
      },
      range: {
        input: "$reset form-range",
      },
      submit: {
        outer: "$reset mt-3 text-center",
        input: "$reset btn btn-primary px-4 py-2",
      },
      button: {
        outer: "$reset my-3 text-center",
        input: "$reset btn btn-primary px-4 py-2",
      },
    }),
  },
  locales: { tr },
  locale: "tr",
});
