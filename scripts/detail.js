/* eslint-env browser */
"use strict";

/**
 * Robustes Laden der Kartendetails:
 * - liest ?id= aus window.location.search
 * - holt Daten aus api/mocks/cards_page_1.json (relativer Pfad!)
 * - zeigt klare Fehlermeldungen im UI statt alert()
 */

const API_URL = "api/mocks/cards_page_1.json"; // wichtig: kein führender "/"

/** Helper: Text in ein Element mit ID setzen (falls vorhanden) */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value != null && value !== "" ? String(value) : "—";
}

/** Helper: Fehlermeldung sichtbar machen */
function showError(message) {
  // Falls es ein dediziertes Error-Element gibt, nutze es. Sonst erzeuge eines.
  let el = document.getElementById("error");
  if (!el) {
    el = document.createElement("p");
    el.id = "error";
    el.style.color = "var(--red, #e11d48)";
    el.style.fontSize = "1.25rem";
    el.style.margin = "1rem";
    el.textContent = "";
    document.body.prepend(el);
  }
  el.textContent = message;
}

/** ID aus der URL lesen */
function getIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

/** Hauptablauf */
async function main() {
  try {
    const id = getIdFromQuery();
    if (!id) {
      showError("Fehler: Es wurde keine Karten-ID (?id=...) übergeben.");
      return;
    }

    const res = await fetch(API_URL, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} beim Laden der Daten`);
    }

    const data = await res.json();
    const items = Array.isArray(data?.items) ? data.items : [];
    const card = items.find((c) => c?.id === id);

    if (!card) {
      showError(`Keine Karte mit ID „${id}“ gefunden.`);
      return;
    }

    // Felder ins UI schreiben – IDs müssen im HTML existieren
    setText("title", card.player ?? "Unbekannt");
    setText("player", card.player);
    setText("franchise", card.franchise);
    setText("id", card.id);
    setText("set_id", card.set_id);
    setText("variant", card.variant);
    setText("rarity", card.rarity);
    setText("number", card.number);
  } catch (err) {
    console.error(err);
    showError("❌ Fehler beim Laden der Karte.");
  }
}

// Lauf los
main();
