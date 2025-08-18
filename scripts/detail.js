/* eslint-env browser */
/* global URLSearchParams, location */

(() => {
  // UI-Helfer
  const showError = (msg) => {
    const el = document.getElementById('error');
    if (el) {
      el.textContent = msg;
      el.classList.remove('hidden');
    } else {
      // Fallback falls kein dediziertes Error-Element existiert
      alert(msg); // eslint-disable-line no-alert
    }
  };

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  try {
    // 1) ID aus Query lesen (robust + ESLint-safe)
    const params = new URLSearchParams(window.location.search || location.search);
    const cardId = params.get('id');

    if (!cardId) {
      showError('Es wurde keine Karten-ID übergeben (?id=...).');
      return;
    }

    // 2) Datenquelle robust relativ zur aktuellen Seite auflösen
    //    -> funktioniert auf GitHub Pages unabhängig vom Repo-Subpfad
    const dataUrl = new URL('./api/mocks/cards_page_1.json', window.location.href).toString();

    // 3) Daten laden
    fetch(dataUrl, { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} beim Laden der Daten`);
        }
        return res.json();
      })
      .then((json) => {
        const items = Array.isArray(json?.items) ? json.items : json;
        if (!Array.isArray(items)) {
          throw new Error('Unerwartetes Datenformat (keine items-Liste)');
        }

        const card = items.find((it) => it?.id === cardId);
        if (!card) {
          throw new Error(`Keine Karte mit ID „${cardId}“ gefunden.`);
        }

        // 4) UI füllen – IDs bitte an Dein Markup anpassen
        setText('card-title', card.player || card.title || '—');
        setText('card-series', card.franchise || card.series || '—');
        setText('card-description', card.description || '—');
        setText('card-price', card.price != null ? String(card.price) : '—');
        setText('card-trend', card.trend != null ? String(card.trend) : '—');
        setText('card-limited', card.rarity || card.variant || '—');

        const imgEl = document.getElementById('card-image');
        if (imgEl && card.image) imgEl.src = card.image;

        // Fehlerhinweis ausblenden, falls vorhanden
        const errEl = document.getElementById('error');
        if (errEl) errEl.classList.add('hidden');
      })
      .catch((err) => {
        showError(`Fehler beim Laden der Karte: ${err.message}`);
      });
  } catch (err) {
    showError(`Fehler beim Initialisieren: ${err.message}`);
  }
})();
