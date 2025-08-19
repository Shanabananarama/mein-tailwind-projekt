/* scripts/detail.js – stable, gh-pages safe, no URLSearchParams */

/* -------- helpers -------- */
function parseQuery(search) {
  var out = {};
  if (!search) return out;
  var q = search.charAt(0) === "?" ? search.slice(1) : search;
  if (!q) return out;
  var parts = q.split("&");
  for (var i = 0; i < parts.length; i++) {
    var kv = parts[i].split("=");
    var k = decodeURIComponent(kv[0] || "");
    var v = decodeURIComponent(kv[1] || "");
    if (k) out[k] = v;
  }
  return out;
}

function text(node, value) {
  if (node) node.textContent = value;
}

function byId(id) {
  return document.getElementById(id);
}

/* -------- constants -------- */
/* gleiche Quelle wie cards.html */
var DATA_URL = "docs/api/mocks/cards_page_1.json";

/* Cache-Busting, damit GH-Pages nicht cached */
function withCb(url) {
  var sep = url.indexOf("?") === -1 ? "?" : "&";
  return url + sep + "cb=" + String(Date.now());
}

/* -------- render -------- */
function renderCard(card) {
  /* Erwartete Felder im JSON:
     id, title (oder name), club (oder team), variant, rarity
     -> wir mappen defensiv
  */
  var title = card.title || card.name || card.player || "—";
  var club = card.club || card.team || "—";
  var variant = card.variant || "—";
  var rarity = card.rarity || "—";

  text(byId("card-title"), title);
  text(byId("card-club"), club);
  text(byId("card-variant"), variant);
  text(byId("card-rarity"), rarity);

  var box = byId("detail-box");
  if (box) box.style.display = "block";
}

function showError(msg) {
  var err = byId("detail-error");
  if (err) {
    err.style.display = "block";
    text(err, "❌ " + msg);
  }
}

/* -------- main -------- */
(function main() {
  try {
    var q = parseQuery(window.location.search);
    var id = (q.id || "").trim();
    if (!id) {
      showError("Keine Karten-ID in der URL gefunden.");
      return;
    }

    fetch(withCb(DATA_URL))
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        /* JSON kann array sein oder {cards:[...]} */
        var list =
          (data && (data.cards || data.items || data.data)) || data || [];
        if (!list || typeof list.length !== "number") list = [];

        var found = null;
        for (var i = 0; i < list.length; i++) {
          var c = list[i] || {};
          var cid = (c.id || c.ID || c.slug || "").trim();
          if (cid === id) {
            found = c;
            break;
          }
        }

        if (!found) {
          showError("Karte nicht gefunden (ID: " + id + ").");
          return;
        }
        renderCard(found);
      })
      .catch(function (e) {
        showError("Datenquelle nicht erreichbar. " + e.message);
      });
  } catch (e) {
    showError("Unerwarteter Fehler. " + e.message);
  }
})();
