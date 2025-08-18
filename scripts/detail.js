/* eslint-env browser */
"use strict";

/**
 * Robustes Detail-Rendering ohne URL/URLSearchParams.
 * - Liest ?id=… manuell aus window.location.search
 * - Lädt Daten aus api/mocks/cards_page_1.json
 * - Fehlertolerant für unterschiedliche Feldnamen
 */

const DATA_URL = "api/mocks/cards_page_1.json";

// DOM-Helper
const $ = (sel) => document.querySelector(sel);

function provideHostContainer() {
  let box = $("#card-details");
  if (!box) {
    box = document.createElement("div");
    box.id = "card-details";
    box.className = "p-4";
    document.body.appendChild(box);
  }
  return box;
}

function showError(message) {
  const box = provideHostContainer();
  box.innerHTML =
    '<div class="text-red-600 text-xl flex items-center gap-2">' +
    "<span aria-hidden>❌</span>" +
    `<span>${message}</span>` +
    "</div>";
}

function getIdFromSearch() {
  const raw = (window.location && window.location.search) || "";
  const query = raw.startsWith("?") ? raw.slice(1) : raw;
  if (!query) return "";
  const parts = query.split("&");
  for (let i = 0; i < parts.length; i += 1) {
    const kv = parts[i].split("=");
    const key = decodeURIComponent(kv[0] || "");
    if (key === "id") {
      return decodeURIComponent(kv[1] || "");
    }
  }
  return "";
}

function normalizeList(json) {
  if (!json) return [];
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.cards)) return json.cards;
  if (Array.isArray(json.data)) return json.data;
  return [];
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value != null && value !== "" ? String(value) : "—";
}

async function render() {
  const cardId = getIdFromSearch();
  if (!cardId) {
    showError("Fehler beim Laden der Karte.");
    return;
  }

  try {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    const list = normalizeList(json);
    const card = list.find((c) => c.id === cardId);

    if (!card) {
      showError("Karte nicht gefunden.");
      return;
    }

    const title =
      card.title ||
      card.name ||
      card.player ||
      card.spieler ||
      "Karte";

    const series =
      card.series ||
      card.set ||
      card.set_id ||
      card.setId ||
      card.franchise ||
      "";

    const desc = card.description || card.beschreibung || "";

    const price = card.price != null ? card.price : card.preis;
    const trend = card.trend != null ? card.trend : card.preis_trend;
    const limited = card.limited != null ? card.limited : card.limitierung;

    setText("card-title", title);
    setText("card-series", series);
    setText("card-description", desc);
    setText("card-price", price != null ? `${price} €` : "—");
    setText("card-trend", trend != null ? `${trend} €` : "—");
    setText("card-limited", limited != null ? String(limited) : "—");

    const imgEl = document.getElementById("card-image");
    if (imgEl && card.image) {
      imgEl.src = card.image;
      imgEl.alt = title;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("detail.js fetch/render error:", err);
    showError("Fehler beim Laden der Karte.");
  }
}

render();
