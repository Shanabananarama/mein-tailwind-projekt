/* scripts/cards.js – GH Pages safe data load */

(async function () {
  "use strict";

  const byId = (id) => document.getElementById(id);

  const listEl = byId("cards");
  const errEl = byId("error");
  const sourceEl = byId("source");

  function showError(msg) {
    if (errEl) {
      errEl.textContent = msg;
      errEl.style.display = "block";
    } else {
      // Fallback
      alert(msg);
    }
  }

  try {
    // Resolve cards.json RELATIV zur aktuellen Seite (cards.html)
    // → auf GH Pages wird das zu /mein-tailwind-projekt/cards.json
    const dataUrl = new window.URL("cards.json", window.location.href);
    const fetchUrl = `${dataUrl.toString()}?cb=${Date.now()}`;

    // Quelle in der UI anzeigen (optional span#source)
    if (sourceEl) {
      const path = dataUrl.pathname.startsWith("/")
        ? dataUrl.pathname.slice(1)
        : dataUrl.pathname;
      sourceEl.textContent = path;
    }

    const res = await fetch(fetchUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    /** @type {{cards: Array<any>}} */
    const json = await res.json();
    const cards = Array.isArray(json?.cards) ? json.cards : [];

    if (!listEl) return;

    // Render (minimal – passe bei Bedarf an dein Markup an)
    listEl.innerHTML = "";
    for (const c of cards) {
      const a = document.createElement("a");
      a.href = `detail.html?id=${encodeURIComponent(c.id)}`;
      a.className = "card-link";

      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <h2>${c.name ?? ""}</h2>
        <p>${c.club ?? ""}</p>
        <p><strong>ID:</strong> ${c.id ?? ""}</p>
        <p><strong>Variante:</strong> ${c.variant ?? "—"}</p>
        <p><strong>Seltenheit:</strong> ${c.rarity ?? "—"}</p>
      `.trim();

      a.appendChild(div);
      listEl.appendChild(a);
    }
  } catch (e) {
    showError("Fehler beim Laden.");
    // Optional: console für Diagnose
    console.error("[cards.js] Load failed:", e);
  }
})();
