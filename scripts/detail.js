/* eslint-disable no-console */

// ---- Konfiguration ---------------------------------------------------------
const DATA_PATH = 'api/mocks/cards_page_1.json'; // Quelle wie auf cards.html
const SELECTORS = {
  container: 'card-details',       // Haupt-Container zum Befüllen
  errorBox: 'error-message',       // (optional) rotes Fehler-Banner
  sourceHint: 'source-hint'        // (optional) Element für "Quelle: …"
};

// ---- Helfer ----------------------------------------------------------------
/**
 * Liefert eine absolut aufgelöste URL für die Datenquelle.
 * Verhindert relative-Pfad-Fehler auf GitHub Pages.
 */
function makeAbsoluteDataUrl(basePath) {
  const u = new URL(basePath, window.location.href);
  // optionaler Cache-Buster aus der URL (?cb=xyz)
  const cb = new URLSearchParams(window.location.search).get('cb');
  if (cb) u.searchParams.set('cb', cb);
  // zusätzlich sicherstellen, dass die Seite nicht aus dem Cache kommt
  u.searchParams.set('_', Date.now().toString());
  return u.toString();
}

/**
 * Versteckt das Fehler-Element, falls vorhanden.
 */
function hideError() {
  const el = document.getElementById(SELECTORS.errorBox);
  if (el) el.style.display = 'none';
}

/**
 * Zeigt eine kompakte Fehlermeldung (und loggt Details in die Konsole).
 */
function showError(userMsg, err) {
  console.error('[detail]', userMsg, err);
  const el = document.getElementById(SELECTORS.errorBox);
  if (el) {
    el.style.display = '';
    el.textContent = userMsg;
  } else {
    // Fallback, falls es kein dediziertes Fehler-Element gibt:
    alert(userMsg);
  }
}

/**
 * Schreibt „Quelle: …“ (falls Element existiert)
 */
function setSourceHint(absUrl) {
  const el = document.getElementById(SELECTORS.sourceHint);
  if (el) {
    // nur Pfad anzeigen, damit es kurz bleibt
    try {
      const { pathname, search } = new URL(absUrl);
      el.textContent = `${pathname}${search || ''}`;
    } catch {
      el.textContent = absUrl;
    }
  }
}

/**
 * Rendert die Details einer Karte in den Container.
 */
function renderCard(card) {
  const container = document.getElementById(SELECTORS.container);
  if (!container) return;

  // einfache, stabile Darstellung (passt zu Deiner Übersicht)
  container.innerHTML = `
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">${card.player || card.name || '–'}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="text-gray-500">ID</p>
          <p class="text-lg font-semibold">${card.id || '–'}</p>
        </div>
        <div>
          <p class="text-gray-500">Set-ID</p>
          <p class="text-lg font-semibold">${card.set_id || card.setId || '–'}</p>
        </div>
        <div>
          <p class="text-gray-500">Franchise</p>
          <p class="text-lg font-semibold">${card.team || card.franchise || '–'}</p>
        </div>
        <div>
          <p class="text-gray-500">Nummer</p>
          <p class="text-lg font-semibold">${card.number ?? '–'}</p>
        </div>
        <div>
          <p class="text-gray-500">Variante</p>
          <p class="text-lg font-semibold">${card.variant || '–'}</p>
        </div>
        <div>
          <p class="text-gray-500">Seltenheit</p>
          <p class="text-lg font-semibold">${card.rarity || '–'}</p>
        </div>
      </div>
    </div>
  `;
}

// ---- Ablauf ----------------------------------------------------------------
(async function init() {
  try {
    // 1) ID aus Query lesen
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) {
      showError('Fehler beim Laden der Karte: Keine ID übergeben.');
      return;
    }

    // 2) Daten holen (absolut aufgelöst, Cache-sicher)
    const absUrl = makeAbsoluteDataUrl(DATA_PATH);
    setSourceHint(absUrl);

    const res = await fetch(absUrl, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} beim Laden von ${absUrl}`);
    }
    const payload = await res.json();

    // 3) Kartenliste extrahieren (payload kann {cards:[...]} oder direkt [...] sein)
    const items = Array.isArray(payload) ? payload
                 : Array.isArray(payload?.cards) ? payload.cards
                 : [];

    if (!items.length) {
      throw new Error('Keine Karten im Payload gefunden.');
    }

    // 4) Karte nach ID finden
    const card = items.find(c => String(c.id) === String(id));
    if (!card) {
      throw new Error(`Keine Karte mit ID "${id}" gefunden.`);
    }

    // 5) UI aktualisieren
    hideError();
    renderCard(card);
    // Seitentitel hübsch setzen
    const name = card.player || card.name || card.id;
    if (name) document.title = `${name} · Kartendetail`;
  } catch (err) {
    showError('Fehler beim Laden der Karte.', err);
  }
})();
