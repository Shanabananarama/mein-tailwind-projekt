import React from "react";
import type { Card } from "../data/cards";
import { Link } from "react-router-dom";

type CardTeaserProps = {
    card: Card;
};

export default function CardTeaser({ card }: CardTeaserProps) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {card.image && (
                <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-48 object-cover"
                />
            )}
            <div className="p-4">
                <h2 className="text-lg font-bold">{card.title}</h2>
                <p className="text-sm text-gray-500">{card.description}</p>
                <Link
                    to={`/card/${card.id}`}
                    className="text-blue-500 hover:underline text-sm mt-2 block"
                >
                    Mehr Details
                </Link>
            </div>
        </div>
    );
}