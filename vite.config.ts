import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nvimPlugin } from "./vite-plugin-nvim";

export default defineConfig({
  plugins: [react(), nvimPlugin()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});
