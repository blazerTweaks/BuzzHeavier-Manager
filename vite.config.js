import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://buzzheavier.com",
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            // Garante que o host correto vai no header
            proxyReq.setHeader("host", "buzzheavier.com");
          });
        },
      },
      "/upload": {
        target: "https://w.buzzheavier.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/upload/, ""),
        secure: true,
      },
    },
  },
});
