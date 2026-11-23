// Hero: "Diseño experiencias visuales…" se parte en palabras para animarlas de a una.
(function () {
  var lead = document.querySelector('.inicio__lead');
  if (!lead) return;
  var i = 0;
  lead.setAttribute('aria-label', lead.textContent.replace(/\s+/g, ' ').trim());
  (function partir(nodo) {
    Array.prototype.slice.call(nodo.childNodes).forEach(function (hijo) {
      if (hijo.nodeType === 1) { partir(hijo); return; }
      if (hijo.nodeType !== 3) return;
      var frag = document.createDocumentFragment();
      hijo.textContent.split(/(\s+)/).forEach(function (trozo) {
        if (!trozo) return;
        if (/^\s+$/.test(trozo)) { frag.appendChild(document.createTextNode(trozo)); return; }
        var s = document.createElement('span');
        s.className = 'lw'; s.setAttribute('aria-hidden', 'true');
        s.style.setProperty('--i', i++);
        s.textContent = trozo;
        frag.appendChild(s);
      });
      nodo.replaceChild(frag, hijo);
    });
  })(lead);
  lead.classList.add('is-partido');
})();

// Inicio: el texto "Soy Pilar…" aparece palabra por palabra cuando entra en pantalla.
(function () {
  var el = document.querySelector('.reveal');
  if (!el) return;
  if (!('IntersectionObserver' in window)) { el.classList.add('is-shown'); return; }
  var io = new IntersectionObserver(function (entries) {
    if (entries.some(function (e) { return e.isIntersecting; })) { el.classList.add('is-shown'); io.disconnect(); }
  }, { threshold: 0.4 });
  io.observe(el);
})();
