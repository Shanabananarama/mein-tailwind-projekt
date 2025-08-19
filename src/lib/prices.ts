// src/lib/prices.ts
export function getPriceSeries(releaseYear: number) {
  // Dummy-Daten – später durch echte Preisdaten ersetzen
  const data = [];
  for (let i = 0; i < 12; i++) {
    data.push({
      date: `${i + 1}/2025`,
      value: Math.random() * 100 + releaseYear / 100,
    });
  }
  return data;
}