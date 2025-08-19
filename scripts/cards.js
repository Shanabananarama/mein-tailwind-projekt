/* scripts/cards.js - load cards list from JSON (gh-pages safe) */
/* eslint-disable no-console */

(() => {
  const listEl = document.getElementById("cards-list");
  const srcEl = document.getElementById("src");

  // WICHTIG: JSON liegt im Repo unter docs/api/mocks/...
  // => öffentlich erreichbar unter /mein-tailwind-projekt/docs/api/mocks/...
  const DATA_URL = "docs/api/mocks/cards_page_1.json";

  async function load() {
    try {
      if (srcEl) srcEl.textContent = DATA_URL;
      const res = await fetch(`${DATA_URL}?cb=${Date.now()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      if (!Array.isArray(json?.cards)) {
        throw new Error("Ungültiges JSON-Format: .cards fehlt");
      }

      render(json.cards);
    } catch (e) {
      console.error("Fehler beim Laden der Karten:", e);
      if (listEl) {
        listEl.innerHTML = `<p class="text-rose-600 text-xl">Fehler beim Laden.</p>`;
      }
    }
  }

  function render(cards) {
    if (!listEl) return;
    listEl.innerHTML = cards
      .map((c) => {
        const href = `detail.html?id=${encodeURIComponent(c.id)}`;
        return `
          <a class="block p-4 rounded-xl bg-white shadow hover:shadow-md transition"
             href="${href}">
            <div class="text-2xl font-semibold">${c.title || c.name || "-"}</div>
            <div class="text-slate-600">${c.club || c.team || ""}</div>
            <div class="text-slate-500 text-sm mt-1">ID: ${c.id || "-"}</div>
            <div class="text-slate-500 text-sm">Variante: ${c.variant || "—"}</div>
            <div class="text-slate-500 text-sm">Seltenheit: ${c.rarity || "-"}</div>
          </a>
        `;
      })
      .join("");
  }

  load();
})();
