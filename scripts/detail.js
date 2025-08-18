/* eslint-env browser */
/* global URLSearchParams */

/**
 * TradingCards – Detailseite
 * Robust gegen fehlende ?id=…, Netzwerkfehler und nicht gefundene Karten.
 * Linter-konform (Doublequotes, Semikolons, keine ungenutzten Variablen).
 */

(function () {
  "use strict";

  // Quelle der Mock-Daten. Relativ zur Site-Root, funktioniert auch auf GitHub Pages.
  // Die Kartenliste liegt laut Repo unter /api/mocks/cards_page_1.json
  const CARDS_URL = "api/mocks/cards_page_1.json";

  // Hilfsfunktionen -----------------------------------------------------------

  function $(id) {
    return document.getElementById(id);
  }

  function setText(id, value) {
    const el = $(id);
    if (el) {
      el.textContent = value == null || value === "" ? "—" : String(value);
    }
  }

  function showError(message) {
    // bevorzugt ein dediziertes Fehler-Element, sonst einfacher Fallback
    const target =
      $("detail-error") || $("error") || $("detail") || document.body;

    const box = document.createElement("div");
    box.style.color = "#d32f2f";
    box.style.fontSize = "clamp(18px, 2.2vw, 28px)";
    box.style.margin = "1.25rem 0";
    box.style.display = "flex";
    box.style.alignItems = "center";
    box.style.gap = "0.75rem";
    box.setAttribute("role", "alert");
    box.innerHTML =
      "<span style=\"font-size:1.6em;line-height:0.9\">❌</span>" +
      `<span>${message}</span>`;

    target.appendChild(box);
  }

  function clearError() {
    const host = $("detail-error") || $("error") || $("detail");
    if (!host) {
      return;
    }
    // entferne nur unsere vorher gesetzten Boxen
    [...host.querySelectorAll("[role='alert']")].forEach((n) => n.remove());
  }

  // Rendering ---------------------------------------------------------------

  function renderCard(card) {
    // 1) Falls die Seite dedizierte Felder hat, befüllen
    //    (IDs an deine detail.html angelehnt)
    setText("field-title", card.player || card.id);
    setText("field-id", card.id);
    setText("field-set-id", card.set_id);
    setText("field-player", card.player);
    setText("field-franchise", card.franchise);
    setText("field-number", card.number);
    setText("field-variant", card.variant);
    setText("field-rarity", card.rarity);

    // 2) Optional: Wenn es ein Container-Element #detail gibt und noch leer ist,
    //    generiere eine einfache, selbsttragende Darstellung als Fallback.
    const container = $("detail");
    if (container && container.children.length === 0) {
      const wrap = document.createElement("div");
      wrap.style.padding = "1rem";
      wrap.style.borderRadius = "14px";
      wrap.style.background = "rgba(15, 23, 42, 0.04)";
      wrap.innerHTML = `
        <h2 style="margin:0 0 .75rem 0;font-weight:700;font-size:clamp(20px,2.4vw,28px)">${card.player || "Unbekannter Spieler"}</h2>
        <dl style="display:grid;grid-template-columns:max-content 1fr;gap:.4rem 1rem;margin:0">
          <dt>ID</dt><dd>${card.id}</dd>
          <dt>Set-ID</dt><dd>${card.set_id || "—"}</dd>
          <dt>Franchise</dt><dd>${card.franchise || "—"}</dd>
          <dt>Nummer</dt><dd>${card.number || "—"}</dd>
          <dt>Variante</dt><dd>${card.variant || "—"}</dd>
          <dt>Seltenheit</dt><dd>${card.rarity || "—"}</dd>
        </dl>
      `;
      container.appendChild(wrap);
    }
  }

  // Daten laden -------------------------------------------------------------

  async function loadCardById(cardId) {
    clearError();

    let data;
    try {
      const resp = await fetch(CARDS_URL, { cache: "no-store" });
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }
      data = await resp.json();
    } catch (e) {
      showError("Fehler beim Laden der Daten. Bitte später erneut versuchen.");
      return null;
    }

    const items = Array.isArray(data?.items) ? data.items : [];
    const found = items.find((c) => c?.id === cardId);

    if (!found) {
      showError("Karte mit dieser ID wurde nicht gefunden.");
      return null;
    }

    return found;
  }

  // Bootstrapping -----------------------------------------------------------

  async function init() {
    // Header oben rechts „Demo“ o.ä. braucht kein Blockieren der Logik
    try {
      // eslint-disable-next-line no-underscore-dangle
      document.documentElement.dataset.page = "detail";
    } catch (_e) {
      // ignoriere
    }

    // Query-Parameter lesen (browser-global, via Header deklariert)
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
      showError("Die URL enthält keine gültige Karten-ID (?id=…).");
      return;
    }

    const card = await loadCardById(id);
    if (!card) {
      return; // Fehler wurde bereits angezeigt
    }

    renderCard(card);
  }

  // Los geht's
  document.addEventListener("DOMContentLoaded", init);
})();
