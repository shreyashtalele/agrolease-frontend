import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    target: "es2020",
    minify: "terser",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          // React vendor chunk
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react-router-dom")
          ) {
            return "react-vendor";
          }
          // React Query vendor chunk
          if (id.includes("node_modules/@tanstack/react-query")) {
            return "query-vendor";
          }
          // Form vendor chunk
          if (
            id.includes("node_modules/react-hook-form") ||
            id.includes("node_modules/@hookform/resolvers") ||
            id.includes("node_modules/zod")
          ) {
            return "form-vendor";
          }
          // UI vendor chunk
          if (id.includes("node_modules/zustand")) {
            return "ui-vendor";
          }
          // Default - let Vite handle it
          return undefined;
        },
      },
    },
  },
});
