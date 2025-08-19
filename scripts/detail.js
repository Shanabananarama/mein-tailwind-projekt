/* scripts/detail.js — gh-pages safe, ohne URL/URLSearchParams */
(function () {
  "use strict";

  // ---- Helpers ------------------------------------------------------------
  function $(id) { return document.getElementById(id); }

  function showError(msg) {
    var box = $("error");
    if (!box) return;
    box.textContent = msg || "Fehler beim Laden der Karte.";
    box.style.display = "block";
    var detail = $("detail");
    if (detail) detail.style.display = "none";
  }

  // Query-Param "id" ohne URL/URLSearchParams parsen (ESLint no-undef safe)
  function readCardId() {
    var search = window.location.search.replace(/^\?/, "");
    if (!search) return null;
    var parts = search.split("&");
    for (var i = 0; i < parts.length; i++) {
      var kv = parts[i].split("=");
      if (kv[0] === "id") {
        try {
          return decodeURIComponent((kv[1] || "").replace(/\+/g, " "));
        } catch (e) {
          return kv[1] || null;
        }
      }
    }
    return null;
  }

  // Basis-Pfad der Seite ermitteln und robust zum JSON joinen
  function jsonPath() {
    var segs = window.location.pathname.split("/");
    segs.pop(); // "detail.html" entfernen
    var base = segs.join("/");
    return base + "/data/cards.json?cb=" + Date.now();
  }

  // ---- Ablauf -------------------------------------------------------------
  var cardId = readCardId();
  if (!cardId) {
    showError("Keine Karten-ID in der URL.");
    return;
  }

  var url = jsonPath();

  fetch(url, { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function (data) {
      // Sowohl Array als auch {cards:[...]} unterstützen
      var list = Array.isArray(data) ? data : (data && (data.cards || data.items)) || [];
      var found = null;
      for (var i = 0; i < list.length; i++) {
        var it = list[i];
        if (it && it.id === cardId) { found = it; break; }
      }
      if (!found) throw new Error("Karte nicht gefunden: " + cardId);

      // Render
      $("card-name").textContent    = found.name    || found.title || "—";
      $("card-team").textContent    = found.team    || found.club  || "—";
      $("card-id").textContent      = found.id      || "—";
      $("card-variant").textContent = found.variant || found.variation || "—";
      $("card-rarity").textContent  = found.rarity  || "—";

      // UI ein/aus
      var err = $("error"); if (err) err.style.display = "none";
      var det = $("detail"); if (det) det.style.display = "block";
    })
    .catch(function (err) {
      // eslint-disable-next-line no-console
      console.error("[detail] load error:", err);
      showError("Fehler beim Laden der Karte.");
    });
})();
