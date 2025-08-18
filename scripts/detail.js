/* eslint-env browser */
/* global URL, URLSearchParams */
"use strict";

/**
 * Robustes Detail-Rendering: versucht beide Datenpfade (api/mocks/… & mocks/…),
 * löst GitHub-Pages-Basis korrekt auf, rendert sichere DOM-Ausgabe.
 */

(function () {
  const app = document.getElementById("app");
  const statusEl = document.getElementById("status");
  const sourceEl = document.getElementById("source");

  function setStatus(msg, title) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    if (title) statusEl.title = title;
    statusEl.classList.remove("hidden");
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[m]);
  }

  // Repo-Basis für GitHub Pages bestimmen: /<repo>/
  const parts = window.location.pathname.split("/").filter(Boolean);
  const base = parts.length ? `/${parts[0]}/` : "/";

  // Kandidatenpfade (mit und ohne /api/)
  const candidates = [
    `${base}api/mocks/cards_page_1.json`,
    `${base}mocks/cards_page_1.json`
  ];

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) {
    setStatus("✖ Fehlende Karten-ID (?id=...).");
    return;
  }

  async function fetchFirstAvailable(urls) {
    let lastErr;
    for (const href of urls) {
      try {
        const res = await fetch(href, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        if (sourceEl) sourceEl.textContent = href.replace(window.location.origin + "/", "");
        return await res.json();
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr || new Error("Keine Quelle erreichbar");
  }

  function pickArray(payload) {
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.cards)) return payload.cards;
    if (payload && Array.isArray(payload.items)) return payload.items;
    return [];
  }

  fetchFirstAvailable(candidates)
    .then((json) => {
      const cards = pickArray(json);
      const card = cards.find((c) => c && c.id === id);
      if (!card) throw new Error(`Karte nicht gefunden: ${id}`);

      const player = escapeHtml(card.player || card.name || id);
      const setId = escapeHtml(card.set_id || card.set || "-");
      const team = escapeHtml(card.team || card.franchise || "-");
      const number = card.number != null ? escapeHtml(String(card.number)) : "-";
      const variant = escapeHtml(card.variant || "-");
      const rarity = escapeHtml(card.rarity || "-");

      const section = document.createElement("section");
      section.className = "bg-white p-6 rounded-lg shadow";
      section.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">${player}</h2>
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          <div><dt class="text-gray-500">ID</dt><dd class="font-medium">${escapeHtml(card.id)}</dd></div>
          <div><dt class="text-gray-500">Set-ID</dt><dd class="font-medium">${setId}</dd></div>
          <div><dt class="text-gray-500">Franchise</dt><dd class="font-medium">${team}</dd></div>
          <div><dt class="text-gray-500">Nummer</dt><dd class="font-medium">${number}</dd></div>
          <div><dt class="text-gray-500">Variante</dt><dd class="font-medium">${variant}</dd></div>
          <div><dt class="text-gray-500">Seltenheit</dt><dd class="font-medium">${rarity}</dd></div>
        </dl>
      `;

      if (app) app.replaceChildren(section);
    })
    .catch((err) => {
      console.error(err);
      setStatus("✖ Fehler beim Laden der Karte.", String(err && err.message || err));
    });
})();
