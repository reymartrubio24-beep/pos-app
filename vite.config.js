import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    globals: true,
    transformMode: {
      web: [/\.jsx?$/],
    },
    coverage: {
      include: ["src/**/*.{js,jsx}"],
      exclude: [
        "src/main.jsx",
        "src/test/**",
        "src/**/*.stories.{js,jsx}",
        "src/stories/**",
        "src/**/*.css",
      ],
      reporter: ["text", "json", "html"],
      lines: 90,
      functions: 90,
      statements: 90,
      branches: 90,
    },
  },
});
