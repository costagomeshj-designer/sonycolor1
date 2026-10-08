(() => {
  'use strict';
  /* ---- Reglas de negocio (ajusta aquí según el enunciado) ---- */
  const HORAS_MIN = 2;
  const HORAS_MAX = 12;
  const PRECIO_HORA_EXTRA = 50;                 // € por hora sobre las 2 base
  const DESCUENTO_POR_HORAS = [                 // el primer tramo que cumpla se aplica
    { desde: 10, pct: 15 },
    { desde: 6, pct: 10 }
  ];
  const DESCUENTO_PACK_EXTRAS = 5;              // % si se contratan TODOS los extras

  const $ = id => document.getElementById(id);
  const form = $('presupuesto-form');
  if (!form) return;

  const selectEvento = $('tipo-evento');
  const inputHoras = $('horas');
  const terminos = $('acepto-terminos');
  const btn = $('btn-enviar-presupuesto');
  const msg = $('presupuesto-msg');
  const errHoras = $('err-horas');
  const extras = Array.from(form.querySelectorAll('.extra-item'));
  const eur = n => n.toFixed(2);

  function calcular() {
    const base = parseFloat(selectEvento.value);
    const horas = parseInt(inputHoras.value, 10);
    const baseOk = !isNaN(base) && base > 0;
    const horasOk = !isNaN(horas) && horas >= HORAS_MIN && horas <= HORAS_MAX;

    errHoras.classList.toggle('visible', !horasOk);
    inputHoras.setAttribute('aria-invalid', String(!horasOk));

    const r = { base: 0, horasExtra: 0, extras: 0, subtotal: 0, pct: 0, descuento: 0, total: 0 };
    if (baseOk && horasOk) {
      r.base = base;
      r.horasExtra = Math.max(0, horas - HORAS_MIN) * PRECIO_HORA_EXTRA;
      let marcados = 0;
      extras.forEach(cb => {
        const v = parseFloat(cb.value);
        if (cb.checked && !isNaN(v)) { r.extras += v; marcados++; }
      });
      r.subtotal = r.base + r.horasExtra + r.extras;
      const tramo = DESCUENTO_POR_HORAS.find(t => horas >= t.desde);
      const pctHoras = tramo ? tramo.pct : 0;
      const pctPack = extras.length > 0 && marcados === extras.length ? DESCUENTO_PACK_EXTRAS : 0;
      r.pct = pctHoras + pctPack;
      r.descuento = r.subtotal * r.pct / 100;
      r.total = r.subtotal - r.descuento;
    }

    $('d-base').textContent = eur(r.base);
    $('d-horas').textContent = eur(r.horasExtra);
    $('d-extras').textContent = eur(r.extras);
    $('d-subtotal').textContent = eur(r.subtotal);
    $('d-pct').textContent = String(r.pct);
    $('d-descuento').textContent = '-' + eur(r.descuento);
    $('precio-total').textContent = eur(r.total);

    btn.disabled = !(baseOk && horasOk && terminos.checked);
    return { ...r, horas };
  }

  form.addEventListener('input', calcular);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const r = calcular();
    if (btn.disabled) return;
    const tipo = selectEvento.options[selectEvento.selectedIndex].text.replace(/\s*\(.*\)/, '');
    msg.textContent = `Solicitud registrada: ${tipo}, ${r.horas} h, total ${eur(r.total)} € ` +
      `(descuento aplicado: ${r.pct}%). Formulario de demostración: aún no se envía a ningún servidor.`;
    msg.hidden = false;
  });
  calcular();
})();
