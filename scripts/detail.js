/* eslint-env browser */
"use strict";

/**
 * Detailseite: robustes Laden der Karten-JSON auf GitHub Pages.
 * - Ermittelt das Projekt-Basisverzeichnis aus der aktuellen URL
 * - Versucht exakt zwei gültige Pfade relativ zu dieser Basis:
 *     {BASE}api/mocks/cards_page_1.json
 *     {BASE}mocks/cards_page_1.json
 * - Findet die Karte mit id===… auch bei verschachtelten JSON-Strukturen
 */

(function () {
  // -------- Basis (funktioniert sicher auf GitHub Pages Projekt-Sites) --------
  // Beispiel: /mein-tailwind-projekt/detail.html  ->  BASE = "/mein-tailwind-projekt/"
  var PATH = (window.location && window.location.pathname) || "/";
  var BASE = PATH.replace(/[^/]+$/, "");

  var CANDIDATES = [
    BASE + "api/mocks/cards_page_1.json",
    BASE + "mocks/cards_page_1.json",
  ];

  // -------- Mini-DOM-Helpers --------
  var $ = function (sel) { return document.querySelector(sel); };

  function ensureHost() {
    var box = $("#card-details");
    if (!box) {
      box = document.createElement("div");
      box.id = "card-details";
      box.className = "p-4";
      document.body.appendChild(box);
    }
    return box;
  }

  function showError(msg) {
    var box = ensureHost();
    box.innerHTML =
      '<div class="text-red-600 text-xl flex items-center gap-2">' +
      '<span aria-hidden>❌</span><span>' + msg + "</span></div>";
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = (value !== undefined && value !== null && value !== "") ? String(value) : "—";
  }

  function getId() {
    var search = (window.location && window.location.search) || "";
    if (!search) return "";
    var q = search.charAt(0) === "?" ? search.slice(1) : search;
    var parts = q.split("&");
    for (var i = 0; i < parts.length; i += 1) {
      var kv = parts[i].split("=");
      var k = decodeURIComponent(kv[0] || "");
      if (k === "id") return decodeURIComponent(kv[1] || "");
    }
    return "";
  }

  // -------- JSON laden (zwei korrekte Kandidaten relativ zur Projektbasis) --------
  function fetchFirstOk(urls) {
    var idx = 0;
    return new Promise(function (resolve, reject) {
      function next() {
        if (idx >= urls.length) {
          reject(new Error("Keine JSON gefunden"));
          return;
        }
        var u = urls[idx++];
        fetch(u, { cache: "no-store" })
          .then(function (res) {
            if (!res.ok) throw new Error("HTTP " + res.status + " @ " + u);
            return res.json();
          })
          .then(resolve)
          .catch(function () { next(); });
      }
      next();
    });
  }

  // -------- Karte in beliebiger Struktur finden --------
  function collectWithId(root, acc) {
    if (!root) return;
    if (Array.isArray(root)) {
      for (var i = 0; i < root.length; i += 1) collectWithId(root[i], acc);
      return;
    }
    if (typeof root === "object") {
      if (root.id) acc.push(root);
      for (var k in root) {
        if (Object.prototype.hasOwnProperty.call(root, k)) {
          collectWithId(root[k], acc);
        }
      }
    }
  }

  function findById(json, id) {
    var pool = [];
    collectWithId(json, pool);
    for (var i = 0; i < pool.length; i += 1) {
      if (pool[i] && pool[i].id === id) return pool[i];
    }
    return null;
  }

  // -------- Main --------
  (function main() {
    var id = getId();
    if (!id) { showError("Fehler beim Laden der Karte."); return; }

    fetchFirstOk(CANDIDATES)
      .then(function (json) {
        var card = findById(json, id);
        if (!card) { showError("Karte nicht gefunden."); return; }

        var title  = card.title || card.name || card.player || card.spieler || "Karte";
        var series = card.series || card.set || card.set_id || card.setId || card.franchise || "";
        var desc   = card.description || card.beschreibung || "";
        var price  = (card.price !== undefined ? card.price : card.preis);
        var trend  = (card.trend !== undefined ? card.trend : card.preis_trend);
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
      .catch(function () { showError("Fehler beim Laden der Karte."); });
  })();
})();
