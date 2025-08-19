import React, { useEffect, useState } from "react";

/**
 * Kartenliste – lädt die Daten absolut von GitHub Pages,
 * damit es unter https://shanabananarama.github.io/mein-tailwind-projekt/ funktioniert.
 */
type Card = {
  id: string;
  title?: string;
  name?: string;
  club?: string;
  team?: string;
  variant?: string;
  rarity?: string;
  [key: string]: unknown;
};

const DATA_URL_ABSOLUTE =
  "https://shanabananarama.github.io/mein-tailwind-projekt/docs/api/mocks/cards_page_1.json";

export default function CardList() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(DATA_URL_ABSOLUTE, { cache: "no-store" });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const json = await res.json();

        // Versuche, das Karten-Array robust zu finden
        const list: Card[] =
          Array.isArray(json) ? json :
          Array.isArray(json.cards) ? json.cards :
          Array.isArray(json.data) ? json.data :
          [];

        if (alive) setCards(list);
      } catch (e) {
        if (alive) setError("Fehler beim Laden.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-1">Karten</h1>
        <p className="text-slate-500">Quelle: docs/api/mocks/cards_page_1.json</p>
        <p className="mt-8">Lade Karten…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-1">Karten</h1>
        <p className="text-slate-500">Quelle: docs/api/mocks/cards_page_1.json</p>
        <p className="mt-8 text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <a href="./index.html" className="text-indigo-500">← Start</a>
      <h1 className="text-3xl font-bold mt-4 mb-1">Karten</h1>
      <p className="text-slate-500 mb-6">Quelle: docs/api/mocks/cards_page_1.json</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((c) => {
          const title = (c.title ?? c.name ?? "—") as string;
          const club = (c.club ?? c.team ?? "—") as string;
          const id = (c.id ?? "—") as string;
          const variant = (c.variant ?? "—") as string;
          const rarity = (c.rarity ?? "—") as string;

          return (
            <a
              key={id}
              href={`./detail.html?id=${encodeURIComponent(id)}`}
              className="block rounded-2xl border border-slate-200 p-5 hover:shadow-md transition"
            >
              <h2 className="text-2xl font-semibold">{title}</h2>
              <div className="mt-2 text-slate-600">{club}</div>
              <dl className="mt-4 text-sm text-slate-700">
                <div className="flex gap-2"><dt className="w-24 opacity-60">ID</dt><dd>{id}</dd></div>
                <div className="flex gap-2"><dt className="w-24 opacity-60">Variante</dt><dd>{variant}</dd></div>
                <div className="flex gap-2"><dt className="w-24 opacity-60">Seltenheit</dt><dd>{rarity}</dd></div>
              </dl>
            </a>
          );
        })}
      </div>
    </div>
  );
}
