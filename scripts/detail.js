/* eslint-env browser */
"use strict";

/**
 * Detailseite – robustes Laden auf GitHub Pages.
 * - Ermittelt Projektbasis
 * - Probiert mehrere _absolute_ Kandidaten-URLs (verhindert 404 durch Basis-Verwechslung)
 * - Sucht Karte rekursiv nach id
 */

(function () {
  // ---------- Projektbasis bestimmen ----------
  var loc = window.location;
  var ORIGIN = loc.origin; // z.B. https://shanabananarama.github.io
  // /mein-tailwind-projekt/detail.html  ->  /mein-tailwind-projekt/
  var PROJECT_BASE = loc.pathname.replace(/[^/]+$/, "");

  // Kandidaten **absolut** (alle realistischen Varianten)
  var CANDIDATES = [
    // relativ zur aktuellen Seite
    new URL("api/mocks/cards_page_1.json", ORIGIN + PROJECT_BASE).href,
    new URL("mocks/cards_page_1.json", ORIGIN + PROJECT_BASE).href,

    // hart kodiert auf Repo-Basis (falls PROJECT_BASE unerwartet abweicht)
    ORIGIN + "/mein-tailwind-projekt/api/mocks/cards_page_1.json",
    ORIGIN + "/mein-tailwind-projekt/mocks/cards_page_1.json",
  ];

  // ---------- Mini-Utils ----------
  var $ = function (sel) { return document.querySelector(sel); };

  function ensureHost() {
    var box = $("#card-details");
    if (!box) {
      box = document.createElement("div");
      box.id = "card-details";
      document.body.appendChild(box);
    }
    return box;
  }

  function showError(msg) {
    var box = ensureHost();
    box.innerHTML =
      '<div class="text-red-600 text-xl flex items-center gap-2">' +
      '<span aria-hidden="true">❌</span><span>' + msg + "</span></div>";
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (!el) return;
    if (value === undefined || value === null || value === "") {
      el.textContent = "—";
    } else {
      el.textContent = String(value);
    }
  }

  function getIdFromQuery() {
    var q = loc.search.replace(/^\?/, "");
    if (!q) return "";
    var parts = q.split("&");
    for (var i = 0; i < parts.length; i += 1) {
      var kv = parts[i].split("=");
      if (decodeURIComponent(kv[0] || "") === "id") {
        return decodeURIComponent(kv[1] || "");
      }
    }
    return "";
  }

  // ---------- Laden mit Fallbacks (absolute URLs) ----------
  function fetchFirstOk(urls) {
    var i = 0;
    return new Promise(function (resolve, reject) {
      function attempt() {
        if (i >= urls.length) {
          reject(new Error("Keine JSON gefunden"));
          return;
        }
        var u = urls[i++];
        fetch(u, { cache: "no-store" })
          .then(function (res) {
            if (!res.ok) throw new Error("HTTP " + res.status + " @ " + u);
            return res.json();
          })
          .then(resolve)
          .catch(function () {
            attempt(); // nächsten Kandidaten probieren
          });
      }
      attempt();
    });
  }

  // ---------- Karte auffinden (id kann tief verschachtelt sein) ----------
  function collectWithId(node, acc) {
    if (!node) return;
    if (Array.isArray(node)) {
      for (var i = 0; i < node.length; i += 1) collectWithId(node[i], acc);
      return;
    }
    if (typeof node === "object") {
      if (Object.prototype.hasOwnProperty.call(node, "id")) acc.push(node);
      for (var k in node) {
        if (Object.prototype.hasOwnProperty.call(node, k)) {
          collectWithId(node[k], acc);
        }
      }
    }
  }
  function findById(json, id) {
    var pool = [];
    collectWithId(json, pool);
    for (var i = 0; i < pool.length; i += 1) {
      var it = pool[i];
      if (it && it.id === id) return it;
    }
    return null;
  }

  // ---------- Main ----------
  (function main() {
    var cardId = getIdFromQuery();
    if (!cardId) { showError("Fehler beim Laden der Karte."); return; }

    fetchFirstOk(CANDIDATES)
      .then(function (json) {
        var card = findById(json, cardId);
        if (!card) { showError("Karte nicht gefunden."); return; }

        var title   = card.title || card.name || card.player || card.spieler || "Karte";
        var series  = card.series || card.set || card.set_id || card.setId || card.franchise || "";
        var desc    = card.description || card.beschreibung || "";
        var price   = (card.price !== undefined ? card.price : card.preis);
        var trend   = (card.trend !== undefined ? card.trend : card.preis_trend);
        var limited = (card.limited !== undefined ? card.limited : card.limitierung);

        setText("card-title", title);
        setText("card-series", series);
        setText("card-description", desc);
        setText("card-price",  (price !== undefined && price !== null) ? (price + " €") : "—");
        setText("card-trend",  (trend !== undefined && trend !== null) ? (trend + " €") : "—");
        setText("card-limited", (limited !== undefined && limited !== null) ? String(limited) : "—");

        var img = document.getElementById("card-image");
        if (img && card.image) {
          img.src = card.image;
          img.alt = title;
        }
      })
      .catch(function () {
        showError("Fehler beim Laden der Karte.");
      });
  })();
})();
