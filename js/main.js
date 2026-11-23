// Escala los bloques que tienen posiciones fijas del diseño (collage y cita)
// para que entren en pantallas más chicas sin desarmarse.
function escalarBloques() {
  document.querySelectorAll('.escala').forEach(function (bloque) {
    var ancho = Number(bloque.dataset.ancho);
    var alto = Number(bloque.dataset.alto);
    var escala = Math.min(1, bloque.clientWidth / ancho);
    bloque.firstElementChild.style.transform = 'scale(' + escala + ')';
    bloque.style.height = alto * escala + 'px';
  });
}

window.addEventListener('resize', escalarBloques);
escalarBloques();

// Lista de proyectos de Inicio: al pasar el mouse por un nombre,
// aparece la imagen del proyecto siguiendo al cursor.
(function () {
  var lista = document.querySelector('.lista-proyectos');
  if (!lista || !window.matchMedia('(hover: hover)').matches) return;
  var preview = lista.querySelector('.lista-proyectos__preview');
  lista.querySelectorAll('a[data-preview]').forEach(function (link) {
    link.addEventListener('mouseenter', function () {
      preview.src = link.dataset.preview;
      preview.classList.add('visible');
    });
    link.addEventListener('mouseleave', function () { preview.classList.remove('visible'); });
    link.addEventListener('mousemove', function (e) {
      preview.style.left = (e.clientX + 170) + 'px';
      preview.style.top = e.clientY + 'px';
    });
  });
})();
