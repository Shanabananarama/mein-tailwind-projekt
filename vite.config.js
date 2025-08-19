// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  // Basis-URL für GitHub Pages (Repo-Name muss exakt passen!)
  base: "/mein-tailwind-projekt/",

  build: {
    outDir: "dist",
    emptyOutDir: true,

    // mehrere HTML-Dateien explizit builden
    rollupOptions: {
      input: {
        // optional, falls index.html existiert:
        // main: "index.html",

        // unsere Seiten:
        cards: "cards.html",
        detail: "detail.html",
      },
    },
  },
});
