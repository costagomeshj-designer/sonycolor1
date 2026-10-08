(() => {
  'use strict';
  const grid = document.getElementById('news-grid');
  if (!grid) return;

  async function cargarNoticias() {
    try {
      const res = await fetch('noticias.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const noticias = await res.json();
      grid.replaceChildren();
      noticias.forEach(({ fecha, titulo, texto }) => {
        const card = document.createElement('article');
        card.className = 'news-card';
        const f = document.createElement('span');
        f.className = 'news-date';
        f.textContent = fecha;
        const h = document.createElement('h3');
        h.textContent = titulo;
        const p = document.createElement('p');
        p.textContent = texto;
        card.append(f, h, p);
        grid.append(card);
      });
    } catch (err) {
      console.error('Error AJAX:', err);
      const aviso = location.protocol === 'file:'
        ? ' Abre el sitio con un servidor local (no con doble clic).'
        : '';
      grid.replaceChildren();
      const p = document.createElement('p');
      p.className = 'error-msg visible';
      p.textContent = 'No se pudieron cargar las noticias.' + aviso;
      grid.append(p);
    }
  }
  cargarNoticias();
})();
