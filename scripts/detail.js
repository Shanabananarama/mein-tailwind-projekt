// scripts/detail.js
// Zeigt eine einzelne Karte aus /mein-tailwind-projekt/cards.json basierend auf ?id=...

(function () {
  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    const { host, titleEl, metaEl, errorBox } = ensureScaffold();

    // ID aus URL holen
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (!id) {
      showError(errorBox, 'Keine Karten-ID in der URL. Beispiel: detail.html?id=card_messi_tc');
      return;
    }

    // Daten-URL robust relativ zum aktuellen Dokument
    const dataURL = new URL('cards.json', document.baseURI).href;

    try {
      const res = await fetch(withNoCache(dataURL), { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

      const json = await res.json();
      const cards = Array.isArray(json) ? json : Array.isArray(json.cards) ? json.cards : [];

      if (!cards.length) throw new Error('Keine Karten im JSON gefunden.');

      // Karte per id suchen (1:1 Abgleich, stringsafe)
      const selected = cards.find((c) => String(c.id ?? c.card_id) === String(id));

      if (!selected) {
        showError(errorBox, `Karte mit ID "${id}" nicht gefunden.`);
        return;
      }

      renderDetail(host, titleEl, metaEl, normalizeCard(selected));
    } catch (err) {
      showError(errorBox, 'Fehler beim Laden der Karte. ' + (err?.message || String(err)));
    }
  }

  function renderDetail(host, titleEl, metaEl, card) {
    titleEl.textContent = card.name || '—';

    // Metadaten
    metaEl.innerHTML = '';
    metaEl.append(
      row('Club', card.club),
      row('ID', card.id),
      row('Variante', card.variant),
      row('Seltenheit', card.rarity)
    );

    // Optional: Bild (wenn im JSON image vorhanden und im /public liegt)
    if (card.image) {
      const img = document.createElement('img');
      img.src = new URL(card.image, document.baseURI).href; // erlaubt „spiderman-card.jpg“
      img.alt = card.name || '';
      img.style.maxWidth = '360px';
      img.style.borderRadius = '12px';
      img.style.marginTop = '16px';
      host.appendChild(img);
    }
  }

  function row(label, value) {
    const line = document.createElement('div');
    line.style.display = 'grid';
    line.style.gridTemplateColumns = '140px 1fr';
    line.style.columnGap = '12px';
    line.style.margin = '8px 0';

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
    return {
      id: c.id ?? c.card_id ?? '',
      name: c.name ?? c.title ?? '—',
      club: c.club ?? c.team ?? '—',
      variant: c.variant ?? c.variante ?? '—',
      rarity: c.rarity ?? c.seltenheit ?? '—',
      image: c.image ?? c.img ?? null
    };
  }

  function ensureScaffold() {
    // Hauptcontainer
    let host = document.querySelector('#card-detail') || document.querySelector('main');
    if (!host) {
      host = document.createElement('main');
      host.style.maxWidth = '900px';
      host.style.margin = '24px auto';
      host.style.padding = '0 16px';
      document.body.appendChild(host);
    }

    // Headline
    let titleEl = document.querySelector('#card-title');
    if (!titleEl) {
      titleEl = document.createElement('h1');
      titleEl.id = 'card-title';
      titleEl.style.fontSize = '2.25rem';
      titleEl.style.fontWeight = '800';
      titleEl.style.margin = '0 0 16px';
      host.appendChild(titleEl);
    }

    // Meta-Wrapper
    let metaEl = document.querySelector('#card-meta');
    if (!metaEl) {
      metaEl = document.createElement('div');
      metaEl.id = 'card-meta';
      host.appendChild(metaEl);
    }

    // Fehlerbox
    let errorBox = document.querySelector('#detail-error');
    if (!errorBox) {
      errorBox = document.createElement('div');
      errorBox.id = 'detail-error';
      errorBox.style.display = 'none';
      errorBox.style.margin = '16px 0';
      errorBox.style.padding = '12px 14px';
      errorBox.style.borderRadius = '8px';
      errorBox.style.background = '#FEE2E2';
      errorBox.style.color = '#991B1B';
      errorBox.style.fontWeight = '600';
      host.parentElement?.insertBefore(errorBox, host);
    }

    // Zurück-Link auffüllen, falls vorhanden
    const back = document.querySelector('[data-back], a.back, .back');
    if (back && !back.getAttribute('href')) back.setAttribute('href', 'cards.html');

    return { host, titleEl, metaEl, errorBox };
  }

  function showError(box, msg) {
    if (!box) { alert(msg); return; }
    box.textContent = msg;
    box.style.display = 'block';
  }

  function withNoCache(url) {
    const u = new URL(url);
    u.searchParams.set('cb', String(Date.now()));
    return u.toString();
  }
})();
