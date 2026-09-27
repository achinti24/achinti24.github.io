/**
 * Achinti Morales · Portafolio
 * Vanilla JS, sin dependencias. Cada módulo se inicializa desde init().
 */

'use strict';

function initCurrentYear() {
  const year = document.querySelector('[data-current-year]');
  if (year) year.textContent = new Date().getFullYear();
}

function init() {
  initCurrentYear();
}

init();
