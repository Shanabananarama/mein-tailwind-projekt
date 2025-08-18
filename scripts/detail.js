/* eslint-env browser */
"use strict";

/**
 * Detailseite – robustes Laden:
 * - Liest ?id=… manuell
 * - Probiert mehrere mögliche JSON-Pfade (GH Pages /dist-Artefakt / legacy)
 * - Sauberes Fehler-UI, keine no-undef-Verstöße
 */

const CANDIDATE_URLS = [
  // bevorzugt wie auf der Kartenliste
  "api/mocks/cards_page_1.json",
  "./api/mocks/cards_page_1.json",
  // projekt-Root absolut (GitHub Pages Projektseite)
  "/mein-tailwind-projekt/api/mocks/cards_page_1.json",
  // fallback auf legacy-Struktur
  "mocks/cards_page_1.json",
  "./mocks/cards_page_1.json",
  "/mein-tailwind-projekt/mocks/cards_page_1.json"
];

// ---------- DOM helpers ----------

const $ = (sel) => document.querySelector(sel);

function ensureHost() {
  let box = $("#card-details");
  if (!box) {
    box = document.createElement("div");
    box.id = "card-details";
    box.className = "p-4";
    document.body.appendChild(box);
  }
  return box;
}

function showError(msg) {
  const box = ensureHost();
  box.innerHTML =
    '<div class="text-red-600 text-xl flex items-center gap-2">' +
    "<span aria-hidden>❌</span>" +
    `<span>${msg}</span>` +
    "</div>";
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value != null && value !== "" ? String(value) : "—";
}

function getIdFromSearch() {
  const search = (window.location && window.location.search) || "";
  if (!search) return "";
  const q = search[0] === "?" ? search.slice(1) : search;
  const parts = q.split("&");
  for (let i = 0; i < parts.length; i += 1) {
    const [k, v] = parts[i].split("=");
    if (decodeURIComponent(k || "") === "id") {
      return decodeURIComponent(v || "");
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

// ---------- robust fetch mit Fallback-Kandidaten ----------

async function fetchFirstOk(urls) {
  let lastErr = null;
  for (let i = 0; i < urls.length; i += 1) {
    const u = urls[i];
    try {
      const res = await fetch(u, { cache: "no-store" });
      if (res.ok) {
        return res.json();
      }
      lastErr = new Error(`HTTP ${res.status} @ ${u}`);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("Kein Kandidaten-URL erfolgreich");
}

// ---------- main ----------

async function main() {
  const id = getIdFromSearch();
  if (!id) {
    showError("Fehler beim Laden der Karte.");
    return;
  }

  try {
    const json = await fetchFirstOk(CANDIDATE_URLS);
    const list = normalizeList(json);
    const card = list.find((c) => c && c.id === id);

    if (!card) {
      // Karte existiert nicht in der Nutzlast
      showError("Karte nicht gefunden.");
      return;
    }

    const title = card.title || card.name || card.player || card.spieler || "Karte";
    const series =
      card.series || card.set || card.set_id || card.setId || card.franchise || "";
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

    const img = document.getElementById("card-image");
    if (img && card.image) {
      img.src = card.image;
      img.alt = title;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[detail] load error:", err);
    showError("Fehler beim Laden der Karte.");
  }
}

main();
