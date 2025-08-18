/* eslint-env browser */

(function () {
  "use strict";

  // ---------------- helpers ----------------
  function $(id) { return document.getElementById(id); }
  function setText(id, value) {
    const el = $(id);
    if (el) el.textContent = value != null && value !== "" ? String(value) : "—";
  }
  function showError(message) {
    const host = document.getElementById("detail-root") || document.body;
    const box = document.createElement("div");
    box.style.color = "#d00";
    box.style.fontSize = "clamp(18px, 2.2vw, 28px)";
    box.style.margin = "24px";
    box.textContent = `✖ ${message}`;
    host.appendChild(box);
  }

  // --------------- read param ---------------
  let cardId = null;
  try {
    const params = new window.URLSearchParams(window.location.search || "");
    cardId = params.get("id");
  } catch (_) { cardId = null; }

  if (!cardId) {
    showError("Fehler beim Laden der Karte (keine ID übergeben).");
    return;
  }

  // --------------- data sources -------------
  // Basis-Verzeichnis dieser Seite (endet mit '/')
  const BASE = window.location.pathname.replace(/[^/]+$/, "");

  // Kandidaten: relativ & absolut – damit es sowohl mit als auch ohne /api/ klappt
  const SOURCES = [
    BASE + "api/mocks/cards_page_1.json",
    BASE + "mocks/cards_page_1.json",
    "/mein-tailwind-projekt/api/mocks/cards_page_1.json",
    "/mein-tailwind-projekt/mocks/cards_page_1.json"
  ];

  function fetchFirstOk(urls) {
    const attempts = [];
    return urls.reduce((chain, url) => {
      return chain.catch(() => {
        attempts.push(url);
        return fetch(url, { cache: "no-store" }).then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
          // Falls GitHub Pages 404.html als 200 liefert, prüfe Content grob
          const ct = r.headers.get("content-type") || "";
          if (!ct.includes("application/json")) {
            // Trotzdem versuchen zu parsen – wenn es HTML ist, bricht JSON.parse ohnehin
            return r.text().then((t) => JSON.parse(t));
          }
          return r.json();
        });
      });
    }, Promise.reject(new Error("start"))).catch((err) => {
      throw new Error(
        `Konnte keine Datenquelle laden. Versucht: ${attempts.join(", ")}. Grund: ${err.message}`
      );
    });
  }

  // --------------- load & render ------------
  fetchFirstOk(SOURCES)
    .then((data) => {
      const items = Array.isArray(data?.items) ? data.items : data;
      const card = Array.isArray(items) ? items.find((c) => c?.id === cardId) : null;

      if (!card) {
        showError("Karte nicht gefunden.");
        return;
      }

      // Optionaler Titel/Name
      setText("name", card.player || "");

      // Felder setzen (IDs müssen in detail.html vorhanden sein)
      setText("id", card.id);
      setText("setId", card.set_id);
      setText("player", card.player);
      setText("franchise", card.franchise);
      setText("number", card.number);
      setText("variant", card.variant);
      setText("rarity", card.rarity);
    })
    .catch((e) => {
      showError("Fehler beim Laden der Karte.");
      // Für Diagnose in der Konsole – stört Lint nicht
      try { console.error(e); } catch (_) {}
    });
})();
