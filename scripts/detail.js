/* scripts/detail.js */
(() => {
  "use strict";

  function showError(message) {
    const box = document.getElementById("errorBox");
    if (box) {
      box.classList.remove("hidden");
      const msg = box.querySelector("[data-error-msg]");
      if (msg) msg.textContent = message || "Fehler beim Laden der Karte.";
    }
  }

  function hideError() {
    const box = document.getElementById("errorBox");
    if (box) box.classList.add("hidden");
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text ?? "—";
  }

  function setImage(id, src, alt) {
    const el = document.getElementById(id);
    if (!el) return;
    if (src) {
      el.src = src;
      el.alt = alt || "Kartenbild";
      el.classList.remove("hidden");
    } else {
      el.classList.add("hidden");
    }
  }

  function getBasePath() {
    // GitHub Pages Projektpfad robust bestimmen
    const slug = "/mein-tailwind-projekt/";
    return window.location.pathname.includes(slug) ? slug : "/";
  }

  async function fetchJson(url) {
    const cacheBust = `cb=${Date.now()}`;
    const sep = url.includes("?") ? "&" : "?";
    const res = await fetch(`${url}${sep}${cacheBust}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Fetch ${url} → HTTP ${res.status}`);
    return res.json();
  }

  async function loadCards() {
    // Primär-Datenquelle + stabile Fallbacks
    const base = getBasePath();
    const candidates = [
      `${base}data/cards.json`,
      `${base}api/mocks/cards_page_1.json`,
    ];

    for (const u of candidates) {
      try {
        const data = await fetchJson(u);
        // Unterstütze verschiedene Strukturen
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.cards)) return data.cards;
        if (Array.isArray(data?.data)) return data.data;
        if (Array.isArray(data?.items)) return data.items;
      } catch {
        // weiter zum nächsten Kandidaten
      }
    }
    throw new Error("Keine Datenquelle lieferte Karten.");
  }

  function normalizeId(v) {
    return (v || "").toString().trim();
  }

  function pickText(card, keys, fallback = "—") {
    for (const k of keys) {
      if (card?.[k]) return card[k];
    }
    return fallback;
  }

  (async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const cardId = normalizeId(params.get("id"));
      if (!cardId) {
        showError("Keine Karten-ID in der URL.");
        return;
      }

      const cards = await loadCards();
      const normalized = cards.map((c) => ({
        ...c,
        id: normalizeId(c.id ?? c.card_id ?? c.code),
      }));

      const card = normalized.find((c) => c.id === cardId);
      if (!card) {
        showError(`Karte nicht gefunden: ${cardId}`);
        return;
      }

      hideError();

      // Titel / Name
      setText("card-title", pickText(card, ["title", "name"]));
      // Team / Serie
      setText("card-series", pickText(card, ["team", "club", "series"]));
      // Beschreibung / Variante
      setText("card-description", pickText(card, ["description", "variant"]));
      // Preis / Trend (falls vorhanden)
      setText("card-price", card.price ? `${card.price} €` : "—");
      setText("card-trend", card.trend ? `${card.trend} €` : "—");
      // Rarität/Limitiert
      setText("card-limited", pickText(card, ["rarity", "limit"]));
      // Bild
      setImage("card-image", pickText(card, ["image", "img", "photo", "picture"], ""));
    } catch (err) {
      console.error(err);
      showError("Fehler beim Laden der Karte.");
    }
  })();
})();
