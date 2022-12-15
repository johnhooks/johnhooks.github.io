import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";

const config: UserConfig = {
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
};

export default config;
