/* eslint-env browser */

function getId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

document.addEventListener("DOMContentLoaded", () => {
  const id = getId();
  // Optionales kleines Beispiel, damit die Seite direkt was zeigt:
  const el = document.querySelector("[data-card-id]");
  if (el && id) {
    el.textContent = id;
  }
});
