/**
 * Achinti Morales · Portafolio
 * Vanilla JS, sin dependencias. Cada módulo se inicializa desde init().
 */

'use strict';

function initCurrentYear() {
  const year = document.querySelector('[data-current-year]');
  if (year) year.textContent = new Date().getFullYear();
}

/**
 * Mobile navigation: toggle, close on link click, Escape or outside click.
 */
function initNav() {
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-nav-menu]');
  if (!header || !toggle || !menu) return;

  const desktop = window.matchMedia('(min-width: 64rem)');

  const setOpen = (open) => {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  toggle.addEventListener('click', () => setOpen(!isOpen()));

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (isOpen() && !header.contains(event.target)) setOpen(false);
  });

  desktop.addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

function init() {
  initCurrentYear();
  initNav();
}

init();
