/* eslint-env browser */

(function () {
  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function create(tag, cls) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    return el;
  }

  async function fetchJSON(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
  }

  // global helper
  window.Base = { qs, create, fetchJSON };
})();
