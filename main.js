(() => {
  'use strict';
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const abierto = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(abierto));
    });
  }
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
