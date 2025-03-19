/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}", "./src/configs/formkit.theme.ts"],
  theme: {
    extend: {},
    container: {
      center: true,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
