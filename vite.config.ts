// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      // Proxy requests from /api to your bun server
      "/api": {
        target: "http://localhost:42069",
        changeOrigin: true,
      },
    },
  },
});
