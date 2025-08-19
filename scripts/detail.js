/* scripts/detail.js – GH Pages safe data load + stable ID lookup */

(async function () {
  "use strict";

  const byId = (id) => document.getElementById(id);

  const titleEl = byId("title");
  const bodyEl = byId("detail");
  const msgEl = byId("error");

  function showError(msg) {
    if (msgEl) {
      msgEl.textContent = msg;
      msgEl.style.display = "block";
    } else {
      alert(msg);
    }
  }

  try {
    // Query-Parameter lesen (eslint/no-undef Workaround: window.URLSearchParams)
    const params = new window.URLSearchParams(window.location.search);
    const rawId = params.get("id") || "";
    const wantedId = decodeURIComponent(rawId).trim();

    if (!wantedId) {
      showError("Ungültige ID.");
      return;
    }

    // cards.json relativ zur aktuellen Seite (detail.html) auflösen
    const dataUrl = new window.URL("cards.json", window.location.href);
    const fetchUrl = `${dataUrl.toString()}?cb=${Date.now()}`;

    const res = await fetch(fetchUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    /** @type {{cards: Array<any>}} */
    const json = await res.json();
    const cards = Array.isArray(json?.cards) ? json.cards : [];

    const card = cards.find(
      (c) => String(c.id || "").trim() === wantedId
    );

    if (!card) {
      showError("Karte nicht gefunden.");
      return;
    }

    if (titleEl) titleEl.textContent = card.name || "Kartendetail";

    if (bodyEl) {
      bodyEl.innerHTML = `
        <div class="card-detail">
          <h2>${card.name ?? ""}</h2>
          <p><strong>Club:</strong> ${card.club ?? "—"}</p>
          <p><strong>ID:</strong> ${card.id ?? "—"}</p>
          <p><strong>Variante:</strong> ${card.variant ?? "—"}</p>
          <p><strong>Seltenheit:</strong> ${card.rarity ?? "—"}</p>
        </div>
      `.trim();
    }
  } catch (e) {
    showError("Fehler beim Laden der Karte.");
    console.error("[detail.js] Load failed:", e);
  }
})();
