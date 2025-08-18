/* eslint-env browser */
(() => {
  "use strict";

  // --- Basis-URL robust bestimmen ---
  const parts = window.location.pathname.split("/").filter(Boolean);
  const repoBase = parts.length > 0 ? `/${parts[0]}/` : "/";
  const DATA_URL = `${repoBase}mocks/cards_page_1.json`;

  // --- Query-Param ohne URLSearchParams (lint-sicher) ---
  const getQueryParam = (key) => {
    const qs = window.location.search.replace(/^\?/, "");
    if (!qs) return null;
    const pairs = qs.split("&");
    for (let i = 0; i < pairs.length; i++) {
      const seg = pairs[i].split("=");
      const k = decodeURIComponent(seg[0] || "");
      const v = decodeURIComponent((seg[1] || "").replace(/\+/g, " "));
      if (k === key) return v;
    }
    return null;
  };

  const requestedId = getQueryParam("id");

  const el = (id) => document.getElementById(id);
  const $error =
    document.querySelector("[data-error]") || document.getElementById("error-box");

  const showError = (msg) => {
    if ($error) {
      $error.textContent = msg;
      $error.style.display = "";
    }
  };

  const hideError = () => {
    if ($error) $error.style.display = "none";
  };

  const renderCard = (card) => {
    hideError();

    if (el("card-title")) {
      el("card-title").textContent =
        card.title || card.player || card.name || "–";
    }
    if (el("card-series")) {
      el("card-series").textContent =
        card.set || card.set_id || card.series || "–";
    }
    if (el("card-description")) {
      el("card-description").textContent = card.description || "";
    }
    if (el("card-price")) {
      el("card-price").textContent =
        card.price != null ? `${card.price} €` : "–";
    }
    if (el("card-trend")) {
      el("card-trend").textContent =
        card.trend != null ? `${card.trend} €` : "–";
    }
    if (el("card-limited")) {
      el("card-limited").textContent =
        card.limited != null ? String(card.limited) : "–";
    }
    if (el("card-image") && card.image) {
      el("card-image").src = card.image;
      el("card-image").alt = card.title || card.player || "Karte";
    }

    if (!el("card-title") && !el("card-details")) {
      const box = document.createElement("div");
      box.style.margin = "2rem 0";
      box.innerHTML = `
        <h2 style="font-weight:700;font-size:1.25rem;margin-bottom:.5rem">
          ${card.title || card.player || "Karte"}
        </h2>
        <div style="opacity:.7;margin-bottom:.5rem">
          Serie/Set: ${card.set || card.set_id || "–"}
        </div>
        <div>ID: ${card.id || "–"}</div>
      `;
      document.body.appendChild(box);
    }
  };

  const load = async () => {
    if (!requestedId) {
      showError("Keine Karten-ID übergeben (?id=...)");
      return;
    }

    try {
      const res = await fetch(DATA_URL, { cache: "no-store" });
      if (!res.ok) {
        showError(`Quelle nicht erreichbar (${res.status}): ${DATA_URL}`);
        return;
      }
      const data = await res.json();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.cards)
        ? data.cards
        : [];
      if (!list.length) {
        showError("Die Datenquelle enthält keine Karten.");
        return;
      }

      const card = list.find((c) => c.id === requestedId);
      if (!card) {
        showError(`Karte mit ID "${requestedId}" nicht gefunden.`);
        return;
      }

      renderCard(card);
    } catch (e) {
      showError("Fehler beim Laden der Karte.");
    }
  };

  load();
})();
