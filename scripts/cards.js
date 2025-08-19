(function () {
  const loadingEl = document.getElementById('list-loading');
  const errorEl = document.getElementById('list-error');
  const listEl = document.getElementById('list');

  function show(el) { el && (el.style.display = ''); }
  function hide(el) { el && (el.style.display = 'none'); }

  async function load() {
    try {
      hide(errorEl);
      show(loadingEl);

      // Datenquelle relativ zum Page‑Root (funktioniert auf GH Pages):
      const dataUrl = new window.URL('public/cards.json', window.location.href).toString();
      const res = await fetch(`${dataUrl}?cb=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const cards = await res.json();

      listEl.innerHTML = cards.map(c => `
        <div class="card">
          <h2 class="title">
            <a href="detail.html?id=${encodeURIComponent(c.id)}">${c.title}</a>
          </h2>
          <div class="row"><div class="label">Club</div><div>${c.club || '—'}</div></div>
          <div class="row"><div class="label">ID</div><div>${c.id}</div></div>
          <div class="row"><div class="label">Variante</div><div>${c.variant || '—'}</div></div>
          <div class="row"><div class="label">Seltenheit</div><div>${c.rarity || '—'}</div></div>
        </div>
      `).join('');

    } catch (err) {
      console.error(err);
      show(errorEl);
    } finally {
      hide(loadingEl);
    }
  }

  load();
})();
