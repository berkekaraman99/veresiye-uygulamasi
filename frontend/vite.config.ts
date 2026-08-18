import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import ui from "@nuxt/ui/vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [vue(), tailwindcss(), ui()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: () => "everything.js",
      },
    },
    target: "es2015",
    cssCodeSplit: false,
    assetsInlineLimit: 100_000,
  },
});
