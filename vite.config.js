import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Works in CodeSandbox, Gitpod, local dev, and Vercel previews
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allows external & sandbox preview URLs
    port: 5173,
    allowedHosts: [
      ".csb.app", // ✅ CodeSandbox
      ".codesandbox.io", // ✅ Legacy CodeSandbox URLs
      "localhost", // ✅ Local development
      ".vercel.app", // ✅ Optional for previews
      ".netlify.app", // ✅ Optional for previews
    ],
  },
  preview: {
    port: 5173,
    allowedHosts: [".csb.app", ".codesandbox.io", "localhost"],
  },
});

server: {
  watch: {
    usePolling: true;
  }
}
