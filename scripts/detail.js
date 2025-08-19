/* eslint-env browser */
(function () {
  "use strict";

  // UI-Helfer
  function showError(msg) {
    // Zeigt die bestehende Fehlerfläche an, falls vorhanden
    var err =
      document.getElementById("detail-error") ||
      document.querySelector(".detail-error") ||
      document.querySelector(".error-message");
    if (err) {
      err.textContent = msg || "Fehler beim Laden der Karte.";
      err.style.display = "";
    }
  }

  // ID aus Query
  var params = new window.URLSearchParams(window.location.search || "");
  var id = (params.get("id") || "").trim();
  if (!id) {
    showError("Fehler beim Laden der Karte.");
    return;
  }

  // Daten holen (gh-pages kompatibel, mit Cache-Busting)
  var dataUrl = "api/mocks/cards_page_1.json?cb=" + Date.now();

  fetch(dataUrl, { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function (json) {
      // Datenstruktur flexibel handhaben
      var list = Array.isArray(json && json.cards) ? json.cards : json;
      if (!Array.isArray(list)) throw new Error("Invalid data");

      // Exakte ID-Übereinstimmung
      var card = list.find(function (c) {
        return String(c && c.id).trim() === id;
      });

      if (!card) {
        showError("Karte nicht gefunden.");
        return;
      }

      // Ziel-Container ermitteln oder anlegen
      var container =
        document.getElementById("card-detail") ||
        document.querySelector("#card-details") ||
        document.querySelector("[data-role='card-detail']");

      // Falls kein Container vorhanden ist, keinen Fehler werfen – nur Fehlermeldung verstecken.
      var errEl =
        document.getElementById("detail-error") ||
        document.querySelector(".detail-error") ||
        document.querySelector(".error-message");
      if (errEl) errEl.style.display = "none";

      if (!container) return;

      // Sichere Properties (unterstützt verschiedene Keys aus den Mocks)
      var title = card.name || card.title || "";
      var club = card.club || card.team || card.series || "";
      var variant = card.variant || "—";
      var rarity = card.rarity || "—";

      container.innerHTML =
        '<div class="bg-white p-6 rounded-lg shadow">' +
        '<h2 class="text-2xl font-bold mb-2">' +
        title +
        "</h2>" +
        (club
          ? '<p class="text-gray-600 mb-4">' + club + "</p>"
          : '<p class="text-gray-600 mb-4"></p>') +
        '<dl class="grid grid-cols-2 gap-2">' +
        '<dt class="text-gray-500">ID</dt><dd class="font-medium break-all">' +
        card.id +
        "</dd>" +
        '<dt class="text-gray-500">Variante</dt><dd class="font-medium">' +
        variant +
        "</dd>" +
        '<dt class="text-gray-500">Seltenheit</dt><dd class="font-medium">' +
        rarity +
        "</dd>" +
        "</dl>" +
        "</div>";
    })
    .catch(function () {
      showError("Fehler beim Laden der Karte.");
    });
})();
