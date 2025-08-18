document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const cardId = params.get("id");

  const detailContainer = document.getElementById("detail-container") || document.body;

  if (!cardId) {
    detailContainer.innerHTML =
      "<p class='text-red-500 text-lg'>❌ Keine Karten-ID angegeben.</p>";
    return;
  }

  try {
    // JSON-Quelle (RAW auf GitHub + Cachebuster)
    const jsonUrl =
      "https://raw.githubusercontent.com/Shanabananarama/mein-tailwind-projekt/refs/heads/main/api/mocks/cards_page_1.json?v=" +
      Date.now();

    const res = await fetch(jsonUrl, {
      cache: "no-store",
      headers: { "Cache-Control": "no-store" },
    });

    if (!res.ok) throw new Error("Netzwerkfehler: " + res.status);

    const data = await res.json();

    // Datensatz finden (Feld "id" muss exakt zur URL ?id=... passen)
    const card = Array.isArray(data) ? data.find((c) => c.id === cardId) : null;

    if (!card) {
      detailContainer.innerHTML =
        "<p class='text-red-500 text-lg'>❌ Karte nicht gefunden.</p>";
      return;
    }

    // Fallbacks
    const name = card.name || card.title || "Unbenannte Karte";
    const team = card.team || card.franchise || "";
    const price = card.price ?? card.current_price ?? "—";
    const image = card.image || card.img || "";

    detailContainer.innerHTML = `
      <div class="max-w-xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        ${image ? `<img src="${image}" alt="${name}" class="w-full">` : ""}
        <div class="p-5">
          <h1 class="text-2xl font-bold mb-1">${name}</h1>
          ${team ? `<p class="text-gray-600 mb-2">${team}</p>` : ""}
          <p class="text-gray-800 font-semibold">Preis: ${price} €</p>
          <p class="text-xs text-gray-400 mt-3">ID: ${cardId}</p>
        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    detailContainer.innerHTML =
      "<p class='text-red-500 text-lg'>❌ Fehler beim Laden der Karte.</p>";
  }
});
