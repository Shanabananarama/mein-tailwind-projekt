/* scripts/detail.js – gh-pages safe, lint-clean (doublequotes; no-undef) */
"use strict";

(function () {
  // ---- small utils ---------------------------------------------------------
  function getQueryParamId() {
    var qs = window.location.search || "";
    if (qs.length > 1 && qs.charAt(0) === "?") {
      qs = qs.substring(1);
    }
    if (!qs) return "";
    var id = "";
    var parts = qs.split("&");
    for (var i = 0; i < parts.length; i++) {
      var kv = parts[i].split("=");
      var k = decodeURIComponent(kv[0] || "");
      var v = decodeURIComponent((kv[1] || "").replace(/\+/g, " "));
      if (k === "id") {
        id = (v || "").trim();
        break;
      }
    }
    return id;
  }

  function hideErrorUI() {
    var candidates = document.querySelectorAll(
      "#error, .error, .error-message, .js-error, [data-error]"
    );
    for (var i = 0; i < candidates.length; i++) {
      candidates[i].style.display = "none";
    }
  }

  function showDetailsContainer() {
    var details = document.getElementById("card-details");
    if (details) details.style.display = "";
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

  function renderNotFound(msg) {
    // Keep the existing fallback on the page; additionally, write a hint if slots exist
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

  // ---- main flow -----------------------------------------------------------
  document.addEventListener("DOMContentLoaded", function () {
    (async function () {
      try {
        var id = getQueryParamId();
        if (!id) {
          renderNotFound("Fehlende ID.");
          return;
        }

        // Build data URL relative to current page (gh-pages safe)
        var dataUrl = new window.URL("data/cards.json", window.location.href);
        dataUrl.searchParams.set("v", String(Date.now())); // cache-busting

        var res = await fetch(dataUrl.toString(), { cache: "no-store" });
        if (!res.ok) {
          throw new Error("HTTP " + res.status);
        }

        var json = await res.json();
        var list = pickCardsArray(json);

        // Normalize & match id
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

        // Fill UI (only if elements exist)
        setText("card-title", card.name || card.title || "—");
        setText("card-series", card.team || card.series || "—");
        setText(
          "card-description",
          card.description || card.desc || "—"
        );
        setText("card-price", card.price != null ? String(card.price) + " €" : "—");
        setText("card-trend", card.trend != null ? String(card.trend) + " €" : "—");
        setText("card-limited", card.limited != null ? String(card.limited) : "—");
        setImage("card-image", card.image || card.img || "", card.name || card.title || "");

        hideErrorUI();
        showDetailsContainer();
      } catch (err) {
        // Keep fallback message visible; write minimal diagnostics if slots exist
        setText("card-description", "Ladefehler.");
        // No console/alert to satisfy CI lint & UX
      }
    })();
  });
})();
