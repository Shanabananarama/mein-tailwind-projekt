/* eslint-env browser */
(() => {
  "use strict";

  // KORREKTE, live funktionierende Datenquelle auf GitHub Pages
  const DATA_URL = "https://shanabananarama.github.io/mein-tailwind-projekt/api/mocks/cards_page_1.json";

  // ---------- kleine Helpers ----------
  const $ = (s) => document.querySelector(s);
  const ensureHost = () => {
    let box = $("#card-details");
    if (!box) {
      box = document.createElement("div");
      box.id = "card-details";
      box.className = "bg-white p-6 rounded-lg shadow";
      document.body.appendChild(box);
    }
    return box;
  };
  const show = (html) => (ensureHost().innerHTML = html);
  const showError = (msg) =>
    show(`<p style="color:#dc2626;font-size:1.5rem">❌ ${msg}</p>
          <p style="color:#6b7280;margin-top:.5rem">Quelle: ${DATA_URL}</p>`);

  // ---------- ID aus URL ----------
  const params = new URLSearchParams(location.search);
  const cardId = params.get("id");
  if (!cardId) {
    showError("Keine Karten-ID in der URL gefunden.");
    return;
  }

  // ---------- Laden & Rendern ----------
  (async () => {
    try {
      const res = await fetch(DATA_URL, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText} bei ${res.url}`);
      }
      const json = await res.json();
      const list = Array.isArray(json) ? json : json.cards || [];
      const card = list.find((c) => c && c.id === cardId);
      if (!card) {
        showError(`Karte mit ID "${cardId}" nicht gefunden.`);
        return;
      }

      const rows = [
        ["ID", card.id],
        ["Set-ID", card.set_id || card.setId || "—"],
        ["Spieler", card.player || card.name || "—"],
        ["Franchise", card.franchise || "—"],
        ["Nummer", card.number || "—"],
        ["Variante", card.variant || "—"],
        ["Seltenheit", card.rarity || "—"],
      ]
        .map(
          ([k, v]) =>
            `<div class="flex gap-3"><span class="font-semibold w-28">${k}</span><span>${v}</span></div>`
        )
        .join("");

      show(`
        <h2 class="text-2xl font-bold mb-4">${card.player || card.name || "Karte"}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2">${rows}</div>
        <p class="text-sm text-gray-500 mt-3">Quelle: ${DATA_URL}</p>
      `);
    } catch (e) {
      showError(`Fehler beim Laden der Karte. ${e?.message ? "(" + e.message + ")" : ""}`);
    }
  })();
})();
