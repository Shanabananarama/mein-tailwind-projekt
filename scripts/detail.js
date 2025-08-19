/* scripts/detail.js
   Robustes Detail-Loading für GitHub Pages:
   - sicheres Auslesen der ID
   - gh-pages-kompatibler Datenpfad (/mein-tailwind-projekt)
   - Cache-Busting
   - sauberes DOM-Update + Fallback
*/

(function () {
  "use strict";

  // --- Helpers --------------------------------------------------------------
  function getQueryId() {
    try {
      var sp = new window.URLSearchParams(window.location.search);
      var raw = sp.get("id") || "";
      return decodeURIComponent(raw).trim();
    } catch (e) {
      // Fallback, falls URLSearchParams nicht verfügbar (sehr alte Browser)
      var q = (window.location.search || "").replace(/^\?/, "");
      var parts = q.split("&");
      for (var i = 0; i < parts.length; i++) {
        var kv = parts[i].split("=");
        if (kv[0] === "id") {
          try {
            return decodeURIComponent(kv[1] || "").trim();
          } catch (err) {
            return (kv[1] || "").trim();
          }
        }
      }
      return "";
    }
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function setText(id, value) {
    var el = byId(id);
    if (el) {
      el.textContent = value;
    }
  }

  function showError(msg) {
    // Standard‑Fehlermarkierung aus der Seite weiterverwenden
    // Falls vorhanden, schreiben wir die Meldung um – ansonsten legen wir eine an.
    var existing = document.querySelector("[data-detail-error]") || document.querySelector(".detail-error");
    if (existing) {
      existing.textContent = msg;
      existing.style.display = "block";
      return;
    }
    var p = document.createElement("p");
    p.setAttribute("data-detail-error", "1");
    p.style.color = "#dc2626";
    p.style.fontSize = "1.25rem";
    p.style.margin = "1rem 0";
    p.textContent = msg;
    document.body.appendChild(p);
  }

  function showNotFound(id) {
    showError("Keine Karte mit der ID „" + id + "“ gefunden.");
  }

  function getBasePath() {
    // Wenn auf GitHub Pages unter /mein-tailwind-projekt/ ausgeliefert wird,
    // brauchen wir den Projekt-Prefix für relative Fetches.
    var p = window.location.pathname || "";
    if (p.indexOf("/mein-tailwind-projekt/") === 0) {
      return "/mein-tailwind-projekt";
    }
    return "";
  }

  // --- Ablauf ---------------------------------------------------------------
  var id = getQueryId();
  if (!id) {
    showError("Fehlende oder ungültige Karten-ID.");
    return;
  }

  var base = getBasePath();
  var dataUrl = base + "/data/cards.json?cb=" + String(Date.now());

  fetch(dataUrl, { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) {
        throw new Error("HTTP " + res.status + " beim Laden von " + dataUrl);
      }
      return res.json();
    })
    .then(function (all) {
      if (!Array.isArray(all)) {
        throw new Error("Unerwartetes Datenformat (keine Array-Liste).");
      }

      var card = null;
      for (var i = 0; i < all.length; i++) {
        if ((all[i].id || "") === id) {
          card = all[i];
          break;
        }
      }

      if (!card) {
        showNotFound(id);
        return;
      }

      // Optional bekannte IDs befüllen (falls vorhanden)
      setText("card-title", card.title || "");
      setText("card-series", card.series || "");
      setText("card-description", card.description || "");
      setText("card-price", (card.price != null ? String(card.price) + " €" : ""));
      setText("card-trend", (card.trend != null ? String(card.trend) + " %" : ""));
      setText("card-limited", card.limited || "");
      setText("card-id", card.id || "");
      setText("card-team", card.team || "");
      setText("card-variant", card.variant || "");
      setText("card-rarity", card.rarity || "");

      var imgEl = byId("card-image");
      if (imgEl && card.image) {
        // Relative Bildpfade gegen den Projekt-Prefix auflösen
        var src = card.image;
        if (src.indexOf("http://") !== 0 && src.indexOf("https://") !== 0 && src.indexOf(base + "/") !== 0) {
          src = base + "/" + src.replace(/^\/+/, "");
        }
        imgEl.src = src + "?cb=" + String(Date.now());
        imgEl.alt = card.title || "Kartenbild";
      }

      // Falls eine explizite Fehlerbox existiert, blenden wir sie aus
      var errNode = document.querySelector("[data-detail-error]") || document.querySelector(".detail-error");
      if (errNode) {
        errNode.style.display = "none";
      }
    })
    .catch(function (err) {
      showError("Fehler beim Laden der Karte: " + err.message);
      // Optional für Debug: console.error(err);
    });
})();
