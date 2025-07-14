// vite.config.ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // // This block is correctly configured
  // css: {
  //   postcss: "./postcss.config.js",
  // },
  plugins: [tailwindcss()],

  // Your existing server proxy config
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:42069",
        changeOrigin: true,
      },
    },
  },
});
