// scripts/index.js
import { BASE, abs } from './lib/base.js';

async function loadCards() {
  // cards.json liegt z.B. in /public/cards.json  -> wird unter /mein-tailwind-projekt/cards.json ausgeliefert
  const res = await fetch(abs('cards.json'), { cache: 'no-store' });
  if (!res.ok) throw new Error(`cards.json fetch failed: ${res.status}`);
  return res.json();
}

function render(cards) {
  const root = document.getElementById('app');
  if (!root) return;
  root.innerHTML = '';

  const ul = document.createElement('ul');
  ul.className = 'grid grid-cols-2 md:grid-cols-4 gap-4';

  cards.forEach(c => {
    const li = document.createElement('li');
    li.className = 'p-3 rounded shadow bg-white';

    // Bildpfad IMMER über abs() bzw. BASE auflösen
    const img = document.createElement('img');
    img.alt = c.name ?? 'Card';
    img.loading = 'lazy';
    img.src = abs(`images/${c.image ?? 'card-back.png'}`);

    const name = document.createElement('h3');
    name.className = 'font-semibold mt-2';
    name.textContent = c.name ?? 'Unbenannt';

    // Detail-Link (falls du eine Detailseite nutzt)
    const a = document.createElement('a');
    a.href = abs(`detail.html?id=${encodeURIComponent(c.id ?? '')}`);
    a.className = 'text-blue-600 underline block mt-1';
    a.textContent = 'Details';

    li.appendChild(img);
    li.appendChild(name);
    li.appendChild(a);
    ul.appendChild(li);
  });

  root.appendChild(ul);
}

// Optionales Background-Image-Beispiel (wenn du sowas nutzt)
function setBackground() {
  const el = document.body;
  el.style.backgroundImage = `url(${abs('images/bg.png')})`;
  el.style.backgroundSize = 'cover';
}

async function start() {
  try {
    document.getElementById('status')?.replaceChildren('Karten werden geladen…');
    const cards = await loadCards();
    render(cards);
    setBackground();
    document.getElementById('status')?.replaceChildren(''); // Status entfernen
  } catch (err) {
    console.error(err);
    document.getElementById('status')?.replaceChildren('Fehler beim Laden.');
  }
}

start();
