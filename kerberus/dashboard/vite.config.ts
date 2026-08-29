import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// Kerberus Dashboard — Vite config
// Servidor isolado em 127.0.0.1:3001 (NUNCA 0.0.0.0).
// Para expor na rede use túnel (cloudflared/Tailscale) + Cloudflare Access.

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    host: "127.0.0.1",
    port: 3001,
    strictPort: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 3001,
    strictPort: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
