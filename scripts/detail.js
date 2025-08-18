/* eslint-env browser */
(function () {
  "use strict";

  // Projekt-Root auf GitHub Pages erkennen (lokal = "/")
  const BASE =
    window.location.pathname.includes("/mein-tailwind-projekt/")
      ? "/mein-tailwind-projekt/"
      : "/";

  const DATA_URL = `${BASE}api/mocks/cards_page_1.json`;

  const $ = (sel) => document.querySelector(sel);

  const errorEl =
    $("#detail-error") || document.querySelector("[data-error]") || null;

  const showError = (msg) => {
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.classList.remove("hidden");
    }
  };

  const hideError = () => {
    if (errorEl) errorEl.classList.add("hidden");
  };

  async function run() {
    try {
      // Query-Param id auslesen – nur Browser-APIs via window.*
      const params = new window.URLSearchParams(window.location.search);
      const id = params.get("id");
      if (!id) throw new Error("missing id");

      // Daten holen
      const res = await window.fetch(DATA_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`fetch ${res.status}`);

      const json = await res.json();

      // Kartenliste flexibel bestimmen
      const list = Array.isArray(json)
        ? json
        : Array.isArray(json.cards)
        ? json.cards
        : Array.isArray(json.items)
        ? json.items
        : [];

      const card =
        list.find((c) => c && (c.id === id || c.ID === id)) || null;
      if (!card) throw new Error("card not found");

      // Fehler ausblenden
      hideError();

      // Felder befüllen – nur, wenn vorhanden
      const setText = (sel, val) => {
        const el = $(sel);
        if (el) el.textContent = String(val ?? "—");
      };
      const setSrc = (sel, src) => {
        const el = $(sel);
        if (el && src) el.src = src;
      };

      setText("#card-title", card.player || card.title || card.name || "—");
      setText(
        "#card-series",
        card.franchise || card.team || card.series || "—"
      );
      setText("#card-description", card.variant || card.description || "—");
      setText("#card-price", card.price ? `${card.price} €` : "—");
      setText("#card-trend", card.trend ? `${card.trend} €` : "—");
      setText("#card-limited", card.rarity || card.limited || "—");
      setSrc("#card-image", card.image || card.img || "");
    } catch (_e) {
      // Keine Console-Ausgabe gewünscht – nur UI-Fehler anzeigen
      showError("Fehler beim Laden der Karte.");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
