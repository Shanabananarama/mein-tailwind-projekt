/* scripts/detail.js */
(function () {
  "use strict";

  // --- Helpers -------------------------------------------------------------
  function getQueryParam(name) {
    var q = window.location.search;
    if (!q || q.length < 2) {
      return "";
    }
    // remove '?'
    q = q.substring(1);
    var parts = q.split("&");
    for (var i = 0; i < parts.length; i++) {
      var kv = parts[i].split("=");
      var key = decodeURIComponent(kv[0] || "");
      if (key === name) {
        var val = kv.length > 1 ? kv[1] : "";
        // '+' -> space, decodeURIComponent
        return decodeURIComponent(val.replace(/\+/g, " "));
      }
    }
    return "";
  }

  function $(id) {
    return document.getElementById(id);
  }

  function ensureContainer() {
    // bevorzugte Container, ansonsten Body
    return $("card-details") || $("card-container") || document.body;
  }

  function showError(msg) {
    var container = ensureContainer();
    container.innerHTML = "";
    var p = document.createElement("p");
    p.textContent = "❌ " + msg;
    // optisches Feedback, ohne Tailwind-Zwang
    p.style.color = "#dc2626";
    p.style.fontSize = "1.25rem";
    p.style.margin = "1rem 0";
    container.appendChild(p);
  }

  function renderCard(card) {
    var container = ensureContainer();
    container.innerHTML = "";

    var wrap = document.createElement("div");
    wrap.className = "bg-white p-6 rounded-lg shadow";

    var title = document.createElement("h2");
    title.className = "text-2xl font-bold mb-2";
    title.textContent = card.title || card.name || "-";

    var series = document.createElement("p");
    series.className = "text-gray-600 mb-1";
    series.textContent = card.team || card.club || card.series || "";

    var idRow = document.createElement("p");
    idRow.className = "mb-1";
    idRow.innerHTML = "<span class=\"font-semibold\">ID:</span> " + (card.id || "-");

    var variantRow = document.createElement("p");
    variantRow.className = "mb-1";
    variantRow.innerHTML =
      "<span class=\"font-semibold\">Variante:</span> " + (card.variant || "—");

    var rarityRow = document.createElement("p");
    rarityRow.className = "mb-1";
    rarityRow.innerHTML =
      "<span class=\"font-semibold\">Seltenheit:</span> " + (card.rarity || "-");

    wrap.appendChild(title);
    if (series.textContent) {
      wrap.appendChild(series);
    }
    wrap.appendChild(idRow);
    wrap.appendChild(variantRow);
    wrap.appendChild(rarityRow);

    container.appendChild(wrap);
  }

  // --- Flow ----------------------------------------------------------------
  var cardId = getQueryParam("id");
  if (!cardId) {
    showError("Fehler: Keine Karten-ID übergeben.");
    return;
  }

  // gh-pages-sicher: relativer Pfad ab Projektwurzel, Cache-Busting
  var src = "data/cards.json?cb=" + String(Date.now());

  fetch(src, { cache: "no-store" })
    .then(function (res) {
      if (!res || !res.ok) {
        throw new Error("http_" + (res ? res.status : "0"));
      }
      return res.json();
    })
    .then(function (json) {
      var list = [];
      if (json && Object.prototype.toString.call(json) === "[object Array]") {
        list = json;
      } else if (json && json.cards && Object.prototype.toString.call(json.cards) === "[object Array]") {
        list = json.cards;
      }

      var found = null;
      for (var i = 0; i < list.length; i++) {
        if (String(list[i].id) === String(cardId)) {
          found = list[i];
          break;
        }
      }

      if (!found) {
        showError("Karte mit ID \"" + cardId + "\" nicht gefunden.");
        return;
      }

      renderCard(found);
    })
    .catch(function () {
      showError("Fehler beim Laden der Karte.");
    });
})();
