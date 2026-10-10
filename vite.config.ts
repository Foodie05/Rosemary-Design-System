import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "."),
      },
    },
    server: {
      // Optional local development switch.
      hmr: process.env.DISABLE_HMR !== "true",
      // Disabling HMR also disables file watching.
      watch: process.env.DISABLE_HMR === "true" ? null : {},
    },
  };
});
