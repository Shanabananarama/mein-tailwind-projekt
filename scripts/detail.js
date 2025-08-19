/* eslint-disable no-console */

// Detailseite: robustes Laden einer Karte per ID aus data/cards.json
// - Keine Browser-Globals nackt verwenden (eslint no-undef) → immer über window.*
// - Cache-Busting auf dem JSON-Fetch
// - Fallback-UI ohne Alerts/Crashes

(function () {
  "use strict";

  // UI helpers (keine harten Annahmen – nur setzen, wenn Element existiert)
  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value != null ? String(value) : "";
  }

  function showError(msg) {
    // Falls es ein dediziertes Fehler-Element gibt, nutzen – sonst inline Meldung.
    const errEl = document.getElementById("card-error");
    if (errEl) {
      errEl.textContent = msg;
      errEl.style.display = "block";
    } else {
      // Fallback: roten Text in den Details platzieren
      const host = document.getElementById("card-details") || document.body;
      const p = document.createElement("p");
      p.style.color = "#e11d48"; // Tailwind red-600
      p.style.fontWeight = "600";
      p.textContent = msg;
      host.appendChild(p);
    }
  }

  function hideError() {
    const errEl = document.getElementById("card-error");
    if (errEl) errEl.style.display = "none";
  }

  function getIdFromQuery() {
    try {
      const qs = window.location.search || "";
      const sp = new window.URLSearchParams(qs);
      const raw = sp.get("id");
      return raw ? raw.trim() : "";
    } catch (e) {
      return "";
    }
  }

  async function loadJson(path) {
    const url = `${path}${path.includes("?") ? "&" : "?"}cb=${Date.now()}`;
    const resp = await fetch(url, { cache: "no-store" });
    if (!resp.ok) throw new Error(`Fetch failed: ${resp.status} ${resp.statusText}`);
    return resp.json();
  }

  function findCardById(data, id) {
    if (!id) return null;

    // Daten können als Array oder Objekt mit Array kommen – robust behandeln
    const list = Array.isArray(data) ? data : (Array.isArray(data.cards) ? data.cards : []);
    if (!list.length) return null;

    const norm = (s) => String(s || "").trim();
    const target = norm(id);

    // exakte ID
    let found = list.find((c) => norm(c.id) === target);
    if (found) return found;

    // kleine Toleranz (ohne Leerzeichen)
    const collapse = (s) => norm(s).replace(/\s+/g, "");
    return list.find((c) => collapse(c.id) === collapse(target)) || null;
  }

  function renderCard(card) {
    // Unterstützt die bereits vorhandenen IDs, falls sie existieren.
    // (Nicht vorhanden? → keine Fehler, nur überspringen)
    setText("card-title", card.title || card.name || card.player || "—");
    setText("card-series", card.team || card.series || "—");
    setText("card-description", card.description || card.desc || "");
    setText("card-price", card.price != null ? `${card.price} €` : "—");
    setText("card-trend", card.trend != null ? `${card.trend} €` : "—");
    setText("card-limited", card.limited != null ? String(card.limited) : "—");

    const imgEl = document.getElementById("card-image");
    if (imgEl && card.image) {
      imgEl.src = card.image;
      imgEl.alt = card.title || card.name || card.player || "Karte";
    }
  }

  async function main() {
    hideError();

    const id = getIdFromQuery();
    if (!id) {
      showError("❌ Fehler beim Laden der Karte: Keine ID in der URL.");
      return;
    }

    try {
      // GitHub Pages-konformer relativer Pfad (Detailseite liegt im Repo-Root)
      const data = await loadJson("data/cards.json");

      const card = findCardById(data, id);
      if (!card) {
        showError(`❌ Karte mit ID „${id}“ nicht gefunden.`);
        return;
      }

      renderCard(card);
    } catch (err) {
      console.error(err);
      showError("❌ Fehler beim Laden der Karte.");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main, { once: true });
  } else {
    main();
  }
})();
