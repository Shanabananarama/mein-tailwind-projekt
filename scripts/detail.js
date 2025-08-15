/* eslint-disable no-undef */

// Holt die ID aus der URL
function getId() {
    const p = new URLSearchParams(window.location.search);
    return p.get("id");
}
