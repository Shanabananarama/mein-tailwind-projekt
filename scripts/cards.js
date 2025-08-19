// scripts/cards.js
// Lädt Karten aus /mein-tailwind-projekt/cards.json und rendert die Liste.
// Robust gegen fehlende Container; zeigt Quelle & Fehler verständlich an.

(function () {
  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    const { container, sourceLabel, errorBox } = ensureScaffold();

    // Daten-URL robust relativ zum aktuellen Dokument auflösen
    const dataURL = new URL('cards.json', document.baseURI).href;

    // Quelle anzeigen (falls vorgesehen)
    if (sourceLabel) {
      sourceLabel.textContent = 'Quelle: ' + dataURL.replace(location.origin, '');
    }

    try {
      const res = await fetch(withNoCache(dataURL), { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

      const json = await res.json();
      // Erlaube beides: [{...}, {...}] ODER { cards: [...] }
      const cards = Array.isArray(json) ? json : Array.isArray(json.cards) ? json.cards : [];

      if (!cards.length) {
        throw new Error('Keine Karten im JSON gefunden.');
      }

      renderList(container, cards);
    } catch (err) {
      showError(errorBox, 'Fehler beim Laden. ' + (err?.message || String(err)));
    }
  }

  function renderList(container, cards) {
    container.innerHTML = ''; // clean slate

    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
    grid.style.gap = '1rem';

    cards.forEach((c) => {
      const card = normalizeCard(c);
      const item = document.createElement('a');
      item.href = 'detail.html?id=' + encodeURIComponent(card.id);
      item.style.textDecoration = 'none';

      const box = document.createElement('div');
      box.style.border = '1px solid rgba(0,0,0,0.1)';
      box.style.borderRadius = '12px';
      box.style.padding = '16px';
      box.style.background = 'rgba(255,255,255,0.7)';
      box.style.backdropFilter = 'blur(2px)';

      const title = document.createElement('h3');
      title.style.margin = '0 0 8px';
      title.style.fontSize = '1.25rem';
      title.style.color = '#111827';
      title.textContent = card.name || '—';

      const club = row('Club', card.club);
      const id = row('ID', card.id);
      const variant = row('Variante', card.variant);
      const rarity = row('Seltenheit', card.rarity);

      box.append(title, club, id, variant, rarity);
      item.appendChild(box);
      grid.appendChild(item);
    });

    container.appendChild(grid);
  }

  function row(label, value) {
    const line = document.createElement('div');
    line.style.display = 'grid';
    line.style.gridTemplateColumns = '120px 1fr';
    line.style.columnGap = '12px';
    line.style.margin = '6px 0';

    const left = document.createElement('div');
    left.style.color = '#6B7280';
    left.textContent = label;

    const right = document.createElement('div');
    right.style.color = '#111827';
    right.style.fontWeight = '600';
    right.textContent = value ?? '—';

    line.append(left, right);
    return line;
  }

  function normalizeCard(c) {
    // Einheitliche Keys erzwingen, falls JSON leicht variiert
    return {
      id: c.id ?? c.card_id ?? '',
      name: c.name ?? c.title ?? '—',
      club: c.club ?? c.team ?? '—',
      variant: c.variant ?? c.variante ?? '—',
      rarity: c.rarity ?? c.seltenheit ?? '—',
    };
  }

  function ensureScaffold() {
    // Container finden oder erzeugen
    let container =
      document.querySelector('#cards') ||
      document.querySelector('#cards-list') ||
      document.querySelector('main');

    if (!container) {
      container = document.createElement('main');
      container.style.maxWidth = '1100px';
      container.style.margin = '24px auto';
      container.style.padding = '0 16px';
      document.body.appendChild(container);
    }

    // Quelle‑Label optional (span#sourcePath oder ähnliches, sonst nichts)
    const sourceLabel =
      document.querySelector('#sourcePath') ||
      document.querySelector('#source') ||
      document.querySelector('[data-source]');

    // Fehlerbox (sichtbar nur bei Fehler)
    let errorBox = document.querySelector('#cards-error');
    if (!errorBox) {
      errorBox = document.createElement('div');
      errorBox.id = 'cards-error';
      errorBox.style.display = 'none';
      errorBox.style.margin = '16px 0';
      errorBox.style.padding = '12px 14px';
      errorBox.style.borderRadius = '8px';
      errorBox.style.background = '#FEE2E2';
      errorBox.style.color = '#991B1B';
      errorBox.style.fontWeight = '600';
      container.parentElement?.insertBefore(errorBox, container);
    }

    return { container, sourceLabel, errorBox };
  }

  function showError(box, msg) {
    if (!box) {
      alert(msg);
      return;
    }
    box.textContent = msg;
    box.style.display = 'block';
  }

  function withNoCache(url) {
    const u = new URL(url);
    u.searchParams.set('cb', String(Date.now()));
    return u.toString();
  }
})();
