import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1/GUI-1/pos-app/php/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/uploads": {
        target: "http://127.0.0.1/GUI-1/pos-app/public/uploads",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/uploads/, ""),
      },
      "/php/uploads": {
        target: "http://127.0.0.1/GUI-1/pos-app/php/uploads",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/php\/uploads/, ""),
      },
      "/GUI-1": {
        target: "http://127.0.0.1",
        changeOrigin: true,
      },
    },
  },
});
