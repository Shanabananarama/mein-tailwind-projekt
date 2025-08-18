/* eslint-env browser */

(function () {
  "use strict";

  // ---- helpers -------------------------------------------------------------
  function $(id) {
    return document.getElementById(id);
  }
  function setText(id, value) {
    const el = $(id);
    if (el) el.textContent = value != null && value !== "" ? String(value) : "—";
  }
  function showError(message) {
    // Zeigt eine große, gut sichtbare Fehlermeldung
    const host = document.getElementById("detail-root") || document.body;
    const box = document.createElement("div");
    box.style.color = "#d00";
    box.style.fontSize = "clamp(18px, 2.2vw, 28px)";
    box.style.margin = "24px";
    box.textContent = `✖ ${message}`;
    host.appendChild(box);
  }

  // ---- read query param ----------------------------------------------------
  let cardId = null;
  try {
    const params = new window.URLSearchParams(window.location.search || "");
    cardId = params.get("id");
  } catch (_) {
    // Fallback – sollte eigentlich nie passieren
    cardId = null;
  }

  // ---- validate id ---------------------------------------------------------
  if (!cardId) {
    showError("Fehler beim Laden der Karte (keine ID übergeben).");
    return;
  }

  // ---- data source (RELATIV, kein führender Slash!) -----------------------
  const SOURCE = "api/mocks/cards_page_1.json";

  // ---- load + render -------------------------------------------------------
  fetch(SOURCE, { cache: "no-store" })
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then((data) => {
      const items = Array.isArray(data?.items) ? data.items : data;
      const card =
        Array.isArray(items) ? items.find((c) => c?.id === cardId) : null;

      if (!card) {
        showError("Karte nicht gefunden.");
        return;
      }

      // Optionaler Titel
      setText("name", card.player || "");

      // Felder füllen – IDs müssen im HTML vorhanden sein
      setText("id", card.id);
      setText("setId", card.set_id);
      setText("player", card.player);
      setText("franchise", card.franchise);
      setText("number", card.number);
      setText("variant", card.variant);
      setText("rarity", card.rarity);
    })
    .catch(() => {
      showError("Fehler beim Laden der Karte.");
    });
})();
