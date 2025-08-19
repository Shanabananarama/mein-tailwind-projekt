/* scripts/detail.js  — final, gh-pages safe */

(function () {
  "use strict";

  // --- DOM refs
  const titleEl = document.getElementById("card-title");
  const seriesEl = document.getElementById("card-series");
  const descEl = document.getElementById("card-description");
  const priceEl = document.getElementById("card-price");
  const trendEl = document.getElementById("card-trend");
  const limitedEl = document.getElementById("card-limited");
  const imgEl = document.getElementById("card-image");

  const errorBox = document.getElementById("errorBox"); // optional: falls vorhanden
  const container = document.getElementById("card-details");

  // --- Helpers
  const showError = (msg) => {
    if (errorBox) {
      errorBox.textContent = msg;
      errorBox.style.display = "block";
    }
    if (container) container.style.display = "none";
  };

  const fmtPrice = (n) =>
    typeof n === "number"
      ? n.toLocaleString("de-DE", { style: "currency", currency: "EUR" })
      : "—";

  // --- Parse ID
  let cardId = "";
  try {
    const usp = new window.URLSearchParams(window.location.search);
    cardId = (usp.get("id") || "").trim();
  } catch {
    cardId = "";
  }
  if (!cardId) {
    showError("Fehler beim Laden der Karte.");
    return;
  }

  // --- Fetch JSON (RELATIV! Keine Prefix-Magie)
  // detail.html liegt im Repo-Root → './data/cards.json' ist zuverlässig auf GitHub Pages
  const DATA_URL = "./data/cards.json";

  const fetchJson = async (url) => {
    const cacheBust = `cb=${Date.now()}`;
    const sep = url.includes("?") ? "&" : "?";
    const finalUrl = `${url}${sep}${cacheBust}`;

    const res = await fetch(finalUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  (async () => {
    try {
      const data = await fetchJson(DATA_URL);

      // Unterstützt sowohl {cards:[...]} als auch direkt [...]
      const list = Array.isArray(data) ? data : Array.isArray(data.cards) ? data.cards : [];

      const card = list.find((c) => (c?.id || "").trim() === cardId);
      if (!card) {
        showError("Fehler beim Laden der Karte.");
        return;
      }

      // --- Render
      titleEl.textContent = card.title || "—";
      seriesEl.textContent = card.team || card.series || "—";
      descEl.textContent = card.description || "—";
      priceEl.textContent = fmtPrice(card.price);
      trendEl.textContent = fmtPrice(card.trend);
      limitedEl.textContent = card.limited ? "Ja" : "Nein";

      if (imgEl) {
        if (card.image) {
          imgEl.src = card.image;
          imgEl.alt = card.title || "Kartenbild";
        } else {
          imgEl.removeAttribute("src");
          imgEl.alt = "Kein Bild verfügbar";
        }
      }

      // Erfolgsanzeige
      if (errorBox) errorBox.style.display = "none";
      if (container) container.style.display = "";
    } catch (e) {
      showError("Fehler beim Laden der Karte.");
      // optional: console.error("Detail-Load failed:", e);
    }
  })();
})();
