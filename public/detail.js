// public/detail.js
(function () {
  const el = (sel) => document.querySelector(sel);
  const $root = el('#card-detail');
  const $muted = el('.muted');

  function setStatus(msg) {
    if ($muted) $muted.textContent = msg;
  }

  function getId() {
    const p = new URLSearchParams(window.location.search);
    return p.get('id') || '';
  }

  async function loadCard(id) {
    // cards.json liegt im selben Ordner wie detail.html (dist root)
    const res = await fetch('cards.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`cards.json ${res.status}`);
    const list = await res.json();
    return list.find((c) => c.id === id);
  }

  function renderCard(card) {
    if (!$root) return;
    $root.innerHTML = `
      <dt>Name</dt><dd>${card.name}</dd>
      <dt>Club</dt><dd>${card.club ?? '—'}</dd>
      <dt>ID</dt><dd>${card.id}</dd>
      <dt>Variante</dt><dd>${card.variant ?? '—'}</dd>
      <dt>Seltenheit</dt><dd>${card.rarity ?? '—'}</dd>
    `;
  }

  (async function main() {
    try {
      const id = getId();
      if (!id) {
        setStatus('Kein Karten‑ID‑Parameter ?id=…');
        return;
      }
      setStatus('Lade Karte…');
      const card = await loadCard(id);
      if (!card) {
        setStatus('Karte nicht gefunden.');
        return;
      }
      setStatus('');
      renderCard(card);
    } catch (err) {
      console.error(err);
      setStatus('Fehler beim Laden.');
    }
  })();
})();
