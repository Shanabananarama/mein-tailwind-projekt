/* scripts/cards.js — robust gegen Array oder { cards: [...] } */

(() => {
  const $ = (sel) => document.querySelector(sel);

  // Anzeige der Quelle (nur Infozeile)
  const srcEl = $("#cards-source") || $("#source") || $("#quelle");
  if (srcEl) srcEl.textContent = "cards.json";

  // Status-Helfer
  const setStatus = (msg) => {
    const s = $("#cards-status") || $("#status");
    if (s) s.textContent = msg || "";
  };

  const container =
    $("#cards") || $("#cards-list") || $("#list") || $("#container") || document.body;

  const toArray = (json) => {
    if (Array.isArray(json)) return json;
    if (json && Array.isArray(json.cards)) return json.cards;
    return [];
  };

  const url = new URL("cards.json", location.href); // /mein-tailwind-projekt/cards.json

  setStatus("Lade Karten…");

  fetch(url, { cache: "no-store" })
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then((json) => {
      const cards = toArray(json);

      if (!cards.length) {
        setStatus("Keine Karten gefunden.");
        container.innerHTML = "";
        return;
      }

      // Sehr einfache Liste (keine Styles nötig)
      const html = cards
        .map((c) => {
          const id = c.id ?? "";
          const name = c.name ?? "—";
          const club = c.club || c.team || "";
          return `
            <a class="card" href="detail.html?id=${encodeURIComponent(id)}">
              <h3>${name}</h3>
              ${club ? `<div class="muted">${club}</div>` : ""}
              <div class="muted">ID: ${id}</div>
            </a>
          `;
        })
        .join("");

      container.innerHTML = html;
      setStatus("");
    })
    .catch((err) => {
      console.error("[cards.js] Ladefehler:", err);
      setStatus("Fehler beim Laden.");
      container.innerHTML = "";
    });
})();
