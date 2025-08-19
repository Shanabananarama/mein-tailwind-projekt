/* scripts/detail.js – gh-pages safe fetch + robustes ID-Mapping */
(function () {
  const $title = document.getElementById("cardTitle");
  const $container = document.getElementById("cardDetail");
  const $error = document.getElementById("errorMsg");

  function getBase() {
    const baseTag = document.querySelector("base")?.getAttribute("href");
    if (baseTag) return baseTag.endsWith("/") ? baseTag : baseTag + "/";
    const m = location.pathname.match(/^(.*?\/mein-tailwind-projekt\/)/);
    if (m) return m[1];
    return "/";
  }

  function getId() {
    try {
      const usp = new URLSearchParams(location.search);
      const raw = usp.get("id");
      return raw ? decodeURIComponent(raw.trim()) : null;
    } catch {
      return null;
    }
  }

  async function loadDetail() {
    const id = getId();
    if (!id) throw new Error("Keine ID in URL.");

    const base = getBase();
    const url = `${base}cards.json?cb=${Date.now()}`;

    let res;
    try {
      res = await fetch(url, { cache: "no-store" });
    } catch (e) {
      throw new Error("Netzwerkfehler beim Laden " + url);
    }
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} beim Laden ${url}`);
    }
    const cards = await res.json();

    // Finde Karte: id kann Zahl oder String sein
    const card =
      cards.find((c) => String(c.id) === String(id)) ||
      cards.find((c) => (c.slug ? String(c.slug) === String(id) : false));

    if (!card) {
      renderNotFound(id);
      return;
    }
    render(card);
  }

  function renderNotFound(id) {
    if ($error) {
      $error.textContent = `Karte nicht gefunden (id=${id}).`;
      $error.style.display = "block";
    }
  }

  function render(card) {
    if ($title) $title.textContent = card.name || "Kartendetail";
    if ($container) {
      $container.innerHTML = `
        <div class="text-slate-700">Club: ${card.club || "—"}</div>
        <div class="text-slate-700">ID: ${card.id ?? "—"}</div>
        <div class="text-slate-700">Variante: ${card.variant || "—"}</div>
        <div class="text-slate-700">Seltenheit: ${card.rarity || "—"}</div>
      `;
    }
  }

  function showError(err) {
    console.error(err);
    if ($error) {
      $error.textContent = "Fehler beim Laden der Karte.";
      $error.style.display = "block";
    } else {
      alert("Fehler beim Laden der Karte.");
    }
  }

  loadDetail().catch(showError);
})();
