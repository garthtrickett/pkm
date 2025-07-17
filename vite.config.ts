// vite.config.ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  plugins: [tailwindcss(), basicSsl({})],

  server: {
    proxy: {
      // Existing API proxy
      "/api": {
        target: "http://localhost:42069",
        changeOrigin: true,
      },
      // Add this new rule for WebSockets
      "/ws": {
        target: "ws://localhost:42069", // Use the WebSocket protocol
        ws: true, // This is the crucial option to enable WebSocket proxying
        changeOrigin: true,
      },
    },
  },
});
