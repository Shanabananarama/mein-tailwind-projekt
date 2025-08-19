/* scripts/detail.js — gh-pages safe, gleiche Quelle wie Liste */

/* Hilfen */
function qs(sel) { return document.querySelector(sel); }
function text(node, value) { if (node) node.textContent = value; }
function showError(msg) {
  const el = qs("#detail-error");
  if (el) {
    el.classList.remove("hidden");
    el.innerHTML = `❌ ${msg}`;
  } else {
    alert(msg); // letzte Rettung
  }
}
function showLoading(on) {
  const el = qs("#detail-loading");
  if (!el) return;
  el.classList.toggle("hidden", !on);
}

/* URL-Parameter (lint-sicher, ohne 'URL' no-undef) */
let cardId = null;
try {
  const cur = new window.URL(window.location.href);
  const sp = cur.searchParams;
  cardId = (sp.get("id") || "").trim();
} catch (e) {
  // Fallback: sehr einfache Query-Parser-Variante
  const q = window.location.search.replace(/^\?/, "");
  const m = new Map(q.split("&").map(p => p.split("=").map(decodeURIComponent)));
  cardId = (m.get("id") || "").trim();
}

/* Validierung */
if (!cardId) {
  showError("Keine Karten-ID in der URL gefunden.");
} else {
  init(cardId);
}

/* Kernlogik */
async function init(id) {
  showLoading(true);

  // *** WICHTIG: gleiche Datenquelle wie die Kartenliste ***
  // Die Liste zeigt als Quelle:  api/mocks/cards_page_1.json  (unter /docs/)
  // Auf GitHub Pages liegt das unter /mein-tailwind-projekt/docs/api/mocks/cards_page_1.json
  // Relativ zur detail.html funktioniert deshalb der Pfad:
  const dataUrl = "docs/api/mocks/cards_page_1.json";

  // Cache-Busting optional
  const urlWithCb = `${dataUrl}?cb=${Date.now()}`;

  try {
    const res = await fetch(urlWithCb, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    // Datenformat aus der Liste: { items: [...] }
    const items = Array.isArray(json?.items) ? json.items : [];
    const item = items.find(x => (x?.id || "").trim() === id);

    if (!item) {
      showLoading(false);
      showError("Karte nicht gefunden.");
      return;
    }

    // UI füllen
    text(qs("#card-title"), item.title || "—");
    text(qs("#card-club"), item.club || "—");
    text(qs("#card-id"), item.id || "—");
    text(qs("#card-variant"), item.variant || "—");
    text(qs("#card-rarity"), item.rarity || "—");

    showLoading(false);
  } catch (err) {
    console.error(err);
    showLoading(false);
    showError("Fehler beim Laden der Karte.");
  }
}
