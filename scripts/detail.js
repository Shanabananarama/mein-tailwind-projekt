/* eslint-env browser */

(function () {
  "use strict";

  // UI-Referenzen
  var elError = document.getElementById("error");
  var elCard = document.getElementById("card");
  var elDebug = document.getElementById("debug");

  var els = {
    title: document.getElementById("title"),
    cid: document.getElementById("cid"),
    setid: document.getElementById("setid"),
    player: document.getElementById("player"),
    franchise: document.getElementById("franchise"),
    number: document.getElementById("number"),
    variant: document.getElementById("variant"),
    rarity: document.getElementById("rarity")
  };

  function show(el) {
    if (el && el.classList && el.classList.contains("hidden")) {
      el.classList.remove("hidden");
    }
  }

  function hide(el) {
    if (el && el.classList && !el.classList.contains("hidden")) {
      el.classList.add("hidden");
    }
  }

  function fail(msg, debug) {
    if (elError) {
      elError.textContent = msg;
      show(elError);
    }
    if (debug && elDebug) {
      elDebug.textContent = debug;
      show(elDebug);
    }
    hide(elCard);
  }

  function success() {
    hide(elError);
    hide(elDebug);
    show(elCard);
  }

  function getIdFromQuery() {
    var search = window.location.search || "";
    try {
      var params = new window.URLSearchParams(search);
      var id = params.get("id");
      return id ? id.trim() : "";
    } catch (e) {
      // Fallback: manuelles Parsen
      if (search.indexOf("?") === 0) {
        var pairs = search.slice(1).split("&");
        for (var i = 0; i < pairs.length; i++) {
          var kv = pairs[i].split("=");
          if (decodeURIComponent(kv[0]) === "id") {
            return decodeURIComponent(kv.slice(1).join("=")).trim();
          }
        }
      }
      return "";
    }
  }

  function pick(valA, valB, fallback) {
    return valA != null && valA !== "" ? valA : (valB != null && valB !== "" ? valB : fallback);
  }

  async function main() {
    try {
      var id = getIdFromQuery();
      if (!id) {
        fail("Fehler: Keine Karten-ID in der URL (?id=...) gefunden.");
        return;
      }

      // Statischer, relativer Pfad – identisch zur Kartenliste
      var src = "api/mocks/cards_page_1.json";
      var res = await fetch(src, { cache: "no-store" });
      if (!res.ok) {
        fail("Fehler: Quelle konnte nicht geladen werden.", "HTTP " + res.status + " " + res.statusText + "\nURL: " + src);
        return;
      }
      var data = await res.json();

      // {items:[...]} ODER direkt [...]
      var list = Array.isArray(data) ? data : (data && Array.isArray(data.items) ? data.items : []);
      if (!list.length) {
        fail("Fehler: Die Datenquelle enthält keine Karten.", JSON.stringify(data, null, 2));
        return;
      }

      // Karte anhand id finden (robust gegenüber Feldnamen)
      var card = null;
      for (var i = 0; i < list.length; i++) {
        var c = list[i] || {};
        var cid = c.id != null ? c.id : c.card_id;
        if (cid === id) {
          card = c;
          break;
        }
      }

      if (!card) {
        var ids = [];
        for (var j = 0; j < list.length && j < 50; j++) {
          var x = list[j] || {};
          var xid = x.id != null ? x.id : x.card_id;
          if (xid != null) ids.push(xid);
        }
        fail("Karte mit ID „" + id + "” wurde nicht gefunden.", "Verfügbare IDs (Auszug):\n" + ids.join("\n"));
        return;
      }

      // Felder zuweisen (robust, mit Fallbacks)
      var player = pick(card.player_name, card.player, "—");
      var team = pick(card.team, card.franchise, "");
      els.title.textContent = team ? (player + " – " + team) : player;

      els.cid.textContent = pick(card.id, card.card_id, "—");
      els.setid.textContent = pick(card.set_id, card.set, "—");
      els.player.textContent = player;
      els.franchise.textContent = pick(card.team, card.franchise, "—");
      els.number.textContent = String(pick(card.number, card.no, "—"));
      els.variant.textContent = pick(card.variant, "", "—");
      els.rarity.textContent = pick(card.rarity, "", "—");

      success();
    } catch (err) {
      var msg = (err && err.stack) ? String(err.stack) : String(err);
      fail("Unerwarteter Fehler beim Laden der Karte.", msg);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();
