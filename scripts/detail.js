/* eslint-env browser */
"use strict";

/**
 * Robuster Loader für die Kartendetail-Seite.
 * - Liest ?id= aus der URL
 * - Versucht mehrere JSON-Pfade (api/, mocks/, docs/)
 * - Rendert die Felder, sonst klare Fehlermeldung
 */

const JSON_SOURCES = [
  "api/mocks/cards_page_1.json",
  "mocks/cards_page_1.json",
  "docs/api/mocks/cards_page_1.json",
];

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "";
}

function resolveRelative(urlLike) {
  // Basis: aktuelles Verzeichnis dieser Seite
  const base = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, "/");
  return new URL(urlLike, base).toString();
}

async function fetchFirstOk(urls) {
  let lastErr = null;
  for (const rel of urls) {
    try {
      const url = resolveRelative(rel);
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) return res.json();
    } catch (e) {
      lastErr = e;
    }
  }
  if (lastErr) throw lastErr;
  throw new Error("Keine Datenquelle erreichbar.");
}

function showError(msg) {
  const box = document.getElementById("error");
  if (box) {
    box.style.display = "block";
    box.textContent = msg;
  }
}

function hideError() {
  const box = document.getElementById("error");
  if (box) box.style.display = "none";
}

async function main() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    showError("Fehlende Karten-ID (?id=...).");
    return;
  }

  let data;
  try {
    data = await fetchFirstOk(JSON_SOURCES);
  } catch (_) {
    showError("Datenquelle nicht erreichbar.");
    return;
  }

  const cards = Array.isArray(data) ? data : (data.cards || data.items || []);
  const card = cards.find((c) => c && c.id === id);

  if (!card) {
    showError(`Keine Karte mit ID „${id}“ gefunden.`);
    return;
  }

  hideError();

  // Mache die häufigsten Feldnamen robust nutzbar
  setText("title", card.player || card.title || card.name || "—");
  setText("club", card.franchise || card.team || card.club || "—");
  setText("id", card.id || "—");
  setText("variant", card.variant || "—");
  setText("rarity", card.rarity || card.seltenheit || "—");
}

document.addEventListener("DOMContentLoaded", () => {
  // Fail-safe: Fehler im Code sauber anzeigen
  main().catch(() => showError("Fehler beim Laden der Karte."));
});
