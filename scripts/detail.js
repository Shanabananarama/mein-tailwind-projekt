/* eslint-env browser */
"use strict";

/**
 * Robustes Detail-Rendering ohne globale URL/URLSearchParams Abhängigkeiten.
 * - Liest ?id=… manuell aus window.location.search (nur window.* verwenden -> lint-safe)
 * - Lädt die gleiche Quelle wie die Kartenübersicht: api/mocks/cards_page_1.json
 * - Handhabt sowohl { cards: [...] } als auch ein reines Array
 * - Rendert saubere Fehlermeldung, wenn Karte nicht gefunden / Fetch-Fehler
 */

const DATA_URL = "api/mocks/cards_page_1.json";

// kleine DOM-Helper
const $ = (sel) => document.querySelector(sel);
const detailsBox = $("#card-details");

// defensive Fallback: existierendes Fehler-Template überschreiben
function showError(message) {
  if (detailsBox) {
    detailsBox.innerHTML =
      '<div class="text-red-600 text-xl flex items-center gap-2">' +
      "<span aria-hidden>❌</span>" +
      `<span>${message}</span>` +
      "</div>";
  } else {
    // falls Struktur anders ist, wenigstens etwas anzeigen
    // eslint-disable-next-line no-alert
    alert(message);
  }
}

function getIdFromSearch() {
  // "?id=card_messi_tc&foo=bar" -> "id=card_messi_tc&foo=bar"
  const raw = (window.location && window.location.search) || "";
  const query = raw.startsWith("?") ? raw.slice(1) : raw;
  if (!query) return "";

  const pairs = query.split("&");
  for (let i = 0; i < pairs.length; i += 1) {
    const kv = pairs[i].split("=");
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

    // Versuche, unterschiedliche Feldnamen robust abzudecken
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

    const desc =
      card.description ||
      card.beschreibung ||
      "";

    const price = card.price != null ? card.price : card.preis;
    const trend = card.trend != null ? card.trend : card.preis_trend;
    const limited =
      card.limited != null ? card.limited : card.limitierung;

    // Ziel-IDs gemäß vorhandener detail.html (#pages & root) abdecken:
    // #card-title, #card-series, #card-description, #card-price, #card-trend, #card-limited, #card-image
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

// Start
render();
