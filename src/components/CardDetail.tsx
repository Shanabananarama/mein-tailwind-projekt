import React, { useEffect, useState } from "react";

interface Card {
  id: string;
  name: string;
  image: string;
  description: string;
}

const CardDetail: React.FC = () => {
  const [card, setCard] = useState<Card | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cardId = params.get("id");

    if (cardId) {
      fetch(`${process.env.PUBLIC_URL}/docs/api/mocks/cards_page_1.json`)
        .then((res) => {
          if (!res.ok) throw new Error("Fehler beim Laden der JSON-Datei");
          return res.json();
        })
        .then((data) => {
          const found = data.cards.find((c: Card) => c.id === cardId);
          if (found) {
            setCard(found);
          } else {
            setError("Karte nicht gefunden.");
          }
        })
        .catch(() => setError("Datenquelle nicht erreichbar."));
    } else {
      setError("Keine Karten-ID angegeben.");
    }
  }, []);

  if (error) {
    return (
      <div>
        <a href="cards.html">← Zurück</a>
        <h1>Kartendetail</h1>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!card) {
    return (
      <div>
        <a href="cards.html">← Zurück</a>
        <h1>Kartendetail</h1>
        <p>Lade Karte…</p>
      </div>
    );
  }

  return (
    <div>
      <a href="cards.html">← Zurück</a>
      <h1>{card.name}</h1>
      <img src={card.image} alt={card.name} style={{ maxWidth: "300px" }} />
      <p>{card.description}</p>
    </div>
  );
};

export default CardDetail;
