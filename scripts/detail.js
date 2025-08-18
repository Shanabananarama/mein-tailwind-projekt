/* eslint-env browser */
(function () {
  "use strict";

  // Lint-sicheres Query-Parsing (kein URL/URLSearchParams, nur String-Operationen)
  function getQueryParam(name) {
    var qs = window.location.search ? window.location.search.substring(1) : "";
    if (!qs) return null;
    var pairs = qs.split("&");
    for (var i = 0; i < pairs.length; i++) {
      var kv = pairs[i];
      if (!kv) continue;
      var eq = kv.indexOf("=");
      var k = eq >= 0 ? kv.substring(0, eq) : kv;
      var v = eq >= 0 ? kv.substring(eq + 1) : "";
      try {
        k = decodeURIComponent(k.replace(/\+/g, " "));
        v = decodeURIComponent(v.replace(/\+/g, " "));
      } catch (e) {
        // ignore decode errors
      }
      if (k === name) return v;
    }
    return null;
  }

  function setHtml(el, html) {
    if (el) el.innerHTML = html;
  }

  var container =
    document.getElementById("detail-container") ||
    document.getElementById("card-details") ||
    document.getElementById("detail") ||
    document.body;

  var cardId = getQueryParam("id");
  if (!cardId) {
    setHtml(
      container,
      "<p class=\"text-red-500 text-lg\">❌ Keine Karten-ID angegeben.</p>"
    );
    return;
  }

  // Quelle: RAW (cachen verhindern) – CORS-freundlich
  var jsonUrl =
    "https://raw.githubusercontent.com/Shanabananarama/mein-tailwind-projekt/refs/heads/main/api/mocks/cards_page_1.json?cb=" +
    String(Date.now());

  fetch(jsonUrl, {
    cache: "no-store",
    headers: { "Cache-Control": "no-store" }
  })
    .then(function (res) {
      if (!res.ok) throw new Error("Netzwerkfehler " + res.status);
      return res.json();
    })
    .then(function (data) {
      var list = Array.isArray(data) ? data : [];
      var card = null;
      for (var i = 0; i < list.length; i++) {
        if (list[i] && list[i].id === cardId) {
          card = list[i];
          break;
        }
      }
      if (!card) {
        setHtml(
          container,
          "<p class=\"text-red-500 text-lg\">❌ Karte nicht gefunden.</p>"
        );
        return;
      }

      var name = card.name || card.title || "Unbenannte Karte";
      var team = card.team || card.franchise || "";
      var variant = card.variant || card.variante || "—";
      var rarity = card.rarity || card.seltenheit || "—";
      var image = card.image || card.img || "";
      var number = card.number || card.nummer || "—";

      var html =
        '<div class="max-w-xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">' +
        (image ? '<img src="' + image + '" alt="' + name + '" class="w-full">' : "") +
        '<div class="p-5">' +
        '<h1 class="text-2xl font-bold mb-2">' + name + "</h1>" +
        (team ? '<p class="text-gray-600 mb-1">' + team + "</p>" : "") +
        '<p class="text-gray-800"><span class="font-semibold">ID:</span> ' + cardId + "</p>" +
        '<p class="text-gray-800"><span class="font-semibold">Nummer:</span> ' + number + "</p>" +
        '<p class="text-gray-800"><span class="font-semibold">Variante:</span> ' + variant + "</p>" +
        '<p class="text-gray-800"><span class="font-semibold">Seltenheit:</span> ' + rarity + "</p>" +
        "</div></div>";

      setHtml(container, html);
    })
    .catch(function (err) {
      // Optional in Konsole, UI bleibt sauber
      try { console.error(err); } catch (e) {}
      setHtml(
        container,
        "<p class=\"text-red-500 text-lg\">❌ Fehler beim Laden der Karte.</p>"
      );
    });
})();
