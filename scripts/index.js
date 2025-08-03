document.addEventListener("DOMContentLoaded", async () => {
    const cardsGrid = document.getElementById("cardsGrid");

    try {
        const response = await fetch("/cards.json");
        if (!response.ok) {
            throw new Error(`Fehler beim Laden der Karten: ${response.status}`);
        }

        const cards = await response.json();

        cardsGrid.innerHTML = "";

        cards.forEach(card => {
            const cardElement = document.createElement("div");
            cardElement.className =
                "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300";

            cardElement.innerHTML = `
        <a href="/pages/detail.html?id=${card.id}">
          <img src="${card.image}" alt="${card.name}" class="w-full h-64 object-cover">
          <div class="p-4">
            <h2 class="text-lg font-bold">${card.name}</h2>
            <p class="text-gray-600">Serie: ${card.series}</p>
            <p class="text-yellow-600 font-semibold mt-2">💰 ${card.price.toFixed(2)} €</p>
          </div>
        </a>
      `;
            cardsGrid.appendChild(cardElement);
        });
    } catch (error) {
        console.error("Fehler beim Laden der Karten:", error);
        cardsGrid.innerHTML = `<p class="text-red-500">Fehler beim Laden der Karten.</p>`;
    }
});