/* eslint-env browser */
/* global URLSearchParams, location, fetch */

"use strict";

// Statische Live-Mocks (GitHub Pages)
const BASE = "https://shanabananarama.github.io/mein-tailwind-projekt/docs/api/mocks";

async function fetchCards() {
  const res = await fetch(`${BASE}/cards_page_1.json`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load cards: ${res.status}`);
  return res.json();
}

function getId() {
  const p = new URLSearchParams(location.search);
  return p.get("id");
}

function render(card) {
  const el = document.getElementById("card-detail");
  if (!el) return;

  el.innerHTML = `
    <h2 class="text-xl font-semibold mb-2">${card.player}</h2>
    <ul class="space-y-1">
      <li><strong>ID:</strong> ${card.id}</li>
      <li><strong>Set:</strong> ${card.set_id}</li>
      <li><strong>Franchise:</strong> ${card.franchise}</li>
      <li><strong>Number:</strong> ${card.number}</li>
      <li><strong>Variant:</strong> ${card.variant ?? "-"}</li>
      <li><strong>Rarity:</strong> ${card.rarity}</li>
    </ul>
  `;
}

(async () => {
  try {
    const id = getId();
    if (!id) return;

    const data = await fetchCards();
    const items = Array.isArray(data.items) ? data.items : data;
    const card = items.find((c) => c.id === id);

    if (card) render(card);
  } catch (err) {
    console.error(err);
  }
})();
