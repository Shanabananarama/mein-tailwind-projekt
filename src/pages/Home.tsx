import React from "react";
import { cards } from "../data/cards";
import CardTeaser from "../components/CardTeaser";

export default function Home() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {Object.values(cards).map((card) => (
        <CardTeaser key={card.id} card={card} />
      ))}
    </div>
  );
}