export type Card = {
  id: string;
  title: string;     // Kartenname
  setName: string;   // Name des Sets / Serie
  year: number;      // Erscheinungsjahr
  description: string;
  image: string;
};

export const cards: Record<string, Card> = {
  "1": {
    id: "1",
    title: "Pikachu VMAX",
    setName: "Pokémon Vivid Voltage",
    year: 2020,
    description: "Seltene Pokémon Karte – Rainbow Rare.",
    image: "https://example.com/pikachu-vmax.jpg"
  },
  "2": {
    id: "2",
    title: "Charizard Holo",
    setName: "Pokémon Base Set",
    year: 1999,
    description: "Legendäre Glurak Karte – erste Edition.",
    image: "https://example.com/charizard-holo.jpg"
  },
  "3": {
    id: "3",
    title: "Black Lotus",
    setName: "Magic: The Gathering Alpha",
    year: 1993,
    description: "Iconische Magic: The Gathering Karte.",
    image: "https://example.com/black-lotus.jpg"
  }
};