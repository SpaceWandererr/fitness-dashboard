import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,
    port: 5173,

    // Allow ALL hosts (best for Replit dynamic URLs)
    allowedHosts: true,

    // Fix HMR / live reload issues in Replit
    watch: {
      usePolling: true,
    },
  },

  preview: {
    port: 5173,
    allowedHosts: true,
  },
});
