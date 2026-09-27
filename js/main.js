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

/**
 * Spotlight cards: exposes the pointer position as --x / --y for the CSS glow.
 * Only on devices with a fine pointer and no reduced-motion preference.
 */
function initSpotlight() {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canHover || reduceMotion) return;

  document.querySelectorAll('[data-spotlight]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--y', `${event.clientY - rect.top}px`);
    });
  });
}

/**
 * Shows a short message in the live region (read by screen readers too).
 */
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
      // Permission denied: fall through to the legacy method
    }
  }

  // Fallback for non-secure contexts or denied clipboard permission
  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.append(field);
  field.select();
  const ok = document.execCommand('copy');
  field.remove();
  if (!ok) throw new Error('Copy command failed');
}

/**
 * Copy-to-clipboard buttons: <button data-copy="text">.
 */
function initCopyButtons() {
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
        }, 2400);
      } catch {
        showToast('No se pudo copiar. Escribe a ' + button.dataset.copy);
      }
    });
  });
}

function init() {
  initCurrentYear();
  initNav();
  initHeaderScroll();
  initActiveSection();
  initSpotlight();
  initCopyButtons();
}

init();
