// Páginas de detalle de proyecto: tabs de subsecciones y flows.

// Alto real del header, para que la barra de subsecciones quede pegada debajo
function medirHeader() {
  var header = document.querySelector('.encabezado');
  document.documentElement.style.setProperty('--alto-header', header.offsetHeight + 'px');
}
window.addEventListener('resize', medirHeader);
medirHeader();

// ---------- Tabs ----------
var botones = Array.prototype.slice.call(document.querySelectorAll('.subnav__boton'));
var subnav = document.querySelector('.subnav');

function mostrarTab(id, conScroll) {
  var existe = botones.some(function (b) { return b.getAttribute('aria-controls') === id; });
  if (!existe) return;

  botones.forEach(function (boton) {
    var activo = boton.getAttribute('aria-controls') === id;
    boton.setAttribute('aria-selected', activo);
    boton.tabIndex = activo ? 0 : -1;
    document.getElementById(boton.getAttribute('aria-controls')).hidden = !activo;
    if (activo) boton.scrollIntoView({ block: 'nearest', inline: 'center' });
  });

  escalarBloques(); // el bloque del prototipo se mide recién cuando está visible

  // Los videos del tab que se abre arrancan (el navegador los pausa si estaban ocultos)
  document.querySelectorAll('#' + id + ' video[autoplay]').forEach(function (v) {
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  });

  if (conScroll) {
    var arriba = subnav.getBoundingClientRect().top + window.scrollY -
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--alto-header'));
    if (window.scrollY > arriba) window.scrollTo({ top: arriba, behavior: 'smooth' });
  }
}

botones.forEach(function (boton, i) {
  boton.addEventListener('click', function () {
    var id = boton.getAttribute('aria-controls');
    history.replaceState(null, '', '#' + id);
    mostrarTab(id, true);
  });
  // Flechas del teclado para moverse entre tabs
  boton.addEventListener('keydown', function (e) {
    var siguiente = null;
    if (e.key === 'ArrowRight') siguiente = botones[(i + 1) % botones.length];
    if (e.key === 'ArrowLeft') siguiente = botones[(i - 1 + botones.length) % botones.length];
    if (siguiente) { siguiente.focus(); siguiente.click(); }
  });
});

// Si la URL trae #flow, #diseno, etc., abre ese tab
if (location.hash) mostrarTab(location.hash.slice(1), false);
window.addEventListener('hashchange', function () { mostrarTab(location.hash.slice(1), true); });

// ---------- Menú lateral del design system (Atlas) ----------
var botonesDs = Array.prototype.slice.call(document.querySelectorAll('[data-ds]'));
botonesDs.forEach(function (boton) {
  boton.addEventListener('click', function () {
    botonesDs.forEach(function (b) {
      var activo = b === boton;
      b.setAttribute('aria-pressed', activo);
      document.getElementById(b.dataset.ds).hidden = !activo;
    });
    // Volver al principio de la sección si el usuario estaba más abajo
    var ds = document.querySelector('.ds');
    var arriba = ds.getBoundingClientRect().top + window.scrollY - subnav.offsetHeight -
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--alto-header')) - 20;
    if (window.scrollY > arriba) window.scrollTo({ top: arriba, behavior: 'smooth' });
  });
});

// ---------- Videos acelerados (data-velocidad="2" = el doble de rápido) ----------
document.querySelectorAll('video[data-velocidad]').forEach(function (v) {
  var vel = parseFloat(v.dataset.velocidad) || 1;
  function aplicar() { v.defaultPlaybackRate = vel; v.playbackRate = vel; }
  aplicar();
  v.addEventListener('loadedmetadata', aplicar);
  v.addEventListener('play', aplicar);
});

// ---------- Flows: arrastrar con el mouse para recorrerlos ----------
var lienzos = Array.prototype.slice.call(document.querySelectorAll('.flujo__lienzo'));

// Si el flow entra entero, se oculta la pista "Arrastrá para recorrerlo"
function revisarDesborde() {
  lienzos.forEach(function (l) { l.classList.toggle('no-desborda', l.scrollWidth <= l.clientWidth + 2); });
}

lienzos.forEach(function (l) {
  var x0 = 0, s0 = 0, activo = false;
  l.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse') return; // en touch ya se desliza con el dedo
    activo = true; x0 = e.clientX; s0 = l.scrollLeft;
    l.classList.add('arrastrando'); l.setPointerCapture(e.pointerId);
  });
  l.addEventListener('pointermove', function (e) { if (activo) l.scrollLeft = s0 - (e.clientX - x0); });
  ['pointerup', 'pointercancel'].forEach(function (t) {
    l.addEventListener(t, function () { activo = false; l.classList.remove('arrastrando'); });
  });
  l.querySelectorAll('img').forEach(function (img) { img.addEventListener('load', revisarDesborde); });
});

window.addEventListener('resize', revisarDesborde);
botones.forEach(function (b) { b.addEventListener('click', function () { setTimeout(revisarDesborde, 0); }); });
if (location.hash) setTimeout(revisarDesborde, 0);
