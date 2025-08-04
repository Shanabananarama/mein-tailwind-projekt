// ❌ absichtlicher ESLint Fehler: fehlendes Semikolon und falsche Anführungszeichen

function sagHallo(name) {
  console.log("Hallo " + name); // <- hier fehlt das Semikolon absichtlich
}

sagHallo("Nils");
