import { defineConfig } from "vite";

export default defineConfig({
  base: "/mein-tailwind-projekt/",
  build: {
    outDir: "dist",
    copyPublicDir: true,
    rollupOptions: {
      input: {
        index: "index.html",   // 👈 Root-Entry explizit bauen
        cards: "cards.html",
        detail: "detail.html",
      },
    },
  },
});
