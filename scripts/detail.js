/* eslint-env browser */
/* global URLSearchParams, URL */
(() => {
  "use strict";

  // ---------- helpers ----------
  const $ = (sel) => document.querySelector(sel);
  const showError = (msg) => {
    const text = `❌ ${msg || "Fehler beim Laden der Karte."}`;
    let box = $("#detail-error");
    if (!box) {
      box = document.createElement("p");
      box.id = "detail-error";
      box.style.color = "#dc2626";
      box.style.fontSize = "1.25rem";
      box.style.margin = "1rem 0";
      document.body.prepend(box);
    }
    box.textContent = text;
    box.style.display = "block";
  };

  // ---------- id aus URL ----------
  // WICHTIG: explizit über window.* -> sonst no-undef im Linter
  const params = new window.URLSearchParams(window.location.search);
  const cardId = params.get("id");
  if (!cardId) {
    showError("Keine Karten-ID in der URL gefunden.");
    return;
  }

  // Kein führender Slash auf GitHub Pages!
  const API_URL = "api/mocks/cards_page_1.json";

  // ---------- laden & rendern ----------
  window
    .fetch(API_URL, { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return res.json();
    })
    .then((json) => {
      const list = Array.isArray(json) ? json : (json.cards || []);
      const card = list.find((c) => c.id === cardId);

      if (!card) {
        showError("Diese Karte wurde nicht gefunden.");
        return;
      }

      let mount = $("#card-details");
      if (!mount) {
        mount = document.createElement("div");
        mount.id = "card-details";
        mount.className = "bg-white p-6 rounded-lg shadow";
        document.body.appendChild(mount);
      }

      const rows = [
        ["ID", card.id],
        ["Set-ID", card.set_id || card.setId || "—"],
        ["Spieler", card.player || card.name || "—"],
        ["Franchise", card.franchise || "—"],
        ["Nummer", card.number || "—"],
        ["Variante", card.variant || "—"],
        ["Seltenheit", card.rarity || "—"]
      ]
        .map(([k, v]) => `<div class="flex gap-3"><span class="font-semibold w-28">${k}</span><span>${v}</span></div>`)
        .join("");

      mount.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">${card.player || card.name || "Karte"}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2">${rows}</div>
      `;

      const err = $("#detail-error");
      if (err) err.style.display = "none";
    })
    .catch((err) => {
      console.error("[detail] load failed", err);
      showError("Karte konnte nicht geladen werden.");
    });
})();
