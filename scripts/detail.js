/* scripts/detail.js – lint-clean (keine globalen URL/URLSearchParams), gh-pages safe */
"use strict";

(function () {
  // -------- helpers ---------------------------------------------------------
  function getQueryParamId() {
    var qs = window.location.search || "";
    if (qs && qs.charAt(0) === "?") qs = qs.substring(1);
    if (!qs) return "";
    var pairs = qs.split("&");
    for (var i = 0; i < pairs.length; i++) {
      var kv = pairs[i].split("=");
      var k = decodeURIComponent(kv[0] || "");
      if (k === "id") {
        var v = decodeURIComponent((kv[1] || "").replace(/\+/g, " "));
        return (v || "").trim();
      }
    }
    return "";
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function setImage(id, src, alt) {
    var el = document.getElementById(id);
    if (el && src) {
      el.setAttribute("src", src);
      if (alt) el.setAttribute("alt", alt);
    }
  }

  function hideErrorUI() {
    var nodes = document.querySelectorAll("#error, .error, .error-message, .js-error, [data-error]");
    for (var i = 0; i < nodes.length; i++) nodes[i].style.display = "none";
  }

  function showDetailsContainer() {
    var wrap = document.getElementById("card-details");
    if (wrap) wrap.style.display = "";
  }

  function renderNotFound(msg) {
    setText("card-title", "Nicht gefunden");
    setText("card-description", msg || "Keine Karte mit dieser ID.");
  }

  function pickCardsArray(json) {
    if (!json) return [];
    if (Array.isArray(json)) return json;
    if (Array.isArray(json.cards)) return json.cards;
    if (Array.isArray(json.items)) return json.items;
    if (Array.isArray(json.data)) return json.data;
    return [];
  }

  // -------- main ------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", function () {
    (async function () {
      try {
        var id = getQueryParamId();
        if (!id) {
          renderNotFound("Fehlende ID.");
          return;
        }

        // relative zum Projekt-Root (detail.html liegt im Root)
        var url = "data/cards.json?v=" + String(Date.now());

        var res = await fetch(url, { cache: "no-store" });
        if (!res || !res.ok) {
          renderNotFound("Daten nicht erreichbar.");
          return;
        }

        var json = await res.json();
        var list = pickCardsArray(json);

        var needle = id.trim();
        var card = null;
        for (var i = 0; i < list.length; i++) {
          var c = list[i] || {};
          var cid = (c.id || "").trim();
          if (cid === needle) {
            card = c;
            break;
          }
        }

        if (!card) {
          renderNotFound("Karte nicht gefunden: " + needle);
          return;
        }

        // Werte in DOM schreiben (nur wenn Slots existieren)
        setText("card-title", card.name || card.title || "—");
        setText("card-series", card.team || card.series || "—");
        setText("card-description", card.description || card.desc || "—");
        setText("card-price", card.price != null ? String(card.price) + " €" : "—");
        setText("card-trend", card.trend != null ? String(card.trend) + " €" : "—");
        setText("card-limited", card.limited != null ? String(card.limited) : "—");
        setImage("card-image", card.image || card.img || "", card.name || card.title || "");

        hideErrorUI();
        showDetailsContainer();
      } catch (_e) {
        // Fallback sichtbar lassen, kein alert/console (lint / UX)
        setText("card-description", "Ladefehler.");
      }
    })();
  });
})();
