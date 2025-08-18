/* eslint-env browser */
/* global URL, URLSearchParams */
"use strict";

/**
 * Robustes Rendering des Kartendetails.
 * - Funktioniert auf GitHub Pages (relative Daten-URL)
 * - Bricht CI nicht mehr (Browser-Globals deklariert)
 * - Rendert DOM sicher (Elemente werden erzeugt)
 */

(function () {
  const app = document.getElementById("app");
  const statusEl = document.getElementById("status");
  const sourceEl = document.getElementById("source");

  function setStatus(msg) {
    if (statusEl) {
      statusEl.textContent = msg;
      statusEl.classList.remove("hidden");
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[m]);
  }

  // 1) ID aus der Query lesen
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    setStatus("✖ Fehlende Karten-ID (?id=...).");
    return;
  }

  // 2) Datenquelle relativ zum aktuellen Dokument (funktioniert auf GH Pages)
  const dataUrl = new URL("api/mocks/cards_page_1.json", window.location.href);

  if (sourceEl) {
    // Quelle im UI anzeigen
    sourceEl.textContent = dataUrl.pathname.replace(/^\/+/, "");
  }

  // 3) Laden + Rendern
  fetch(dataUrl.href)
    .then((res) => {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then((json) => {
      const cards = Array.isArray(json) ? json : (json.cards || []);
      const card = cards.find((c) => c && c.id === id);
      if (!card) throw new Error("Karte nicht gefunden: " + id);

      const wrap = document.createElement("section");
      wrap.className = "bg-white p-6 rounded-lg shadow";

      const player = escapeHtml(card.player || card.name || id);
      const setId = escapeHtml(card.set_id || card.set || "-");
      const team = escapeHtml(card.team || card.franchise || "-");
      const number = card.number != null ? escapeHtml(String(card.number)) : "-";
      const variant = escapeHtml(card.variant || "-");
      const rarity = escapeHtml(card.rarity || "-");

      wrap.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">${player}</h2>
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          <div><dt class="text-gray-500">ID</dt><dd class="font-medium">${escapeHtml(card.id)}</dd></div>
          <div><dt class="text-gray-500">Set-ID</dt><dd class="font-medium">${setId}</dd></div>
          <div><dt class="text-gray-500">Franchise</dt><dd class="font-medium">${team}</dd></div>
          <div><dt class="text-gray-500">Nummer</dt><dd class="font-medium">${number}</dd></div>
          <div><dt class="text-gray-500">Variante</dt><dd class="font-medium">${variant}</dd></div>
          <div><dt class="text-gray-500">Seltenheit</dt><dd class="font-medium">${rarity}</dd></div>
        </dl>
      `;

      if (app) app.replaceChildren(wrap);
    })
    .catch((err) => {
      console.error(err);
      setStatus("✖ Fehler beim Laden der Karte.");
    });
})();
