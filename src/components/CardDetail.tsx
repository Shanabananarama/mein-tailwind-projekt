import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

interface Card {
  id: string;
  title: string;
  image: string;
  description: string;
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const CardDetail: React.FC = () => {
  const [card, setCard] = useState<Card | null>(null);
  const [error, setError] = useState<string | null>(null);
  const query = useQuery();
  const id = query.get("id");

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/cards.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Datenquelle nicht erreichbar.");
        }
        return response.json();
      })
      .then((data) => {
        const found = data.cards.find((c: Card) => c.id === id);
        setCard(found || null);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <div>
        <Link to="/cards.html">← Zurück</Link>
        <h1>Kartendetail</h1>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!card) {
    return (
      <div>
        <Link to="/cards.html">← Zurück</Link>
        <h1>Kartendetail</h1>
        <p>Lade Karte…</p>
      </div>
    );
  }

  return (
    <div>
      <Link to="/cards.html">← Zurück</Link>
      <h1>{card.title}</h1>
      <img src={process.env.PUBLIC_URL + "/" + card.image} alt={card.title} />
      <p>{card.description}</p>
    </div>
  );
};

export default CardDetail;
