/* eslint-env browser */
"use strict";

const SOURCE = "api/mocks/cards_page_1.json";

function $(id) {
  return document.getElementById(id);
}

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value ?? "—";
}

function showError(message) {
  const err = $("error");
  if (err) {
    err.classList.remove("hidden");
    err.textContent = `❌ ${message}`;
  } else {
    console.error(message);
    alert(message);
  }
}

(async function main() {
  const src = $("source");
  if (src) src.textContent = SOURCE;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) {
    showError("Keine Karten-ID übergeben (?id=...).");
    return;
  }

  let data;
  try {
    const res = await fetch(SOURCE, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    data = await res.json();
  } catch (err) {
    showError(`Daten konnten nicht geladen werden (${err.message}).`);
    return;
  }

  const items = Array.isArray(data?.items) ? data.items : [];
  const card = items.find((c) => c.id === id);
  if (!card) {
    showError(`Keine Karte mit id='${id}' gefunden.`);
    return;
  }

  setText("title", card.player);
  setText("value-id", card.id);
  setText("value-set", card.set_id);
  setText("value-player", card.player);
  setText("value-franchise", card.franchise);
  setText("value-number", card.number);
  setText("value-variant", card.variant);
  setText("value-rarity", card.rarity);

  const ok = $("ok");
  if (ok) ok.classList.remove("hidden");
})();
