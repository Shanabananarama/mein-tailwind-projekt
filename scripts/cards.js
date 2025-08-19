/* scripts/cards.js – gh-pages safe fetch */
(function () {
  const $list = document.getElementById("cardsList");
  const $source = document.getElementById("dataSource");

  function getBase() {
    // 1) <base href="..."> falls gesetzt (kannst du später optional in HTML ergänzen)
    const baseTag = document.querySelector("base")?.getAttribute("href");
    if (baseTag) return baseTag.endsWith("/") ? baseTag : baseTag + "/";

    // 2) GitHub Pages Unterpfad automatisch erkennen
    const m = location.pathname.match(/^(.*?\/mein-tailwind-projekt\/)/);
    if (m) return m[1];

    // 3) Lokal (vite dev) / andere Umgebungen
    return "/";
  }

  async function loadCards() {
    const base = getBase();
    const url = `${base}cards.json?cb=${Date.now()}`;
    if ($source) $source.textContent = `Quelle: ${url.replace(location.origin + "/", "")}`;

    let res;
    try {
      res = await fetch(url, { cache: "no-store" });
    } catch (e) {
      throw new Error("Netzwerkfehler beim Laden " + url);
    }
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} beim Laden ${url}`);
    }

    const data = await res.json();
    render(data);
  }

  function render(cards) {
    if (!$list) return;
    $list.innerHTML = "";
    cards.forEach((c) => {
      const a = document.createElement("a");
      a.className =
        "block rounded-2xl p-6 bg-white/90 shadow hover:shadow-lg transition";
      a.href = `detail.html?id=${encodeURIComponent(c.id)}&cb=${Date.now()}`;
      a.innerHTML = `
        <div class="text-2xl font-bold mb-2">${c.name || "—"}</div>
        <div class="text-slate-600">Club: ${c.club || "—"}</div>
        <div class="text-slate-600">ID: ${c.id ?? "—"}</div>
        <div class="text-slate-600">Variante: ${c.variant || "—"}</div>
        <div class="text-slate-600">Seltenheit: ${c.rarity || "—"}</div>
      `;
      $list.appendChild(a);
    });
  }

  function showError(err) {
    console.error(err);
    const $err = document.getElementById("errorMsg");
    if ($err) {
      $err.textContent = "Fehler beim Laden.";
      $err.style.display = "block";
    } else {
      alert("Fehler beim Laden.");
    }
  }

  loadCards().catch(showError);
})();
