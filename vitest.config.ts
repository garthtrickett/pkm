// FILE: ./vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    // This provides a browser-like environment (like `document`, `window`)
    // which is necessary for testing client-side stores that interact
    // with browser APIs (e.g., cookies).
    environment: "jsdom",
    deps: {
      optimizer: { ssr: { include: ["@effect/vitest"] } },
    },
  },
});
