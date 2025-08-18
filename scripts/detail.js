/* eslint-env browser */

(function () {
  "use strict";

  // ---------- helpers ----------
  const $ = (id) => document.getElementById(id);
  const setText = (id, v) => { const el = $(id); if (el) el.textContent = v != null && v !== "" ? String(v) : "—"; };
  function showError(message, detail) {
    const host = document.getElementById("detail-root") || document.body;
    const box = document.createElement("div");
    box.style.color = "#d00";
    box.style.fontSize = "clamp(18px,2.2vw,28px)";
    box.style.margin = "24px";
    box.innerHTML = `✖ ${message}${detail ? `<div style="color:#888;font-size:0.9em;margin-top:6px">${detail}</div>` : ""}`;
    host.appendChild(box);
  }

  // ---------- read ?id= ----------
  let cardId = null;
  try { cardId = new URLSearchParams(window.location.search || "").get("id"); } catch (_) {}
  if (!cardId) { showError("Fehler beim Laden der Karte (keine ID übergeben)."); return; }

  // ---------- absolute repo root ----------
  // Z.B. https://shanabananarama.github.io/mein-tailwind-projekt/
  const REPO = "mein-tailwind-projekt";
  const ROOT = `${window.location.origin}/${REPO}/`;

  // Wir versuchen erst die JSON unter /mocks/, dann /api/mocks/
  const SOURCES = [
    `${ROOT}mocks/cards_page_1.json`,
    `${ROOT}api/mocks/cards_page_1.json`
  ];

  function fetchFirstOk(urls) {
    let tried = [];
    return urls.reduce(
      (p, url) =>
        p.catch(() =>
          fetch(url, { cache: "no-store" }).then(async (r) => {
            if (!r.ok) throw new Error(`HTTP ${r.status} @ ${url}`);
            const text = await r.text();
            try { return JSON.parse(text); }
            catch { throw new Error(`Kein gültiges JSON @ ${url}`); }
          })
        ),
      Promise.reject(new Error("init"))
    ).catch((err) => {
      throw new Error(`Quellen versucht: ${urls.join(", ")} — Grund: ${err.message}`);
    });
  }

  fetchFirstOk(SOURCES)
    .then((data) => {
      const items = Array.isArray(data?.items) ? data.items : data;
      const card = Array.isArray(items) ? items.find((c) => c?.id === cardId) : null;

      if (!card) { showError("Karte nicht gefunden."); return; }

      setText("name", card.player || "");
      setText("id", card.id);
      setText("setId", card.set_id);
      setText("player", card.player);
      setText("franchise", card.franchise);
      setText("number", card.number);
      setText("variant", card.variant);
      setText("rarity", card.rarity);
    })
    .catch((e) => { showError("Fehler beim Laden der Karte.", e.message || ""); });
})();
