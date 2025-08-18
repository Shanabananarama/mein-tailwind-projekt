/* eslint-env browser */
(() => {
  "use strict";

  // ---- feste, funktionierende Daten-URL (GH Pages absolut) ----
  const DATA_URL = "https://shanabananarama.github.io/mein-tailwind-projekt/mocks/cards_page_1.json";

  // ---- Mini-Utils ----
  const $ = (s) => document.querySelector(s);
  const show = (html) => {
    let box = $("#card-details");
    if (!box) {
      box = document.createElement("div");
      box.id = "card-details";
      box.className = "bg-white p-6 rounded-lg shadow";
      document.body.appendChild(box);
    }
    box.innerHTML = html;
  };
  const showError = (msg) => {
    show(`<p style="color:#dc2626;font-size:1.5rem">❌ ${msg}</p>
          <p style="color:#6b7280;margin-top:.5rem">Quelle: ${DATA_URL}</p>`);
  };

  // ---- ID aus URL ----
  const params = new window.URLSearchParams(window.location.search);
  const cardId = params.get("id");
  if (!cardId) {
    showError("Keine Karten-ID in der URL gefunden.");
    return;
  }

  // ---- Laden + Rendern ----
  (async () => {
    try {
      const res = await window.fetch(DATA_URL, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
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
      ].map(([k, v]) =>
        `<div class="flex gap-3"><span class="font-semibold w-28">${k}</span><span>${v}</span></div>`
      ).join("");

      show(`
        <h2 class="text-2xl font-bold mb-4">${card.player || card.name || "Karte"}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2">${rows}</div>
        <p class="text-sm text-gray-500 mt-3">Quelle: ${DATA_URL}</p>
      `);
    } catch (e) {
      showError(`Fehler beim Laden der Karte. ${e && e.message ? "(" + e.message + ")" : ""}`);
    }
  })();
})();
