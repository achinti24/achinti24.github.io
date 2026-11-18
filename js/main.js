/**
 * Achinti Morales · Portafolio
 * Vanilla JS, sin dependencias. Cada módulo se inicializa desde init().
 */

'use strict';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initCurrentYear() {
  const year = document.querySelector('[data-current-year]');
  if (year) year.textContent = new Date().getFullYear();
}

/**
 * Menú del teléfono: abre y cierra, y se cierra al elegir un enlace,
 * con Escape (devuelve el foco al botón) o con un clic fuera.
 */
function initNav() {
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-nav-menu]');
  const label = document.querySelector('[data-nav-label]');
  if (!header || !toggle || !menu) return;

  const desktop = window.matchMedia('(min-width: 64rem)');
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  const setOpen = (open) => {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = open ? 'Cerrar' : 'Menú';
  };

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
 * Marca en la navegación la sección que cruza el centro de la pantalla.
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

let toastTimer;
function showToast(message) {
  const toast = document.querySelector('[data-toast]');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Permiso denegado: se intenta con el método antiguo
    }
  }

  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.append(field);
  field.select();
  const copied = document.execCommand('copy');
  field.remove();
  if (!copied) throw new Error('No se pudo copiar el texto');
}

/**
 * Botones que copian al portapapeles: <button data-copy="texto">.
 */
function initCopyButtons() {
  const feedbackMs = 2400;

  document.querySelectorAll('[data-copy]').forEach((button) => {
    const label = button.querySelector('[data-copy-label]');
    const original = label ? label.textContent : '';

    button.addEventListener('click', async () => {
      try {
        await copyText(button.dataset.copy);
        button.classList.add('is-copied');
        if (label) label.textContent = 'Copiado';
        showToast('Email copiado al portapapeles');

        setTimeout(() => {
          button.classList.remove('is-copied');
          if (label) label.textContent = original;
        }, feedbackMs);
      } catch {
        showToast('No se pudo copiar. Escribe a ' + button.dataset.copy);
      }
    });
  });
}

/**
 * Cupón de contacto: la vacante elegida decide qué hoja de vida se descarga
 * y qué proyectos conviene mirar primero. Sin JS se descarga la Full Stack.
 */
const CV_BY_ROLE = {
  fullstack: {
    file: 'assets/cv/cv-achinti-morales-fullstack.pdf',
    note: 'Mira primero Ronda y Casacas Colegial.',
  },
  backend: {
    file: 'assets/cv/cv-achinti-morales-backend.pdf',
    note: 'Mira primero Ronda: NestJS, PostgreSQL con Row-Level Security y 637 tests.',
  },
  frontend: {
    file: 'assets/cv/cv-achinti-morales-frontend.pdf',
    note: 'Mira primero Ronda y Menú 3D: React 19, TypeScript y Three.js.',
  },
  'automatizacion-ia': {
    file: 'assets/cv/cv-achinti-morales-automatizacion-ia.pdf',
    note: 'Mira primero el chatbot de LH Uniformes y IA-Ludik.',
  },
};

function initCvPicker() {
  const form = document.querySelector('[data-cv-picker]');
  if (!form) return;

  const link = form.querySelector('[data-cv-link]');
  const note = form.querySelector('[data-cv-note]');

  form.addEventListener('submit', (event) => event.preventDefault());
  form.addEventListener('change', (event) => {
    const choice = CV_BY_ROLE[event.target.value];
    if (!choice) return;
    link.href = choice.file;
    note.textContent = choice.note;
  });
}

/**
 * Entradas al hacer scroll, escalonadas dentro de cada sección. Las clases
 * solo se ponen aquí, así que sin JS o sin movimiento todo queda visible.
 */
function initReveal() {
  const isPhone = window.matchMedia('(max-width: 40rem)').matches;
  if (isPhone || prefersReducedMotion() || !('IntersectionObserver' in window)) return;

  const staggerMs = 80;
  const maxSteps = 6;
  const targets = document.querySelectorAll('[data-reveal]');

  targets.forEach((el) => {
    const section = el.closest('section');
    const peers = section ? [...section.querySelectorAll('[data-reveal]')] : [el];
    const step = Math.min(peers.indexOf(el), maxSteps);
    el.style.setProperty('--reveal-delay', `${step * staggerMs}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px 20% 0px' }
  );

  document.documentElement.classList.add('has-motion');
  targets.forEach((el) => observer.observe(el));
}

function init() {
  initCurrentYear();
  initNav();
  initActiveSection();
  initCopyButtons();
  initCvPicker();
  initReveal();
}

init();
