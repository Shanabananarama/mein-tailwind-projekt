/* eslint-env browser */

// Quelle der Kartenliste (gleich wie auf der Startseite kommuniziert)
const API_URL = "/api/mocks/cards_page_1.json";

// Ziel-Container im cards-Grid
const GRID_ID = "cardsGrid";

// Utility: DOM sicher setzen
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "";
}

// Karte → Detail-URL
function detailUrl(cardId) {
  return `/detail.html?id=${encodeURIComponent(cardId)}`;
}

// Eine Kartenkarte als HTML
function cardItem(card) {
  return `
    <article class="relative bg-white rounded-xl shadow p-5 ring-1 ring-black/5">
      <header class="mb-2">
        <h3 class="text-xl font-semibold leading-tight">${card.player}</h3>
        <p class="text-slate-500">${card.franchise}</p>
      </header>

      <dl class="grid grid-cols-2 gap-y-2 text-sm">
        <div>
          <dt class="text-slate-500">ID</dt>
          <dd class="font-mono">${card.id}</dd>
        </div>
        <div>
          <dt class="text-slate-500">Variante</dt>
          <dd>${card.variant ?? "—"}</dd>
        </div>
        <div>
          <dt class="text-slate-500">Seltenheit</dt>
          <dd>${card.rarity ?? "—"}</dd>
        </div>
      </dl>

      <!-- Klickfläche -->
      <a
        class="absolute inset-0"
        href="${detailUrl(card.id)}"
        aria-label="Öffne Detail zu ${card.player}"
      ></a>
    </article>
  `;
}

// Rendern aller Karten
function renderCards(cards) {
  const grid = document.getElementById(GRID_ID);
  if (!grid) return;

  grid.innerHTML = cards.map(cardItem).join("");
}

// Laden + Fehlerhandling
async function load() {
  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Erwartete Struktur: { cards: [...] }
    const list = Array.isArray(data?.cards) ? data.cards : [];
    renderCards(list);
  } catch (err) {
    console.error("Kartenliste laden fehlgeschlagen:", err);
    setText("cardsError", "Fehler beim Laden der Karten.");
  }
}

// kickoff
load();
