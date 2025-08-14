// scripts/lib/base.js
export const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '') + '/';

/**
 * Hängt BASE vor einen (ggf. relativen) Pfad.
 * Beispiel: abs('cards.json') -> '.../mein-tailwind-projekt/cards.json'
 */
export function abs(path) {
  if (!path) return BASE;
  // Wenn bereits absolut (http/https), so lassen
  if (/^https?:\/\//i.test(path)) return path;
  return BASE + path.replace(/^\/+/, '');
}
