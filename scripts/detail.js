/* eslint-env browser */

(function () {
  "use strict";

  // UI-Refs
  const elError = document.getElementById("error");
  const elCard = document.getElementById("card");
  const elDebug = document.getElementById("debug");

  const els = {
    title: document.getElementById("title"),
    cid: document.getElementById("cid"),
    setid: document.getElementById("setid"),
    player: document.getElementById("player"),
    franchise: document.getElementById("franchise"),
    number: document.getElementById("number"),
    variant: document.getElementById("variant"),
    rarity: document.getElementById("rarity")
  };

  function show(el) {
    if (el.classList.contains("hidden")) el.classList.remove("hidden");
  }
  function hide(el) {
    if (!el.classList.contains("hidden")) el.classList.add("hidden");
  }
  function fail(msg, debug) {
    elError.textContent = msg;
    show(elError);
    if (debug) {
      elDebug.textContent = debug;
      show(elDebug);
    }
    hide(elCard);
  }

  function success() {
    hide(elError);
    hide(elDebug);
    show(elCard);
  }

  // Sichere Pfadauflösung relativ zu /detail.html
  function apiUrl(relativePath) {
    // detail.html liegt im Repo-Root (GitHub Pages: /mein-tailwind-projekt/)
    const base = window.location.href.replace(/[^/]+$/, "");
    return new URL(relativePath, base).toString();
  }

  async function main() {
    try {
      // 1) id aus Query
      const params = new window.URLSearchParams(window.location.search);
      const id = (params.get("id") || "").trim();
      if (!id) {
        fail("Fehler: Keine Karten-ID in der URL (?id=...) gefunden.");
        return;
      }

      // 2) JSON laden (gleicher Pfad wie auf cards.html)
      const src = apiUrl("api/mocks/cards_page_1.json");
      const res = await fetch(src, { cache: "no-store" });
      if (!res.ok) {
        fail("Fehler: Quelle konnte nicht geladen werden.", `HTTP ${res.status} ${res.statusText}\nURL: ${src}`);
        return;
      }
      const data = await res.json();

      // 3) Datensatz-Struktur robust handhaben:
      //    Erwarte entweder { items: [...] } oder direkt ein Array
      const list = Array.isArray(data) ? data : Array.isArray(data.items) ? data.items : [];
      if (!list.length) {
        fail("Fehler: Die Datenquelle enthält keine Karten.", JSON.stringify(data, null, 2));
        return;
      }

      // 4) Karte nach ID finden
      const card = list.find((c) => (c && (c.id || c.card_id)) === id);
      if (!card) {
        const available = list.slice(0, 20).map((c) => c && (c.id || c.card_id)).filter(Boolean);
        fail(`Karte mit ID „${id}” wurde nicht gefunden.`, `Verfügbare IDs (Auszug):\n${available.join("\n")}`);
        return;
      }

      // 5) Felder abbilden (robust, mit Fallbacks)
      els.title.textContent = [card.player_name || card.player || "—", card.team || card.franchise || ""]
        .filter(Boolean)
        .join(" – ");

      els.cid.textContent = card.id || card.card_id || "—";
      els.setid.textContent = card.set_id || card.set || "—";
      els.player.textContent = card.player_name || card.player || "—";
      els.franchise.textContent = card.team || card.franchise || "—";
      els.number.textContent = String(card.number || card.no || "—");
      els.variant.textContent = card.variant || "—";
      els.rarity.textContent = card.rarity || "—";

      success();
    } catch (err) {
      fail("Unerwarteter Fehler beim Laden der Karte.", String(err && err.stack ? err.stack : err));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();
