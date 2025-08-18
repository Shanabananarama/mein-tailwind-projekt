// scripts/detail.js (ES-Modul, keine externen Imports)

const errorEl   = document.getElementById("detail-error");
const imgEl     = document.getElementById("card-image");
const titleEl   = document.getElementById("card-title");
const seriesEl  = document.getElementById("card-series");
const descEl    = document.getElementById("card-description");
const priceEl   = document.getElementById("card-price");
const trendEl   = document.getElementById("card-trend");
const limitedEl = document.getElementById("card-limited");

function showError() {
  if (errorEl) errorEl.classList.remove("hidden");
}
function hideError() {
  if (errorEl) errorEl.classList.add("hidden");
}

// ID aus URL holen
const params = new URLSearchParams(window.location.search);
const cardId = params.get("id");
if (!cardId) {
  showError();
  throw new Error("Missing ?id=");
}

// gleiche Datenquelle wie auf der Kartenliste
const dataUrl = new URL("api/mocks/cards_page_1.json", window.location.href);

fetch(dataUrl.toString(), { cache: "no-store" })
  .then((r) => {
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  })
  .then((json) => {
    // Datenstruktur robust handhaben
    const list = Array.isArray(json) ? json : (json.cards || json.items || []);
    const card = list.find((c) => c && c.id === cardId);

    if (!card) {
      showError();
      return;
    }

    hideError();

    titleEl.textContent   = card.player || card.title || card.name || "—";
    seriesEl.textContent  = card.franchise || card.team || card.series || "—";
    descEl.textContent    = card.variant || card.description || card.rarity || "—";
    if (priceEl)  priceEl.textContent  = card.price ?? "—";
    if (trendEl)  trendEl.textContent  = card.trend ?? "—";
    if (limitedEl) limitedEl.textContent = (card.limited != null ? String(card.limited) : (card.rarity || "—"));

    if (imgEl) {
      if (card.image) {
        imgEl.src = card.image;
        imgEl.alt = titleEl.textContent;
      } else {
        // wenn kein Bild vorhanden, Platzhalter verstecken
        imgEl.removeAttribute("src");
        imgEl.classList.add("opacity-0");
      }
    }
  })
  .catch((err) => {
    console.error(err);
    showError();
  });
