(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function n(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function o(e){if(e.ep)return;e.ep=!0;const t=n(e);fetch(e.href,t)}})();document.addEventListener("DOMContentLoaded",async()=>{const s=document.getElementById("cardsGrid");try{const r=await fetch("/cards.json");if(!r.ok)throw new Error(`Fehler beim Laden der Karten: ${r.status}`);const n=await r.json();s.innerHTML="",n.forEach(o=>{const e=document.createElement("div");e.className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300",e.innerHTML=`
        <a href="/pages/detail.html?id=${o.id}">
          <img src="${o.image}" alt="${o.name}" class="w-full h-64 object-cover">
          <div class="p-4">
            <h2 class="text-lg font-bold">${o.name}</h2>
            <p class="text-gray-600">Serie: ${o.series}</p>
            <p class="text-yellow-600 font-semibold mt-2">💰 ${o.price.toFixed(2)} €</p>
          </div>
        </a>
      `,s.appendChild(e)})}catch(r){console.error("Fehler beim Laden der Karten:",r),s.innerHTML='<p class="text-red-500">Fehler beim Laden der Karten.</p>'}});
