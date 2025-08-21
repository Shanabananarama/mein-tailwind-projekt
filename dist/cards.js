fetch("cards.json")
  .then((res) => res.json())
  .then((cards) => {
    const container = document.createElement("div");
    container.className = "space-y-4";

    cards.forEach((card) => {
      const cardEl = document.createElement("div");
      cardEl.className = "bg-white rounded-xl shadow p-4";

      cardEl.innerHTML = `
        <h2 class="text-xl font-bold text-gray-900">${card.name}</h2>
        <p class="text-gray-800"><strong>Club:</strong> ${card.club}</p>
        <p class="text-gray-800"><strong>ID:</strong> ${card.id}</p>
        <p class="text-gray-800"><strong>Variante:</strong> ${card.variante || "—"}</p>
        <p class="text-gray-800"><strong>Seltenheit:</strong> ${card.seltenheit || "—"}</p>
        <a href="detail.html?id=${card.id}" class="text-blue-600 hover:underline">Details</a>
      `;

      container.appendChild(cardEl);
    });

    document.body.appendChild(container);
  })
  .catch((err) => {
    console.error("Fehler beim Laden:", err);
  });
