import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
<<<<<<< Updated upstream
    port: 5000,
=======
    port: 3000,
>>>>>>> Stashed changes
    strictPort: true,
    allowedHosts: [".replit.dev", ".repl.co"],

    // 🔥 REMOVE hardcoded HMR
    watch: {
      usePolling: true,
    },
  },
});
