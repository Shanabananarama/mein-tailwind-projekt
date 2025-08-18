/* eslint-env browser */
/* global window, document, fetch */

(function () {
  "use strict";

  // ---------- tiny DOM helpers ----------
  const $ = (sel) => document.querySelector(sel);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };

  // ---------- mount target (robust) ----------
  const mount =
    $("#card-details") ||
    $("#app") ||
    (function () {
      const m = document.createElement("div");
      m.id = "card-details";
      document.body.appendChild(m);
      return m;
    })();

  // ---------- error UI ----------
  const showError = (msg, src) => {
    mount.innerHTML = "";
    const wrap = el("div", "mx-auto max-w-5xl p-6");
    const row = el("div", "text-red-600 text-2xl flex items-start gap-3");
    row.appendChild(el("span", "select-none", "❌"));
    row.appendChild(el("p", "", msg));
    wrap.appendChild(row);
    if (src) {
      wrap.appendChild(
        el("p", "mt-3 text-sm text-gray-500", "Quelle: " + src)
      );
    }
    mount.appendChild(wrap);
  };

  // ---------- URL param ----------
  const sp = new URLSearchParams(window.location.search);
  const cardId = sp.get("id");
  if (!cardId) {
    showError("Fehler beim Laden der Karte. (Keine ID übergeben)");
    return;
  }

  // ---------- Datenquellen-Kandidaten (robust für Pages / lokal) ----------
  const base = document.baseURI; // Achtung: auf GH Pages z.B. .../mein-tailwind-projekt/detail.html
  const candidates = [
    new URL("api/mocks/cards_page_1.json", base).href,
    new URL("mocks/cards_page_1.json", base).href,
    // Fallbacks (absolut), falls die Seite nicht unter dem Repo-Präfix läuft
    "/mein-tailwind-projekt/api/mocks/cards_page_1.json",
    "/mein-tailwind-projekt/mocks/cards_page_1.json",
  ];

  // ---------- fetch helper ----------
  const fetchJson = async (url) => {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status + " – " + res.statusText);
    return res.json();
  };

  // ---------- normalize ----------
  const normalize = (json) => {
    if (Array.isArray(json)) return json;
    if (json && Array.isArray(json.cards)) return json.cards;
    if (json && Array.isArray(json.data)) return json.data;
    if (json && json.items && Array.isArray(json.items)) return json.items;
    return [];
  };

  // ---------- render ----------
  const render = (c) => {
    mount.innerHTML = "";

    const grid = el("div", "mx-auto max-w-6xl p-6 grid md:grid-cols-3 gap-6");

    const imgBox = el(
      "div",
      "md:col-span-1 flex items-center justify-center"
    );
    const img = el("img", "rounded-lg shadow max-h-96 object-contain");
    img.alt = c.player || c.title || "Karte";
    img.src =
      c.image ||
      c.img ||
      "data:image/svg+xml;utf8," +
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#9ca3af">Kein Bild</text></svg>'
        );
    imgBox.appendChild(img);

    const box = el("div", "md:col-span-2 bg-white rounded-lg shadow p-6");
    const h = el(
      "h2",
      "text-2xl font-bold mb-4",
      c.player || c.title || "Unbekannte Karte"
    );
    const dl = el("dl", "grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3");
    const row = (dt, dd) => {
      const r = el("div", "flex flex-col");
      r.appendChild(el("dt", "text-sm text-gray-500", dt));
      r.appendChild(el("dd", "text-base text-gray-900", dd ?? "—"));
      return r;
    };

    dl.appendChild(row("ID", c.id));
    dl.appendChild(row("Set-ID", c.set || c.set_id || c.setId));
    dl.appendChild(row("Spieler", c.player || c.title));
    dl.appendChild(row("Franchise", c.franchise || c.team || c.club));
    dl.appendChild(row("Nummer", c.number || c.no));
    dl.appendChild(row("Variante", c.variant));
    dl.appendChild(row("Seltenheit", c.rarity));

    box.appendChild(h);
    box.appendChild(dl);

    grid.appendChild(imgBox);
    grid.appendChild(box);
    mount.appendChild(grid);
  };

  // ---------- run ----------
  (async () => {
    let lastUrl = "";
    try {
      let data = null;
      for (const url of candidates) {
        try {
          lastUrl = url;
          data = await fetchJson(url);
          if (data) break;
        } catch (_) {
          // nächste Kandidaten-URL probieren
        }
      }
      if (!data) {
        showError("Fehler beim Laden der Karte. (Quelle nicht erreichbar)", lastUrl);
        return;
      }

      const cards = normalize(data);
      if (!cards.length) {
        showError("Fehler beim Laden der Karte. (Unbekannte Datenstruktur)", lastUrl);
        return;
      }

      // exakte ID, dann case-insensitive fallback
      let card = cards.find((c) => c && String(c.id) === String(cardId));
      if (!card) {
        const target = String(cardId).toLowerCase();
        card = cards.find(
          (c) => c && c.id && String(c.id).toLowerCase() === target
        );
      }
      if (!card) {
        showError('Fehler beim Laden der Karte. (ID "' + cardId + '" nicht gefunden)', lastUrl);
        return;
      }

      render(card);
    } catch (e) {
      showError("Fehler beim Laden der Karte. (" + e.message + ")", lastUrl);
    }
  })();
})();
