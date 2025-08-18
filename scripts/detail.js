/* eslint-env browser */
"use strict";

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function showError(message) {
  setText("card-title", "");
  setText("card-series", "");
  setText("card-description", "");
  setText("card-price", "");
  setText("card-trend", "");
  setText("card-limited", "");
  console.error("[detail]", message);
}

async function loadData() {
  const candidates = [
    "data/cards.json",                  // ✅ Hauptpfad (korrekt für GitHub Pages)
    "./data/cards.json",
    "api/mocks/cards_page_1.json",
    "mocks/cards_page_1.json"
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        return { url, json };
      }
    } catch (_) {
      // nächsten Kandidaten probieren
    }
  }
  throw new Error("Keine Datenquelle erreichbar.");
}

function renderCard(card) {
  setText("card-title", card.title || card.name || "-");
  setText("card-series", card.franchise || card.team || "-");
  setText("card-description", card.description || "");
  setText("card-price", card.price != null ? String(card.price) : "-");
  setText("card-trend", card.trend != null ? String(card.trend) : "-");
  setText("card-limited", card.limited != null ? String(card.limited) : "-");

  const img = document.getElementById("card-image");
  if (img) {
    img.alt = card.title || card.name || "Kartenbild";
    if (card.image) {
      img.src = card.image;
    } else {
      img.removeAttribute("src");
    }
  }
}

async function main() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    showError("Fehlende Karten-ID (?id=...)");
    return;
  }

  try {
    const { json } = await loadData();
    const list = Array.isArray(json) ? json : (Array.isArray(json.cards) ? json.cards : []);
    if (!list.length) throw new Error("Datensatz leer oder unbekanntes Format.");

    const card = list.find((c) => c && (c.id === id));
    if (!card) {
      showError(`Karte mit ID "${id}" nicht gefunden.`);
      return;
    }

    renderCard(card);
  } catch (err) {
    showError("Fehler beim Laden: " + (err.message || String(err)));
  }
}

window.addEventListener("DOMContentLoaded", main);
