/* scripts/detail.js — stabil, gh-pages-sicher, ohne no-undef */
/* eslint-disable no-console */
(function () {
  'use strict';

  // ---------- kleine Utilities ----------
  const $ = (sel) => document.querySelector(sel);

  const trySet = (selectors, value) => {
    for (const sel of selectors) {
      const el = $(sel);
      if (el) {
        el.textContent = value ?? '—';
        return true;
      }
    }
    return false;
  };

  const showError = (msg) => {
    const candidates = ['#error', '.js-error', '[data-role="error"]'];
    for (const sel of candidates) {
      const el = $(sel);
      if (el) {
        el.style.removeProperty('display');
        el.textContent = msg;
        return;
      }
    }
    console.error(msg);
  };

  const hideError = () => {
    const candidates = ['#error', '.js-error', '[data-role="error"]'];
    for (const sel of candidates) {
      const el = $(sel);
      if (el) el.style.display = 'none';
    }
  };

  // ---------- ID aus Query holen (eslint-safe via window.*) ----------
  const params = new window.URLSearchParams(window.location.search);
  const cardId = (params.get('id') || '').trim();

  if (!cardId) {
    showError('Fehler: Keine Karten-ID in der URL gefunden.');
    return;
  }

  // ---------- Daten laden (gh-pages: relativer Pfad passt) ----------
  // detail.html liegt im Repo-Root → 'data/cards.json' wird zu /mein-tailwind-projekt/data/cards.json
  const dataUrl = `data/cards.json?cb=${Date.now()}`;

  const normalize = (data) => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.cards)) return data.cards;
    if (data && typeof data === 'object') {
      return Object.keys(data).map((k) => ({ id: k, ...data[k] }));
    }
    return [];
  };

  const render = (card) => {
    hideError();

    trySet(['[data-field="title"]', '.js-title', 'h1'], card.title || card.name || '—');
    trySet(['[data-field="club"]', '.js-club'], card.club || card.team || '—');
    trySet(['[data-field="id"]', '.js-id'], card.id || '—');
    trySet(['[data-field="variant"]', '.js-variant'], card.variant || '—');
    trySet(['[data-field="rarity"]', '.js-rarity'], card.rarity || card.seltenheit || '—');
  };

  const run = async () => {
    try {
      const res = await fetch(dataUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const list = normalize(json);

      const card = list.find((c) => (c.id || '').trim() === cardId);
      if (!card) {
        showError(`Karte mit ID „${cardId}“ nicht gefunden.`);
        return;
      }
      render(card);
    } catch (err) {
      console.error(err);
      showError('Fehler beim Laden der Karte.');
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
