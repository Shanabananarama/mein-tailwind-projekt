document.addEventListener("DOMContentLoaded", () => {
  try {
    // Nur im Browser verfügbar
    const params = new URLSearchParams(window.location.search);
    const cardId = params.get("id");

    if (!cardId) {
      throw new Error("Keine Karten-ID in der URL gefunden");
    }

    // Karten-Daten laden
    fetch("./data/cards.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Fehler beim Laden der Daten");
        }
        return res.json();
      })
      .then((cards) => {
        const card = cards.find((c) => c.id === cardId);
        if (!card) {
          throw new Error("Karte nicht gefunden");
        }

        // Beispiel: Details einfügen
        document.querySelector("body").innerHTML += `
          <h2>${card.name}</h2>
          <p>${card.team}</p>
          <img src="${card.image}" alt="${card.name}" />
        `;
      })
      .catch((err) => {
        console.error(err);
        document.querySelector("body").innerHTML += `<p style="color:red">❌ Fehler beim Laden der Karte.</p>`;
      });
  } catch (err) {
    console.error(err);
    document.querySelector("body").innerHTML += `<p style="color:red">❌ Fehler beim Laden der Karte.</p>`;
  }
});
