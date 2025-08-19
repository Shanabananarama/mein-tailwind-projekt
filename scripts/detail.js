/* scripts/detail.js — lädt Kartendetail aus api/mocks/cards_page_1.json */

(function () {
  "use strict";

  // Hilfs-Refs
  const $title = document.getElementById("card-title");
  const $body  = document.getElementById("card-body");
  const $err   = document.getElementById("card-error");

  // Sanfte Fehleranzeige
  function showError(msg) {
    if ($err) {
      $err.textContent = msg || "Fehler beim Laden der Karte.";
      $err.style.display = "block";
    } else {
      // Fallback, falls Markup minimal ist
      const div = document.createElement("div");
      div.style.color = "#dc2626";
      div.style.fontWeight = "600";
      div.textContent = msg || "Fehler beim Laden der Karte.";
      document.body.appendChild(div);
    }
  }

  // URL-Parameter lesen
  let cardId = null;
  try {
    const params = new URLSearchParams(window.location.search);
    cardId = params.get("id");
  } catch (e) {
    // nichts
  }

  if (!cardId) {
    showError("Keine Karten-ID in der URL.");
    return;
  }

  // Quelle exakt wie auf der Kartenliste
  const SOURCE = "api/mocks/cards_page_1.json";

  // Cache-Busting anhängen
  const srcUrl =
    SOURCE + (SOURCE.includes("?") ? "&" : "?") + "cb=" + String(Date.now());

  // Render-Helfer
  function renderCard(card) {
    if ($title) $title.textContent = card.title || card.name || "Kartendetail";

    const rows = [];
    function row(label, value) {
      rows.push(
        `<div style="display:flex; gap:.75rem; margin:.25rem 0;">
          <div style="min-width:7rem; opacity:.7;">${label}</div>
          <div>${value ?? "—"}</div>
        </div>`
      );
    }

    row("Club", card.club || card.team || "—");
    row("ID", card.id || "—");
    row("Variante", card.variant || card.variation || "—");
    row("Seltenheit", card.rarity || "—");

    if ($body) {
      $body.innerHTML = rows.join("");
    }
  }

  // Daten laden & Karte finden
  fetch(srcUrl, { cache: "no-store" })
    .then(async (r) => {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then((json) => {
      // Array oder {cards:[...]} unterstützen
      const list = Array.isArray(json) ? json : (json.cards || json.data || []);
      if (!Array.isArray(list) || list.length === 0) {
        throw new Error("Leere Datenquelle.");
      }

      const hit =
        list.find((c) => String(c.id) === String(cardId)) ||
        list.find((c) => String(c.slug || c.key) === String(cardId));

      if (!hit) {
        showError("Karte nicht gefunden.");
        return;
      }
      renderCard(hit);
    })
    .catch((err) => {
      console.error("[detail] load error:", err);
      showError("Datenquelle nicht erreichbar.");
    });
})();
