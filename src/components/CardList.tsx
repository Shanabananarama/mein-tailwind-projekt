import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Card {
  id: string;
  title: string;
  image: string;
}

const CardList: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/cards.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fehler beim Laden der Daten");
        }
        return response.json();
      })
      .then((data) => setCards(data.cards))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <p style={{ color: "red" }}>Fehler beim Laden: {error}</p>;
  }

  return (
    <div>
      <h1>Karten</h1>
      <p>Quelle: public/cards.json</p>
      <ul>
        {cards.map((card) => (
          <li key={card.id}>
            <Link to={`/detail.html?id=${card.id}`}>{card.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CardList;
