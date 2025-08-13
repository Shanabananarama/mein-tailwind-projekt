// /lib/prices.ts
import { addMonths, differenceInMonths, parseISO } from "date-fns";

/**
 * Ein einzelner Datenpunkt für den Preisverlauf.
 */
export type PricePoint = {
    date: string; // ISO-String (YYYY-MM-DD)
    value: number; // Preis (z.B. EUR)
};

/**
 * Preisreihe, z.B. für eine Karte.
 */
export type PriceSeries = {
    slug: string;
    currency: "EUR";
    points: PricePoint[];
};

/**
 * Erzeugt eine pseudo-realistische Preisreihe:
 * - Startwert und Volatilität lassen sich steuern
 * - Ab Release-Monat bis heute (inkl. aktuellem Monat)
 */
export function generateSeries(opts: {
    slug: string;
    releaseISO: string; // z.B. "2023-08-15"
    startValue?: number; // default 25
    volatility?: number; // default 0.12 (12% Monats-Volatilität)
}): PriceSeries {
    const { slug, releaseISO, startValue = 25, volatility = 0.12 } = opts;

    const start = parseISO(releaseISO);
    const months = Math.max(1, differenceInMonths(new Date(), start) + 1);

    const points: PricePoint[] = [];

    // Random-Walk um einen Drift herum
    let value = startValue;
    const min = Math.max(3, startValue * 0.3); // nie unter 30% des Startwertes
    const max = startValue * 4.0; // willkürliche Obergrenze

    for (let i = 0; i < months; i++) {
        const d = addMonths(start, i);

        // Zufällige Veränderung ~ Normal-ähnlich (Box-Muller light)
        // Wir nehmen zwei Zufallszahlen für eine "glattere" Verteilung
        const r1 = Math.random() - 0.5;
        const r2 = Math.random() - 0.5;
        const shock = (r1 + r2) * volatility; // ca. +/- volatility

        // kleiner Drift nach oben, damit es nicht nur seitwärts läuft
        const drift = 0.01; // 1% pro Monat
        value = value * (1 + drift + shock);

        // clamp
        value = Math.min(Math.max(value, min), max);

        points.push({
            date: d.toISOString().slice(0, 10),
            value: Math.round(value * 100) / 100, // 2 Nachkommastellen
        });
    }

    return {
        slug,
        currency: "EUR",
        points,
    };
}

/**
 * Simulierte "Fetcher"-Funktion für SWR –
 * später kann hier ein echter API-Call rein.
 */
export async function fetchPriceSeries(
    slug: string,
    releaseISO: string
): Promise<PriceSeries> {
    // In echt: const res = await fetch(`/api/prices?slug=${slug}`)
    // return await res.json()
    return generateSeries({ slug, releaseISO });
}