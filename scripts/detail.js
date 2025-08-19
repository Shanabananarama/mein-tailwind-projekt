/* scripts/detail.js — lädt dieselbe Datenquelle wie cards.html (gh-pages-safe) */
/* eslint-disable no-console */

(function () {
  const qs = new URLSearchParams(window.location.search);
  const wantedId = (qs.get("id") || "").trim();

  // Element-Hilfen
  const $ = (sel) => document.querySelector(sel);
  const mount =
    $("#card-details") || $("#detail") || $("#app") || $("main") || document.body;

  const showError = (msg) => {
    mount.innerHTML = `
      <div style="color:#dc2626;font-size:1.25rem;display:flex;gap:.5rem;align-items:center;">
        <span style="font-size:1.5rem">❌</span>
        <span>${msg}</span>
      </div>
    `;
  };

  if (!wantedId) {
    showError("Keine Karten-ID übergeben.");
    return;
  }

  // Wichtig: exakt dieselbe Quelle wie die Kartenliste
  // Relativer Pfad funktioniert unter GitHub Pages automatisch:
  // /mein-tailwind-projekt/detail.html → /mein-tailwind-projekt/api/mocks/cards_page_1.json
  const DATA_URL = `api/mocks/cards_page_1.json?cb=${Date.now()}`;

  const safeText = (v, fallback = "—") =>
    v === null || v === undefined || `${v}`.trim() === "" ? fallback : String(v);

  const renderCard = (card) => {
    // Fallback: Wenn bestimmte Felder im JSON anders heißen, zeigen wir alles roh an
    const title =
      card.title ||
      card.name ||
      card.player ||
      card.cardTitle ||
      "Karte";

    const team = card.team || card.club || card.series || "—";
    const variant = card.variant || card.parallel || "—";
    const rarity = card.rarity || card.seltenheit || "—";
    const img = card.image || card.img || card.picture || "";

    mount.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row gap-6">
        <div class="flex-shrink-0 w-full md:w-1/3 flex items-center justify-center">
          ${
            img
              ? `<img src="${img}" alt="${safeText(title)}" class="rounded-lg shadow max-h-96 object-contain"/>`
              : `<div class="rounded-lg border border-gray-200 text-gray-500 p-8 text-center w-full">Kein Bild</div>`
          }
        </div>

        <div class="flex-1">
          <h1 class="text-2xl font-bold mb-2">${safeText(title)}</h1>
          <p class="text-gray-600 mb-1">Team/Serie: ${safeText(team)}</p>
          <p class="text-gray-500 italic mb-4">ID: ${safeText(card.id)}</p>
          <p class="text-lg"><strong>Variante:</strong> ${safeText(variant)}</p>
          <p class="text-lg"><strong>Seltenheit:</strong> ${safeText(rarity)}</p>

          <details class="mt-6">
            <summary class="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Rohdaten anzeigen
            </summary>
            <pre class="mt-2 bg-gray-50 p-3 rounded text-xs overflow-auto">${safeText(
              JSON.stringify(card, null, 2),
              "{}"
            )}</pre>
          </details>
        </div>
      </div>
    `;
  };

  const run = async () => {
    try {
      const res = await fetch(DATA_URL, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Fetch ${DATA_URL} → HTTP ${res.status}`);
      }
      const json = await res.json();

      // Datei kann Array oder { cards:[...] } sein – beide Fälle sauber unterstützen
      const list = Array.isArray(json) ? json : json.cards || json.data || [];
      if (!Array.isArray(list) || list.length === 0) {
        showError("Datenquelle leer oder unbekanntes Format.");
        return;
      }

      const found =
        list.find((c) => (c.id || "").trim() === wantedId) ||
        list.find((c) => (c.slug || "").trim() === wantedId) ||
        null;

      if (!found) {
        showError(`Karte mit ID „${wantedId}” nicht gefunden.`);
        return;
      }

      renderCard(found);
    } catch (err) {
      console.error(err);
      showError("Fehler beim Laden der Karte.");
    }
  };

  run();
})();
