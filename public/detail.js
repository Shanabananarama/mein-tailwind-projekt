// public/detail.js
(() => {
  const byId = (id) => document.getElementById(id);
  const container = byId('card-detail');

  const showError = (msg) => {
    container.innerHTML = `<p class="muted" style="color:#dc2626">✖ ${msg}</p>`;
  };

  // 1) ID aus Query lesen
  let cardId = null;
  try {
    cardId = new URLSearchParams(window.location.search).get('id');
  } catch (_) {
    // Fallback für sehr alte Browser
    const q = window.location.search.replace(/^\?/, '');
    const map = new Map(q.split('&').filter(Boolean).map(s => s.split('=').map(decodeURIComponent)));
    cardId = map.get('id');
  }

  if (!cardId) {
    showError('Keine Karten-ID angegeben. Beispiel: detail.html?id=card_messi_tc');
    return;
  }

  // 2) Datenquelle: build legt cards.json nach /cards.json
  const SOURCE = 'cards.json';

  // 3) Laden
  const load = async () => {
    try {
      const res = await fetch(SOURCE, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const cards = await res.json();

      const card = Array.isArray(cards)
        ? cards.find(c => c.id === cardId)
        : (Array.isArray(cards.cards) ? cards.cards.find(c => c.id === cardId) : null);

      if (!card) {
        showError(`Karte mit ID "${cardId}" nicht gefunden.`);
        return;
      }

      // 4) Render
      container.innerHTML = `
        <article>
          ${card.image ? `<img src="${card.image}" alt="${card.name ?? ''}" loading="lazy" />` : ''}
          <h2 style="margin:.75rem 0 1rem 0">${card.name ?? 'Unbenannte Karte'}</h2>
          <dl>
            <dt>Club</dt><dd>${card.club ?? '—'}</dd>
            <dt>ID</dt><dd>${card.id}</dd>
            <dt>Variante</dt><dd>${card.variant ?? '—'}</dd>
            <dt>Seltenheit</dt><dd>${card.rarity ?? '—'}</dd>
            ${card.series ? `<dt>Serie</dt><dd>${card.series}</dd>` : ''}
            ${card.price ? `<dt>Preis</dt><dd>${card.price}</dd>` : ''}
          </dl>
        </article>
      `;
    } catch (err) {
      console.error('[detail] load failed:', err);
      showError('Datenquelle nicht erreichbar.');
    }
  };

  load();
})();
