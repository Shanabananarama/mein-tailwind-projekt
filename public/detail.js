// public/detail.js  -> wird nach https://shanabananarama.github.io/mein-tailwind-projekt/detail.js veröffentlicht
(function () {
  const host = document.getElementById('card-detail');
  const put = (html) => {
    if (host) host.innerHTML = html;
    else document.body.insertAdjacentHTML('beforeend', `<div id="card-detail">${html}</div>`);
  };

  // Query-Parameter ?id=...
  const id = new URLSearchParams(location.search).get('id');
  if (!id) {
    put(`<p style="color:#c00">Kein Karten‑ID‑Parameter (?id=...) übergeben.</p>`);
    return;
  }

  // Datenquelle: liegt im Web‑Root (wird aus /public/cards.json veröffentlicht)
  const SOURCE = 'cards.json';

  fetch(SOURCE, { cache: 'no-store' })
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then((data) => {
      const list = Array.isArray(data) ? data : (data.cards || []);
      const card = list.find((c) => String(c.id) === String(id));
      if (!card) {
        put(`<p style="color:#c00">Karte mit ID <code>${id}</code> nicht gefunden.</p>`);
        return;
      }

      put(`
        <article class="detail" style="max-width:900px">
          <h1 style="margin-bottom:1rem">${card.name || 'Unbenannte Karte'}</h1>
          <ul style="line-height:1.8">
            <li><b>ID:</b> ${card.id}</li>
            ${card.club ? `<li><b>Club:</b> ${card.club}</li>` : ''}
            ${card.variant ? `<li><b>Variante:</b> ${card.variant}</li>` : ''}
            ${card.rarity ? `<li><b>Seltenheit:</b> ${card.rarity}</li>` : ''}
          </ul>
        </article>
      `);
    })
    .catch((err) => {
      console.error('detail.js fetch error', err);
      put(`<p style="color:#c00">Datenquelle nicht erreichbar (<code>${SOURCE}</code>).</p>`);
    });
})();
