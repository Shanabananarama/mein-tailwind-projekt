// scripts/detail.js
import { abs } from './lib/base.js';

function getId() {
  const p = new URLSearchParams(location.search);
  return p.get('id');
}

async function loadCard(id) {
  const res = await fetch(abs('cards.json'), { cache: 'no-store' });
  if (!res.ok) throw new Error(`cards.json fetch failed: ${res.status}`);
  const list = await res.json();
  return list.find(c => String(c.id) === String(id));
}

function render(card) {
  const root = document.getElementById('app');
  if (!root) return;
  root.innerHTML = '';

  const img = document.createElement('img');
  img.src = abs(`images/${card.image ?? 'card-back.png'}`);
  img.alt = card.name ?? 'Card';
  img.className = 'max-w-sm rounded shadow';

  const title = document.createElement('h1');
  title.className = 'text-2xl font-bold mt-4';
  title.textContent = card.name ?? 'Unbenannt';

  const back = document.createElement('a');
  back.href = abs('index.html');
  back.className = 'text-blue-600 underline mt-4 inline-block';
  back.textContent = 'Zurück';

  root.appendChild(img);
  root.appendChild(title);
  root.appendChild(back);
}

async function start() {
  const id = getId();
  document.getElementById('status')?.replaceChildren('Lade Karte…');
  try {
    const card = await loadCard(id);
    if (!card) throw new Error('Karte nicht gefunden');
    render(card);
    document.getElementById('status')?.replaceChildren('');
  } catch (e) {
    console.error(e);
    document.getElementById('status')?.replaceChildren('Fehler beim Laden.');
  }
}

start();
