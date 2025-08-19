/* scripts/detail.js — final, gh‑pages safe; no globals, no alerts, lint‑clean */
(function () {
  "use strict";

  /** DOM refs */
  var $error = document.getElementById("error");
  var $wrap = document.getElementById("card-details");
  var $img = document.getElementById("card-image");
  var $title = document.getElementById("card-title");
  var $series = document.getElementById("card-series");
  var $desc = document.getElementById("card-description");
  var $price = document.getElementById("card-price");
  var $trend = document.getElementById("card-trend");
  var $limited = document.getElementById("card-limited");

  function showError() {
    if ($error) $error.classList.remove("hidden");
    if ($wrap) $wrap.classList.add("hidden");
  }

  function showCard() {
    if ($error) $error.classList.add("hidden");
    if ($wrap) $wrap.classList.remove("hidden");
  }

  function getIdFromQuery() {
    try {
      var params = new URL(window.location.href).searchParams;
      var raw = params.get("id");
      if (!raw) return "";
      return decodeURIComponent(String(raw)).trim();
    } catch (e) {
      return "";
    }
  }

  function assignText(el, val, fallback) {
    if (!el) return;
    el.textContent = val != null && String(val).trim() !== "" ? String(val) : fallback;
  }

  function assignImg(el, src, alt) {
    if (!el) return;
    if (src && String(src).trim() !== "") {
      el.src = src;
      el.alt = alt || "Kartenbild";
    } else {
      el.removeAttribute("src");
      el.alt = "";
    }
  }

  function sameId(a, b) {
    return String(a || "").trim() === String(b || "").trim();
  }

  function buildDataUrl() {
    // gh‑pages: relative Pfad aus Projekt‑Root (keine absoluten Domain‑Pfadabhängigkeiten)
    var base = "./data/cards.json";
    var cb = Date.now().toString();
    return base + "?cb=" + cb;
  }

  function pickCard(data, wantedId) {
    if (!data) return null;
    // Unterstützt entweder {cards:[...]} oder direkt ein Array
    var list = Array.isArray(data) ? data : Array.isArray(data.cards) ? data.cards : [];
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      if (sameId(c && c.id, wantedId)) return c;
    }
    return null;
  }

  function render(card) {
    // robuste Fallbacks
    assignText($title, card.title || card.name || card.player || "—", "—");
    assignText($series, card.series || card.team || "—", "—");
    assignText($desc, card.description || card.desc || "—", "—");
    assignText($price, card.price != null ? card.price : "—", "—");
    assignText($trend, card.trend != null ? card.trend : "—", "—");
    assignText($limited, card.limited != null ? card.limited : "—", "—");
    assignImg($img, card.image || card.img || "", $title ? $title.textContent : "Karte");
    showCard();
  }

  function load() {
    var wantedId = getIdFromQuery();
    if (!wantedId) {
      showError();
      return;
    }

    var url = buildDataUrl();

    fetch(url, { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (json) {
        var card = pickCard(json, wantedId);
        if (!card) {
          showError();
          return;
        }
        render(card);
      })
      .catch(function () {
        showError();
      });
  }

  // boot
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", load);
  } else {
    load();
  }
})();
