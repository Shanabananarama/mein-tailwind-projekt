// scripts/detail.js
(function () {
  "use strict";

  // --- DOM helpers
  const $ = (sel) => document.querySelector(sel);
  const show = (el, on = true) => (el && (el.style.display = on ? "" : "none"));
  const text = (sel, value) => {
    const el = $(sel);
    if (el) el.textContent = value ?? "—";
  };

  // --- UI regions (expected in detail.html)
  const $error = $("#card-error");
  const $wrap = $("#card-wrap");
  const $img = $("#card-image");

  // Debug (only renders when ?debug=1)
  const DEBUG = new URL(window.location.href).searchParams.get("debug") === "1";
  const $dbg = $("#debug");
  const log = (...args) => {
    if (DEBUG) {
      console.log("[detail]", ...args);
      if ($dbg) $dbg.textContent += args.map(String).join(" ") + "\n";
      show($dbg, true);
    }
  };

  // --- Hard requirements check
  function fail(msg, extra = {}) {
    log("FAIL:", msg, extra);
    show($wrap, false);
    show($error, true);
  }

  async function main() {
    show($error, false);
    show($wrap, true);
    show($dbg, false);

    // 1) ID stabil ermitteln
    const url = new URL(window.location.href);
    const idRaw = url.searchParams.get("id");
    const id = (idRaw || "").trim();
    log("idRaw:", idRaw, "id:", id);

    if (!id) {
      return fail("missing id");
    }

    // 2) Datenquelle (cache-busting + gh-pages-safe relative Pfade)
    //    Wir unterstützen sowohl Array als auch {cards:[...]}-Formate.
    const dataUrl = `./data/cards.json?cb=${Date.now()}`;
    log("fetch:", dataUrl);

    let json;
    try {
      const res = await fetch(dataUrl, { cache: "no-store" });
      log("res.ok:", res.ok, "status:", res.status);
      if (!res.ok) {
        return fail("fetch not ok", { status: res.status, url: dataUrl });
      }
      json = await res.json();
    } catch (e) {
      return fail("fetch/json error", { e });
    }

    // 3) Kartenliste extrahieren (Array oder {cards:[...]})
    let cards = Array.isArray(json) ? json : (Array.isArray(json?.cards) ? json.cards : null);
    if (!Array.isArray(cards)) {
      return fail("invalid data shape", { gotKeys: Object.keys(json || {}) });
    }
    log("cards.length:", cards.length);

    // 4) Karte suchen (id muss exakt matchen)
    const card = cards.find((c) => (String(c?.id || "").trim() === id));
    log("found card:", !!card);

    if (!card) {
      return fail("card not found", { id, sampleIds: cards.slice(0, 5).map(c => c.id) });
    }

    // 5) Rendern
    try {
      text("#card-title", card.title || card.name || "—");
      text("#card-series", card.series || card.team || "—");
      text("#card-description", card.description || card.note || "—");
      text("#card-price", typeof card.price === "number" ? `${card.price.toFixed(2)} €` : (card.price ?? "—"));
      text("#card-trend", typeof card.trend === "number" ? `${card.trend.toFixed(2)} €` : (card.trend ?? "—"));
      text("#card-limited", (card.limited ?? card.rarity ?? "—"));

      if ($img && card.image) {
        $img.src = card.image;
        $img.alt = card.title || card.name || "Kartenbild";
      }

      show($error, false);
      show($wrap, true);
      log("render OK");
    } catch (e) {
      return fail("render error", { e });
    }
  }

  // Start
  document.addEventListener("DOMContentLoaded", main);
})();
