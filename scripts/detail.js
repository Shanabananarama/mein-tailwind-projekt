/* eslint-env browser */
(() => {
  "use strict";

  // ---------- Mini-Utils ----------
  const $ = (sel) => document.querySelector(sel);

  const showError = (msg) => {
    const text = msg || "Fehler beim Laden der Karte.";
    let box = $("#detail-error");
    if (!box) {
      box = document.createElement("p");
      box.id = "detail-error";
      box.style.color = "#dc2626";
      box.style.fontSize = "1.5rem";
      box.style.margin = "1.25rem 0";
      box.textContent = `❌ ${text}`;
      document.body.prepend(box);
    } else {
      box.textContent = `❌ ${text}`;
      box.style.display = "block";
    }
  };

  const showSource = (url) => {
    const h = document.querySelector("h1,h2,.page-title") || document.body;
    let small = $("#source-hint");
    if (!small) {
      small = document.createElement("div");
      small.id = "source-hint";
      small.style.color = "#6b7280";
      small.style.fontSize = "0.875rem";
      small.style.margin = "0.5rem 0 1rem";
      h.after(small);
    }
    small.textContent = `Quelle: ${url}`;
  };

  // ---------- ID aus der URL ----------
  const params = new window.URLSearchParams(window.location.search);
  const cardId = params.get("id");
  if (!cardId) {
    showError("Keine Karten-ID in der URL gefunden.");
    return;
  }

  // ---------- GitHub Pages Basis erkennen ----------
  const parts = window.location.pathname.split("/").filter(Boolean);
  const repoBase = parts.length ? `/${parts[0]}/` : "/";

  // Absoluten URL-String erzeugen (ohne nacktes globales URL)
  const makeAbs = (p) => {
    const clean = p.replace(/^\/+/, "");
    return new window.URL(clean, window.location.origin).toString();
  };

  const candidates = [
    makeAbs(`${repoBase}api/mocks/cards_page_1.json`),
    makeAbs(`${repoBase}mocks/cards_page_1.json`),
    "api/mocks/cards_page_1.json",
    "mocks/cards_page_1.json",
  ];

  // ---------- Fetch mit Fallback ----------
  const fetchFirstOk = async () => {
    let lastErr = null;
    for (const u of candidates) {
      try {
        const res = await window.fetch(u, { cache: "no-store" });
        if (!res.ok) {
          lastErr = new Error(`HTTP ${res.status} ${res.statusText} bei ${u}`);
          continue;
        }
        const data = await res.json();
        showSource(u);
        return data;
      } catch (e) {
        lastErr = new Error(`Netzwerk-/Parsefehler bei ${u}: ${e.message}`);
      }
    }
    throw lastErr || new Error("Unbekannter Ladefehler.");
  };

  const render = (card) => {
    let mount = $("#card-details");
    if (!mount) {
      mount = document.createElement("div");
      mount.id = "card-details";
      mount.className = "bg-white p-6 rounded-lg shadow";
      document.body.appendChild(mount);
    }
    const rows = [
      ["ID", card.id],
      ["Set-ID", card.set_id || card.setId || "—"],
      ["Spieler", card.player || card.name || "—"],
      ["Franchise", card.franchise || "—"],
      ["Nummer", card.number || "—"],
      ["Variante", card.variant || "—"],
      ["Seltenheit", card.rarity || "—"],
    ]
      .map(
        ([k, v]) =>
          `<div class="flex gap-3"><span class="font-semibold w-28">${k}</span><span>${v}</span></div>`
      )
      .join("");
    mount.innerHTML = `
      <h2 class="text-2xl font-bold mb-4">${card.player || card.name || "Karte"}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2">${rows}</div>
    `;
    const err = $("#detail-error");
    if (err) err.style.display = "none";
  };

  (async () => {
    try {
      const raw = await fetchFirstOk();
      const list = Array.isArray(raw) ? raw : raw.cards || [];
      const card = list.find((c) => c && c.id === cardId);
      if (!card) {
        showError(`Karte mit ID "${cardId}" nicht gefunden.`);
        return;
      }
      render(card);
    } catch (e) {
      console.error("[detail] Fehler:", e);
      showError(e && e.message ? e.message : "Karte konnte nicht geladen werden.");
    }
  })();
})();
