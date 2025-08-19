document.addEventListener("DOMContentLoaded", async () => {
  const errorMessage = document.getElementById("error-message");
  const notFoundMessage = document.getElementById("card-not-found");

  try {
    const params = new URLSearchParams(window.location.search);
    const cardId = params.get("id");

    if (!cardId) {
      errorMessage.textContent = "❌ Keine Karten-ID angegeben.";
      return;
    }

    // Karten laden mit Cache-Busting
    const response = await fetch("./data/cards.json?cb=" + Date.now());
    if (!response.ok) throw new Error("Netzwerkfehler beim Laden von cards.json");

    const cards = await response.json();
    const card = cards.find(c => c.id === cardId);

    if (!card) {
      errorMessage.style.display = "none";
      notFoundMessage.classList.remove("hidden");
      return;
    }

    // Fehlernachricht ausblenden, wenn Karte gefunden
    errorMessage.style.display = "none";

    // Felder befüllen
    document.getElementById("card-title").textContent = card.title || "—";
    document.getElementById("card-series").textContent = card.series || "";
    document.getElementById("card-description").textContent = card.description || "";
    document.getElementById("card-price").textContent = card.price || "—";
    document.getElementById("card-trend").textContent = card.trend || "—";
    document.getElementById("card-limited").textContent = card.limited || "—";

  } catch (err) {
    console.error("Fehler beim Laden:", err);
    errorMessage.textContent = "❌ Fehler beim Laden der Karte.";
  }
});
