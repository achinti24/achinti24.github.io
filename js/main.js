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

/**
 * Adds a solid background to the header once the page is scrolled.
 */
function initHeaderScroll() {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

/**
 * Highlights the nav link of the section that crosses the middle of the viewport.
 */
function initActiveSection() {
  const links = document.querySelectorAll('.nav__link[href^="#"]');
  if (!links.length || !('IntersectionObserver' in window)) return;

  const linkById = new Map(
    [...links].map((link) => [link.getAttribute('href').slice(1), link])
  );

  const setActive = (id) => {
    links.forEach((link) => {
      const active = link === linkById.get(id);
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );

  document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
}

function init() {
  initCurrentYear();
  initNav();
  initHeaderScroll();
  initActiveSection();
}

init();
