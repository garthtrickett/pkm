// FILE: ./vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node", // ← safe default
    deps: {
      optimizer: { ssr: { include: ["@effect/vitest"] } },
    },
  },
});
