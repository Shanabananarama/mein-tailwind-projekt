/* eslint-disable no-console */

(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);

  function repoBase() {
    // funktioniert lokal ("/") und auf GitHub Pages ("/mein-tailwind-projekt/")
    const PATH = window.location.pathname;
    return PATH.includes("/mein-tailwind-projekt/")
      ? "/mein-tailwind-projekt/"
      : "/";
  }

  function makeUrl(relative) {
    const base = window.location.origin + repoBase();
    return new window.URL(relative, base).toString();
  }

  function getCardId() {
    const params = new window.URLSearchParams(window.location.search);
    return params.get("id");
  }

  function hideError() {
    const candidates = [
      "#error",
      "#loadError",
      ".error",
      '[data-role="load-error"]'
    ];
    for (const sel of candidates) {
      const el = $(sel);
      if (el) {
        el.style.display = "none";
      }
    }
  }

  function renderCard(card) {
    hideError();

    const host = $("#card-details") || document.body;

    const title =
      card.title ||
      card.name ||
      card.player ||
      card.spieler ||
      "Unbenannte Karte";

    const rows = [
      ["ID", card.id || card.card_id || "—"],
      ["Set-ID", card.set_id || card.set || "—"],
      ["Spieler", card.spieler || card.player || title || "—"],
      ["Franchise", card.franchise || card.team || card.club || "—"],
      ["Nummer", card.number || card.nummer || "—"],
      ["Variante", card.variant || card.variante || "—"],
      ["Seltenheit", card.rarity || card.seltenheit || "—"]
    ];

    host.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow flex flex-col gap-4 w-full">
        <h1 class="text-2xl font-bold">${title}</h1>
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
          ${rows
            .map(
              ([k, v]) => `
            <div class="flex flex-col">
              <dt class="text-gray-500">${k}</dt>
              <dd class="font-medium">${String(v)}</dd>
            </div>`
            )
            .join("")}
        </dl>
      </div>
    `;
  }

  function showNotFound(id) {
    const host = $("#card-details") || document.body;
    host.innerHTML = `
      <div class="text-red-600 text-lg font-semibold">Karte mit ID "${id}" nicht gefunden.</div>
    `;
  }

  async function load() {
    try {
      const id = getCardId();
      if (!id) {
        showNotFound("—");
        return;
      }

      // GitHub Pages Quelle
      const url = makeUrl("api/mocks/cards_page_1.json");
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        throw new Error("HTTP " + res.status);
      }

      const json = await res.json();
      const cards = Array.isArray(json)
        ? json
        : json.cards || json.items || json.data || json.results || [];

      const card =
        cards.find((c) => c.id === id || c.card_id === id) || null;

      if (!card) {
        showNotFound(id);
        return;
      }

      renderCard(card);
    } catch (err) {
      console.error("Detail-Fehler:", err);
    }
  }

  document.addEventListener("DOMContentLoaded", load);
})();
