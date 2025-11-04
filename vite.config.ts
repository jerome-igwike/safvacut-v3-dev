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
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    // FORCE ALLOW ALL REPLIT SUBDOMAINS
    hmr: {
      host: "0.0.0.0",
      protocol: "ws",
    },
    // ALLOW ALL HOSTS (NUKE SECURITY FOR DEV)
    allowedHosts: [".replit.dev", ".replit.co", "localhost"],
  },
});
