import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts}"],
    globals: true,
    environment: "jsdom",
    setupFiles: ["./setupTests.js"],
  },
});
