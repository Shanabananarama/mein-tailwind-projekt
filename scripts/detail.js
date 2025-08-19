/* eslint-env browser */
(() => {
  "use strict";

  // Utility: safe text setter
  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value != null && value !== "" ? String(value) : "—";
  }

  // Utility: hide generic error text if present
  function hideError() {
    // versucht mehrere mögliche Fehler-Container zu finden
    const candidates = [
      document.getElementById("error-message"),
      document.querySelector("[data-role='error']"),
      ...Array.from(document.querySelectorAll("p,div")).filter((n) =>
        /fehler beim laden der karte/i.test(n.textContent || "")
      )
    ].filter(Boolean);

    candidates.forEach((n) => {
      n.style.display = "none";
    });
  }

  // Utility: show not found
  function showNotFound() {
    // Falls eigene NotFound-Zone existiert
    const notFound = document.getElementById("card-not-found");
    if (notFound) {
      notFound.style.display = "block";
      return;
    }
    // Fallback: schlicht ersetzen
    const msg = document.createElement("div");
    msg.style.color = "#e11d48";
    msg.style.fontWeight = "600";
    msg.style.margin = "1rem 0";
    msg.textContent = "❌ Karte nicht gefunden.";
    document.body.appendChild(msg);
  }

  // Render mit bekannten IDs; wenn diese nicht existieren, wird zusätzlicher Block erzeugt
  function renderCard(card) {
    hideError();

    let rendered = false;
    if (
      document.getElementById("card-title") ||
      document.getElementById("card-series") ||
      document.getElementById("card-description") ||
      document.getElementById("card-price") ||
      document.getElementById("card-trend") ||
      document.getElementById("card-limited")
    ) {
      setText("card-title", card.name || card.title || card.player || "—");
      setText("card-series", card.club || card.team || card.series || "—");
      setText("card-description", card.description || card.note || "—");
      setText("card-price", card.price != null ? card.price : "—");
      setText("card-trend", card.trend != null ? card.trend : "—");
      setText("card-limited", card.rarity || card.limited || "—");
      rendered = true;
    }

    if (!rendered) {
      // Fallback: minimaler, selbsterklärender Block
      const wrap = document.createElement("div");
      wrap.style.margin = "1.5rem 0";
      wrap.style.padding = "1rem";
      wrap.style.background = "#fff";
      wrap.style.borderRadius = "0.75rem";
      wrap.style.boxShadow = "0 1px 2px rgb(0 0 0 / 0.05)";

      const title = document.createElement("h2");
      title.style.fontSize = "1.5rem";
      title.style.fontWeight = "700";
      title.style.margin = "0 0 0.5rem 0";
      title.textContent = card.name || card.title || card.player || "Karte";

      const list = document.createElement("dl");
      list.style.display = "grid";
      list.style.gridTemplateColumns = "max-content 1fr";
      list.style.gap = "0.25rem 1rem";

      const rows = [
        ["ID", card.id],
        ["Verein", card.club || card.team || "—"],
        ["Variante", card.variant || "—"],
        ["Seltenheit", card.rarity || "—"]
      ];

      rows.forEach(([label, value]) => {
        const dt = document.createElement("dt");
        dt.style.color = "#6b7280";
        dt.textContent = label;
        const dd = document.createElement("dd");
        dd.style.fontWeight = "600";
        dd.textContent = value != null && value !== "" ? String(value) : "—";
        list.appendChild(dt);
        list.appendChild(dd);
      });

      wrap.appendChild(title);
      wrap.appendChild(list);
      document.body.appendChild(wrap);
    }
  }

  async function main() {
    // 1) ID aus Query holen – robust & lint-sicher
    const params = new window.URLSearchParams(window.location.search);
    const rawId = (params.get("id") || "").trim();
    if (!rawId) {
      showNotFound();
      return;
    }
    const cardId = decodeURIComponent(rawId);

    // 2) Datenquelle – identisch zur Kartenliste
    //    Kontext: GitHub Pages Projektpfad → relative URL ist stabil
    //    Cache-Busting via Zeitstempel
    const cacheBuster = String(Date.now());
    const DATA_URL = `./api/mocks/cards_page_1.json?cb=${cacheBuster}`;

    let data;
    try {
      const res = await fetch(DATA_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = await res.json();
    } catch (err) {
      // Netz-/Fetchfehler → bestehende Fehlermeldung belassen
      // (Konsole hilft beim Debuggen, UI bleibt freundlich)
      // eslint-disable-next-line no-console
      console.error("Detail fetch failed:", err);
      return;
    }

    // 3) Karte finden (ID exact match)
    const cards = Array.isArray(data) ? data : data?.cards || [];
    const found =
      cards.find((c) => String(c.id).trim() === cardId) ||
      null;

    if (!found) {
      showNotFound();
      return;
    }

    // 4) Rendern
    renderCard(found);
  }

  document.addEventListener("DOMContentLoaded", () => {
    // absichtlich nicht awaiten; UI bleibt responsiv
    main();
  });
})();
