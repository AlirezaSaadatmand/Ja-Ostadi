import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt", "**/*.webp"],
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      manifest: {
        name: "جااستادی",
        short_name: "جااستادی",
        description: "داشبورد جا استادی دانشگاه فسا‍!",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#4f46e5",
        prefer_related_applications: false,
        icons: [
          {
            src: "/assets/IconPWA/48x48.png",
            type: "image/png",
            sizes: "48x48",
          },
          {
            src: "/assets/IconPWA/72x72.png",
            type: "image/png",
            sizes: "72x72",
          },
          {
            src: "/assets/IconPWA/96x96.png",
            type: "image/png",
            sizes: "96x96",
          },
          {
            src: "/assets/IconPWA/128x128.png",
            type: "image/png",
            sizes: "128x128",
          },
          {
            src: "/assets/IconPWA/144x144.png",
            type: "image/png",
            sizes: "144x144",
            purpose: "any",
          },
          {
            src: "/assets/IconPWA/152x152.png",
            type: "image/png",
            sizes: "152x152",
          },
          {
            src: "/assets/IconPWA/192x192.png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "/assets/IconPWA/512x512.png",
            type: "image/png",
            sizes: "512x512",
          },
        ],
        screenshots: [
          {
            src: "/assets/screenshots/view.png",
            type: "image/png",
            sizes: "540x720",
            form_factor: "narrow",
          },
          {
            src: "/assets/screenshots/view.png",
            type: "image/png",
            sizes: "1280x720",
            form_factor: "wide",
          },
        ],
      },
    }),
  ],
});