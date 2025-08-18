/* eslint-env browser */
/* global URL, URLSearchParams */

(function () {
  "use strict";

  // UI-Helfer
  function showError(msg) {
    const wrap = document.getElementById("errorWrap");
    const out = document.getElementById("error");
    if (wrap && out) {
      out.textContent = msg || "Fehler beim Laden der Karte.";
      wrap.classList.remove("hidden");
    }
    console.error("[detail]", msg);
  }

  function qs(id) {
    return document.getElementById(id);
  }

  async function main() {
    try {
      // 1) ID aus URL holen (?id=...)
      const search = new URL(window.location.href).searchParams;
      const id = search.get("id");
      if (!id) {
        showError("Keine Karten-ID in der URL.");
        return;
      }

      // 2) Quelle **exakt** wie auf der Kartenliste
      //    -> api/mocks/cards_page_1.json (relativ, mit sicherer Auflösung)
      const dataUrl = new URL("api/mocks/cards_page_1.json", document.baseURI);

      // 3) Laden
      const res = await fetch(dataUrl.toString(), { cache: "no-store" });
      if (!res.ok) {
        showError("HTTP " + res.status + " beim Laden der Daten.");
        return;
      }

      const json = await res.json();

      // 4) Karten-Array robust extrahieren
      const cards = Array.isArray(json) ? json : (Array.isArray(json.cards) ? json.cards : []);
      if (cards.length === 0) {
        showError("Keine Karten in der Datenquelle gefunden.");
        return;
      }

      // 5) Karte suchen
      const card = cards.find((c) => c && c.id === id);
      if (!card) {
        showError("Karte mit ID \"" + id + "\" nicht gefunden.");
        return;
      }

      // 6) Rendern (einfach & robust)
      if (qs("cardTitle")) qs("cardTitle").textContent = card.name || "—";
      if (qs("cardFranchise")) qs("cardFranchise").textContent = card.franchise || "—";
      if (qs("cardId")) qs("cardId").textContent = card.id || "—";
      if (qs("cardVariant")) qs("cardVariant").textContent = card.variant || "—";
      if (qs("cardRarity")) qs("cardRarity").textContent = card.rarity || "—";

      // Bild optional
      if (qs("cardImage")) {
        const img = qs("cardImage");
        if (card.image) {
          img.src = card.image;
          img.alt = card.name || "Kartenbild";
          img.classList.remove("hidden");
        } else {
          img.classList.add("hidden");
        }
      }

      // Erfolgsfall: Fehlermeldung sicher verbergen (falls vorhanden)
      const wrap = document.getElementById("errorWrap");
      if (wrap) wrap.classList.add("hidden");
    } catch (err) {
      showError("Unerwarteter Fehler.");
    }
  }

  document.addEventListener("DOMContentLoaded", main);
})();
