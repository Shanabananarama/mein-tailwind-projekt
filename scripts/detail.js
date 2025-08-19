/* eslint-env browser */
/* global URLSearchParams */

(function () {
  "use strict";

  function showError(text) {
    const el = document.getElementById("error");
    if (el) {
      el.textContent = `❌ ${text}`;
      el.classList.remove("hidden");
    }
  }

  // 1) ID aus Query
  const params = new URLSearchParams(window.location.search);
  const rawId = params.get("id");
  const id = rawId ? decodeURIComponent(rawId).trim() : "";

  if (!id) {
    showError("Fehlende Karten-ID.");
    return;
  }

  // 2) gh-pages Basispfad
  const base = window.location.pathname.startsWith("/mein-tailwind-projekt/")
    ? "/mein-tailwind-projekt"
    : "";

  // 3) Daten laden (Cache-Busting)
  const dataUrl = `${base}/data/cards.json?cb=${Date.now()}`;

  fetch(dataUrl, { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((payload) => {
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload.cards)
        ? payload.cards
        : [];

      const card = list.find((c) => c && c.id === id);
      if (!card) {
        showError("Karte nicht gefunden.");
        return;
      }

      // 4) DOM füllen (sanft, falls Felder fehlen)
      const set = (sel, val) => {
        const n = document.querySelector(sel);
        if (n && val != null && val !== "") n.textContent = String(val);
      };

      set("#card-title", card.title || card.name || "");
      set("#card-series", card.team || card.series || "");
      set("#card-description", card.description || "");
      set("#card-price", card.price != null ? `${card.price} €` : "—");
      set("#card-trend", card.trend != null ? `${card.trend} €` : "—");
      set("#card-limited", card.limited != null ? String(card.limited) : "—");

      const img = document.getElementById("card-image");
      if (img && card.image) {
        img.src = card.image;
        img.alt = card.title || card.name || "Karte";
      }

      const err = document.getElementById("error");
      if (err) err.classList.add("hidden");
    })
    .catch(() => {
      showError("Fehler beim Laden der Karte.");
    });
})();
