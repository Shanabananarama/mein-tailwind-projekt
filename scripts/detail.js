/* eslint-env browser */
/* global fetch */

"use strict";

// Kleine Hilfsfunktion: liest ?id= aus der URL
function getId() {
  const params = new window.URLSearchParams(window.location.search);
  return params.get("id");
}

// Falls du später per API laden willst, kannst du diesen Wert verwenden.
// Aktuell nicht zwingend genutzt – schadet aber nicht.
const API_BASE =
  "https://shanabananarama.github.io/mein-tailwind-projekt/docs/api/mocks";

// Sicheres Setzen von TextContent
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "";
}

// Beispiel: Detaildaten laden (optional; bleibt hier als Vorlage)
async function load() {
  const id = getId();
  if (!id) return;

  // Beispielhafter Lookup in der ersten Seite (du kannst das später umbauen)
  try {
    const res = await fetch(`${API_BASE}/cards_page_1.json`);
    const data = await res.json();
    const card = (data.items || []).find((c) => c.id === id);
    if (!card) return;

    setText("player", card.player);
    setText("franchise", card.franchise);
    setText("number", card.number);
    setText("variant", card.variant ?? "");
    setText("rarity", card.rarity);
  } catch {
    // noop
  }
}

document.addEventListener("DOMContentLoaded", load);
