document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const cardId = params.get("id");

    fetch("../public/cards.json")
        .then(response => response.json())
        .then(data => {
            const card = data.find(item => item.id == cardId);

            if (card) {
                document.getElementById("card-title").textContent = `${card.name} – ${card.series} Trading Card`;
                document.getElementById("card-series").textContent = `Serie: ${card.series}`;
                document.getElementById("card-description").textContent = `${card.description} – limitierte Edition.`;
                document.getElementById("card-price").textContent = `${card.price.toFixed(2)} €`;
                document.getElementById("card-trend").textContent = `${card.trend.toFixed(2)} €`;
                document.getElementById("card-limited").textContent = card.limited ? `Ja, ${card.limitCount}` : "Nein";
                document.getElementById("card-image").src = `../public/${card.image}`;
                document.getElementById("card-image").alt = card.name;

                // Chart erstellen
                const ctx = document.getElementById("priceChart").getContext("2d");
                new Chart(ctx, {
                    type: "line",
                    data: {
                        labels: card.priceHistory.map((_, index) => `Tag ${index + 1}`),
                        datasets: [{
                            label: "Preis (€)",
                            data: card.priceHistory,
                            backgroundColor: "rgba(54, 162, 235, 0.2)",
                            borderColor: "rgba(54, 162, 235, 1)",
                            borderWidth: 2,
                            tension: 0.2,
                            fill: true,
                            pointBackgroundColor: "blue"
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: true
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: false
                            }
                        }
                    }
                });
            } else {
                document.getElementById("card-details").innerHTML = "<p class='text-red-600 font-bold'>Fehler beim Laden der Kartendetails.</p>";
            }
        })
        .catch(error => {
            console.error("Fehler beim Laden der Kartendaten:", error);
            document.getElementById("card-details").innerHTML = "<p class='text-red-600 font-bold'>Fehler beim Laden der Kartendetails.</p>";
        });
});