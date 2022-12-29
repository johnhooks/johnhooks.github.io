import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";
import { defineConfig } from "vite";
import type { InlineConfig } from "vitest";

interface VitestConfigExport extends UserConfig {
  test: InlineConfig;
}

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 5173,
    strictPort: false,
  },
  preview: {
    port: 4173,
    strictPort: false,
  },
  test: {
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts}"],
    globals: true,
    environment: "jsdom",
    setupFiles: ["./setupTests.js"],
  },
} as VitestConfigExport);
