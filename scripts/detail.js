document.addEventListener("DOMContentLoaded", () => {
  const titleEl = document.getElementById("card-title");
  const bodyEl = document.getElementById("card-body");
  const errorEl = document.getElementById("card-error");

  // Hilfsfunktion: sichere QueryParam-Erkennung
  function getParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  const cardId = getParam("id");

  async function loadCard() {
    try {
      // richtiger Pfad: cards.json im /public-Ordner
      const res = await fetch("./cards.json?cb=" + Date.now());
      if (!res.ok) throw new Error("HTTP " + res.status);

      const cards = await res.json();
      const card = cards.find(c => c.id === cardId);

      if (!card) {
        titleEl.textContent = "Kartendetail";
        bodyEl.innerHTML = "<div class='row'><div class='label'>❌ Karte nicht gefunden.</div></div>";
        return;
      }

      // Render Karte
      titleEl.textContent = card.playerName || "Unbenannt";
      bodyEl.innerHTML = `
        <div class="row"><div class="label">Team:</div> <div>${card.team || "-"}</div></div>
        <div class="row"><div class="label">Variante:</div> <div>${card.variant || "-"}</div></div>
        <div class="row"><div class="label">Seltenheit:</div> <div>${card.rarity || "-"}</div></div>
      `;
    } catch (err) {
      console.error("Fehler beim Laden:", err);
      errorEl.style.display = "block";
      errorEl.textContent = "❌ Fehler beim Laden der Karte.";
    }
  }

  loadCard();
});
