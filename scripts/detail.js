/* eslint-env browser */

(function () {
  // ---- Helpers -------------------------------------------------------------

  const byId = (id) => document.getElementById(id);
  const $title = byId('card-title');         // <h1 id="card-title">Kartendetail</h1> (optional)
  const $container = byId('card-container'); // <div id="card-container"></div>
  const $source = byId('data-source');       // <span id="data-source"></span>
  const $error = byId('card-error');         // <div id="card-error"></div>

  // Robust ermitteln: Projekt-Basispfad (funktioniert lokal & auf GitHub Pages)
  // /mein-tailwind-projekt/detail.html  -> /mein-tailwind-projekt/
  const PROJECT_BASE = location.pathname.replace(/\/[^/]*$/, '/');

  // Einheitliche Datenquelle
  const DATA_PATH_REL = 'api/mocks/cards_page_1.json';
  const DATA_URL = PROJECT_BASE + DATA_PATH_REL;

  // URL-Parameter lesen
  function getQueryId() {
    try {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      return (id && id.trim()) || null;
    } catch {
      return null;
    }
  }

  function renderError(msg) {
    if ($error) {
      $error.textContent = `❌ ${msg}`;
      $error.style.display = 'block';
    }
    if ($container) $container.innerHTML = '';
  }

  function renderCard(card) {
    if ($title) $title.textContent = 'Kartendetail';
    if ($source) $source.textContent = DATA_PATH_REL;

    if (!$container) return;

    const rows = [
      ['ID', card.id],
      ['Set-ID', card.set_id],
      ['Spieler', card.player],
      ['Franchise', card.franchise],
      ['Nummer', card.number ?? '—'],
      ['Variante', card.variant ?? '—'],
      ['Seltenheit', card.rarity ?? '—'],
    ];

    $container.innerHTML = `
      <div class="card">
        <h2>${card.player}</h2>
        <dl>
          ${rows
            .map(
              ([label, value]) => `
              <div class="row">
                <dt>${label}</dt>
                <dd>${value}</dd>
              </div>`
            )
            .join('')}
        </dl>
      </div>
    `;
  }

  // ---- Ablauf --------------------------------------------------------------

  (async function main() {
    const id = getQueryId();
    if (!id) {
      renderError('Kein Karten-Parameter (?id=…) angegeben.');
      return;
    }

    try {
      // Daten laden
      const res = await fetch(DATA_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Karte finden
      const items = Array.isArray(data.items) ? data.items : data;
      const card = (items || []).find((c) => c && c.id === id);

      if (!card) {
        renderError(`Keine Karte mit id="${id}" gefunden.`);
        return;
      }

      // Erfolg
      if ($error) $error.style.display = 'none';
      renderCard(card);
    } catch (e) {
      renderError('Fehler beim Laden der Karte.');
      // Optionale Dev-Info in der Konsole
      console.error('[detail] load error', e);
    }
  })();
})();
