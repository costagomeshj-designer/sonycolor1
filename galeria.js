(() => {
  'use strict';
  const IMAGENES = [
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=800&q=80',
  ];
  const INTERVALO_MS = 4000;
  const $ = id => document.getElementById(id);

  const carrusel = $('carrusel'), slidesBox = $('slides'), dotsBox = $('dots');
  const grid = $('gallery-container');
  const modal = $('gallery-modal'), modalImg = $('modal-img'), cerrar = $('close-modal');
  if (!carrusel || !grid || !modal) return;

  /* ---------- Carrusel ---------- */
  let idx = 0, timer = null;

  const slides = IMAGENES.map((src, i) => {
    const img = document.createElement('img');
    img.className = 'slide';
    img.src = src;
    img.alt = `Evento ${i + 1} de COSTAGOMESDJ`;
    if (i > 0) img.loading = 'lazy';
    slidesBox.append(img);
    return img;
  });
  const dots = IMAGENES.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'dot';
    b.setAttribute('aria-label', `Ir a la imagen ${i + 1}`);
    b.addEventListener('click', () => mostrar(i));
    dotsBox.append(b);
    return b;
  });

  function mostrar(i) {
    idx = (i + IMAGENES.length) % IMAGENES.length;
    slides.forEach((s, n) => s.classList.toggle('active', n === idx));
    dots.forEach((d, n) => d.classList.toggle('active', n === idx));
  }
  function iniciar() {
    if (timer !== null) return; // evita acumular intervalos
    timer = setInterval(() => mostrar(idx + 1), INTERVALO_MS);
  }
  function parar() {
    clearInterval(timer);
    timer = null;
  }

  $('car-prev').addEventListener('click', () => mostrar(idx - 1));
  $('car-next').addEventListener('click', () => mostrar(idx + 1));
  carrusel.addEventListener('mouseenter', parar);
  carrusel.addEventListener('mouseleave', iniciar);
  carrusel.addEventListener('focusin', parar);
  carrusel.addEventListener('focusout', iniciar);

  mostrar(0);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) iniciar();

  /* ---------- Cuadrícula + lightbox ---------- */
  let ultimoFoco = null;
  function abrir(src, alt) {
    ultimoFoco = document.activeElement;
    modalImg.src = src;
    modalImg.alt = alt;
    modal.classList.add('active');
    cerrar.focus();
  }
  function cerrarModal() {
    modal.classList.remove('active');
    if (ultimoFoco) ultimoFoco.focus();
  }

  IMAGENES.forEach((src, i) => {
    const img = document.createElement('img');
    img.className = 'gallery-item';
    img.src = src;
    img.alt = `Evento ${i + 1} de COSTAGOMESDJ`;
    img.loading = 'lazy';
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.addEventListener('click', () => abrir(src, img.alt));
    img.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(src, img.alt); }
    });
    grid.append(img);
  });

  cerrar.addEventListener('click', cerrarModal);
  modal.addEventListener('click', e => { if (e.target === modal) cerrarModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) cerrarModal();
  });
})();
