/* eslint-env browser */
(() => {
  // Kleine Hilfen
  const $ = (sel) => document.querySelector(sel);
  const setText = (sel, value) => {
    const el = $(sel);
    if (el) el.textContent = value ?? "";
  };
  const showError = (msg) => setText("#error", msg);

  // ID aus der URL holen (?id=...)
  const getId = () => new URLSearchParams(window.location.search).get("id") || "";

  // Robust: mehrere mögliche Pfade probieren, bis einer klappt
  async function loadCardsJson() {
    const candidates = [
      "./api/mocks/cards_page_1.json",
      "./mocks/cards_page_1.json",
      // absolute Fallbacks (GitHub Pages Repo-Root)
      "/mein-tailwind-projekt/api/mocks/cards_page_1.json",
      "/mein-tailwind-projekt/mocks/cards_page_1.json",
    ];

    let lastErr;
    for (const url of candidates) {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) return res.json();
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr ?? new Error("Konnte keine Kartenquelle laden.");
  }

  async function render() {
    try {
      const id = getId();
      if (!id) {
        showError("❌ Kein Karten-Parameter übergeben (?id=...).");
        return;
      }

      const data = await loadCardsJson();
      const items = Array.isArray(data) ? data : data?.items;
      if (!Array.isArray(items)) throw new Error("Unerwartetes JSON-Format.");

      const card = items.find((c) => c.id === id);
      if (!card) {
        showError(`❌ Karte „${id}“ nicht gefunden.`);
        return;
      }

      // Daten setzen – nur wenn das Ziel-Element existiert
      setText("#player-name", card.player);
      setText("#franchise", card.franchise);
      setText("#number", String(card.number ?? "—"));
      setText("#variant", card.variant ?? "—");
      setText("#rarity", card.rarity ?? "—");

      // Fehlerzeile leeren, falls vorher etwas stand
      showError("");
    } catch (e) {
      // Eine bewusst knappe, user-freundliche Meldung
      showError("❌ Fehler beim Laden der Karte.");
      // Entwickler-Detail ins Console-Log
      console.error("[detail] Render-Fehler:", e);
    }
  }

  document.addEventListener("DOMContentLoaded", render);
})();
