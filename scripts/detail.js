(function () {
  const q = new (window.URLSearchParams)(window.location.search);
  const id = (q.get('id') || '').trim();

  const loadingEl = document.getElementById('detail-loading');
  const errorEl = document.getElementById('detail-error');

  const titleEl = document.getElementById('card-title');
  const clubEl = document.getElementById('card-club');
  const idEl = document.getElementById('card-id');
  const variantEl = document.getElementById('card-variant');
  const rarityEl = document.getElementById('card-rarity');

  function show(el) { el && (el.style.display = ''); }
  function hide(el) { el && (el.style.display = 'none'); }

  async function load() {
    try {
      if (!id) throw new Error('missing id');
      hide(errorEl); show(loadingEl);

      const dataUrl = new window.URL('public/cards.json', window.location.href).toString();
      const res = await fetch(`${dataUrl}?cb=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const cards = await res.json();

      const card = cards.find(c => (c.id || '').trim() === id);
      if (!card) throw new Error('card not found');

      titleEl.textContent = card.title || '—';
      clubEl.textContent = card.club || '—';
      idEl.textContent = card.id || '—';
      variantEl.textContent = card.variant || '—';
      rarityEl.textContent = card.rarity || '—';
    } catch (err) {
      console.error(err);
      show(errorEl);
    } finally {
      hide(loadingEl);
    }
  }

  load();
})();
