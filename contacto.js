(() => {
  'use strict';
  const $ = id => document.getElementById(id);

  /* ======== Validación del formulario ======== */
  const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
  const RE_TELEFONO = /^(\+34)?[6-9]\d{8}$/;
  const reglas = {
    nombre: v => v.trim().length >= 3,
    email: v => RE_EMAIL.test(v.trim()),
    telefono: v => v.trim() === '' || RE_TELEFONO.test(v.replace(/\s/g, '')),
    mensaje: v => v.trim().length > 0
  };

  function validarCampo(id) {
    const el = $(id);
    const ok = reglas[id](el.value);
    $(`err-${id}`).classList.toggle('visible', !ok);
    el.setAttribute('aria-invalid', String(!ok));
    return ok;
  }

  const form = $('contacto-form');
  if (form) {
    Object.keys(reglas).forEach(id => {
      const el = $(id);
      el.addEventListener('blur', () => validarCampo(id));
      el.addEventListener('input', () => {
        if (el.getAttribute('aria-invalid') === 'true') validarCampo(id);
      });
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const todoOk = Object.keys(reglas).map(validarCampo).every(Boolean);
      const ok = $('contacto-ok');
      if (!todoOk) { ok.hidden = true; return; }
      form.reset();
      Object.keys(reglas).forEach(id => $(id).removeAttribute('aria-invalid'));
      ok.textContent = 'Mensaje validado correctamente. Formulario de demostración: aún no se envía a ningún servidor.';
      ok.hidden = false;
    });
  }

  /* ======== Mapa Leaflet + ruta ======== */
  const ESTUDIO = { lat: 38.9067, lng: 1.4206 };                 // TODO: coordenadas reales del estudio
  const ORIGEN_DEFECTO = { lat: 38.8729, lng: 1.3731, nombre: 'Aeropuerto de Ibiza' };

  const mapEl = $('map');
  if (!mapEl) return;
  if (!window.L) {
    mapEl.textContent = 'No se pudo cargar el mapa (Leaflet).';
    return;
  }

  const map = L.map('map').setView([ESTUDIO.lat, ESTUDIO.lng], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  L.marker([ESTUDIO.lat, ESTUDIO.lng]).addTo(map)
    .bindPopup('<b>SONYCOLOR Studio</b><br>COSTAGOMESDJ HQ.')
    .openPopup();

  let capaRuta = null;
  const info = $('ruta-info'), enlaceOsm = $('ruta-osm'), btnRuta = $('btn-ruta');

  function trazarRuta(origen, etiqueta) {
    if (capaRuta) capaRuta.remove();
    const a = L.latLng(origen.lat, origen.lng);
    const b = L.latLng(ESTUDIO.lat, ESTUDIO.lng);
    capaRuta = L.layerGroup([
      L.marker(a).bindPopup(etiqueta),
      L.polyline([a, b], { color: '#eaff00', weight: 4, dashArray: '8 8' })
    ]).addTo(map);
    map.fitBounds(L.latLngBounds([a, b]).pad(0.2));
    info.textContent = `Distancia en línea recta desde ${etiqueta}: ${(a.distanceTo(b) / 1000).toFixed(2)} km.`;
    enlaceOsm.href = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${a.lat}%2C${a.lng}%3B${b.lat}%2C${b.lng}`;
    enlaceOsm.hidden = false;
  }

  btnRuta.addEventListener('click', () => {
    const usarDefecto = () => trazarRuta(ORIGEN_DEFECTO, ORIGEN_DEFECTO.nombre);
    if (!navigator.geolocation) { usarDefecto(); return; }
    info.textContent = 'Buscando tu ubicación…';
    navigator.geolocation.getCurrentPosition(
      pos => trazarRuta({ lat: pos.coords.latitude, lng: pos.coords.longitude }, 'tu ubicación'),
      usarDefecto,
      { timeout: 8000 }
    );
  });
})();
