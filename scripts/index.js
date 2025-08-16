/* eslint-env browser */
/* global fetch */

"use strict";

const BASE = "https://shanabananarama.github.io/mein-tailwind-projekt/docs/api/mocks";

async function fetchCards() {
  const res = await fetch(`${BASE}/cards_page_1.json`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load cards: ${res.status}`);
  return res.json();
}

function linkToDetail(card) {
  return `detail.html?id=${encodeURIComponent(card.id)}`;
}

function renderList(data) {
  const el = document.getElementById("cards");
  if (!el) return;

  const items = Array.isArray(data.items) ? data.items : data;
  el.innerHTML = items
    .map(
      (c) => `
      <li class="py-2 border-b">
        <a href="${linkToDetail(c)}" class="flex justify-between hover:underline">
          <span class="player">${c.player}</span>
          <span class="franchise text-sm text-gray-500">${c.franchise}</span>
          <span class="rarity text-sm">${c.rarity}</span>
        </a>
      </li>
    `
    )
    .join("");
}

(async () => {
  try {
    const data = await fetchCards();
    renderList(data);
  } catch (err) {
    console.error(err);
  }
})();
