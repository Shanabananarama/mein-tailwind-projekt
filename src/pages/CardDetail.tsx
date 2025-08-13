// src/pages/CardDetail.tsx
import { useParams } from "react-router-dom";
import { cards } from "../data/cards";

export default function CardDetail() {
    const { id } = useParams<{ id: string }>();
    const card = id ? cards[id] : undefined;

    if (!card) {
        return (
            <main className="mx-auto max-w-3xl p-6">
                <h1 className="text-xl font-semibold">Karte nicht gefunden</h1>
                <p className="text-zinc-400 mt-2">
                    Prüfe die URL oder gehe zurück zur Startseite.
                </p>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-3xl p-6">
            <h1 className="text-2xl font-semibold mb-4">{card.title}</h1>

            <div className="rounded-md border border-zinc-800 p-4">
                <p className="text-zinc-400">Serie: {card.setName}</p>
                <p className="text-zinc-400">Jahr: {card.year}</p>
                {card.image && (
                    <img
                        src={card.image}
                        alt={card.title}
                        className="mt-4 rounded-md border border-zinc-800"
                    />
                )}
            </div>
        </main>
    );
}