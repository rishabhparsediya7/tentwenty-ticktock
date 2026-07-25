import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
  },
  resolve: {
    // Mirror the "@/*" path alias from tsconfig so tests can import like the app.
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
});
