/* scripts/cards.js */
(function () {
  "use strict";

  function $(id) {
    return document.getElementById(id);
  }

  function ensureListContainer() {
    // Versucht gängige Container-IDs in der bestehenden Seite; fällt sonst auf <body> zurück
    var ids = ["cards-list", "cards", "cardsContainer", "list", "cards-grid"];
    for (var i = 0; i < ids.length; i++) {
      var el = $(ids[i]);
      if (el) return el;
    }
    return document.body;
  }

  function createCardNode(card) {
    // Karte als Link zu detail.html?id=<id>
    var a = document.createElement("a");
    a.href = "detail.html?id=" + encodeURIComponent(card.id);
    a.className =
      "block bg-white p-6 rounded-lg shadow hover:shadow-md transition";

    var title = document.createElement("h3");
    title.className = "text-2xl font-bold mb-2";
    title.textContent = card.title || card.name || "-";

    var club = document.createElement("p");
    club.className = "text-gray-600 mb-1";
    club.textContent = card.team || card.club || card.series || "";

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

    a.appendChild(title);
    if (club.textContent) a.appendChild(club);
    a.appendChild(idRow);
    a.appendChild(variantRow);
    a.appendChild(rarityRow);

    return a;
  }

  function showError(msg) {
    var container = ensureListContainer();
    container.innerHTML = "";
    var p = document.createElement("p");
    p.textContent = "❌ " + msg;
    p.style.color = "#dc2626";
    p.style.fontSize = "1.25rem";
    p.style.margin = "1rem 0";
    container.appendChild(p);
  }

  function renderList(list) {
    var container = ensureListContainer();
    container.innerHTML = "";

    // optionales Grid-Layout, falls Tailwind aktiv ist
    var grid = document.createElement("div");
    grid.className = "grid gap-6 md:grid-cols-2";
    container.appendChild(grid);

    for (var i = 0; i < list.length; i++) {
      var node = createCardNode(list[i]);
      grid.appendChild(node);
    }
  }

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

      if (!list.length) {
        showError("Keine Karten gefunden.");
        return;
      }

      renderList(list);
    })
    .catch(function () {
      showError("Fehler beim Laden der Kartenliste.");
    });
})();
