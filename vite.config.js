import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Unocss from 'unocss/vite';
import { presetIcons, presetUno } from "unocss";

const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Unocss({
      presets: [presetUno(), presetIcons()],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@import '@/assets/style/base.scss';`
  //     }
  //   }
  // },
  server: {
    host: "localhost",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
      },
    },
  },
});
