/* eslint-env browser */
/* global fetch */

"use strict";

const API_BASE =
  "https://shanabananarama.github.io/mein-tailwind-projekt/docs/api/mocks";

/**
 * Safe DOM set helper
 */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "";
}

/**
 * Render full card info – tries IDs first, then falls back to one container.
 */
function renderCard(card) {
  // Preferred: individual fields
  setText("card_player", card.player);
  setText("card_franchise", card.franchise);
  setText("card_number", String(card.number ?? ""));
  setText("card_variant", card.variant ?? "");
  setText("card_rarity", card.rarity ?? "");
  setText("card_set", card.set_id ?? "");

  // Optional title
  setText("card_title", `${card.player ?? "Card"} (${card.franchise ?? ""})`.trim());

  // Fallback: single container
  const container = document.getElementById("card");
  if (container) {
    container.innerHTML = `
      <div class="space-y-1">
        <div><span class="font-semibold">Player:</span> ${card.player ?? ""}</div>
        <div><span class="font-semibold">Franchise:</span> ${card.franchise ?? ""}</div>
        <div><span class="font-semibold">Number:</span> ${card.number ?? ""}</div>
        <div><span class="font-semibold">Variant:</span> ${card.variant ?? ""}</div>
        <div><span class="font-semibold">Rarity:</span> ${card.rarity ?? ""}</div>
        <div><span class="font-semibold">Set:</span> ${card.set_id ?? ""}</div>
      </div>
    `;
  }
}

/**
 * Load cards page 1 and find card by id
 */
async function loadCardById(id) {
  const res = await fetch(`${API_BASE}/cards_page_1.json`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch cards: ${res.status}`);
  const data = await res.json();
  const items = Array.isArray(data.items) ? data.items : data;
  return items.find((c) => c.id === id);
}

/**
 * Entry
 */
(async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) throw new Error("Missing ?id=…");

    const card = await loadCardById(id);
    if (!card) throw new Error(`Card not found: ${id}`);

    renderCard(card);
  } catch (err) {
    console.error(err);
    const container = document.getElementById("card") || document.body;
    const msg = document.createElement("div");
    msg.className = "text-red-600";
    msg.textContent = `Error: ${err.message}`;
    container.appendChild(msg);
  }
})();
