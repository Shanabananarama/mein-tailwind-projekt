// scripts/index.js

document.addEventListener("DOMContentLoaded", async () => {
  const cardsContainer = document.getElementById("cards-container");
  const loadingText = document.querySelector(".loading-text");

  try {
    // Karten-Daten laden
    const response = await fetch("./cards.json");
    const cards = await response.json();

    // Ladehinweis ausblenden
    loadingText.style.display = "none";

    // Karten dynamisch erstellen
    cards.forEach(card => {
      const cardElement = document.createElement("div");
      cardElement.classList.add("card");
      cardElement.innerHTML = `
                <img src="${card.image}" alt="${card.title}">
                <h2>${card.title}</h2>
                <p>${card.description}</p>
            `;
      cardsContainer.appendChild(cardElement);
    });
  } catch (error) {
    console.error("Fehler beim Laden der Karten:", error);
    loadingText.textContent = "Fehler beim Laden der Karten.";
  }
});