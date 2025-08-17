'use strict';
/* eslint-env browser */

var appState = { currentAppId: 1 };

function cambiarSlide(id) {
  document.querySelectorAll('.slide').forEach((slide) => slide.classList.remove('active'));
  const destino = document.getElementById(id);
  if (destino) destino.classList.add('active');
}

function cargarSistema() {
  window.setTimeout(() => {
    cambiarSlide('standby');
  }, 2700);
}

function activarSistema() {
  cambiarSlide('escritorio');
}

function volverStandby() {
  cambiarSlide('standby');
  const ventana = document.getElementById('ventana-app');
  if (ventana) ventana.style.display = 'none';
}

function actualizarTitulos() {
  const id = appState.currentAppId || 1;
  const titleMax = document.getElementById('app-title-max');
  if (titleMax) titleMax.textContent = `App ${id} Maximizada`;
  const titleFull = document.getElementById('app-title-full');
  if (titleFull) titleFull.textContent = `App ${id} Modo Pantalla Completa`;
}

function abrirApp(ev) {
  const target = ev && ev.currentTarget;
  const appId = target && target.dataset && target.dataset.app ? Number(target.dataset.app) : 1;
  appState.currentAppId = appId;
  actualizarTitulos();
  cambiarSlide('app-maximizado');
}

function maximizarApp() {
  actualizarTitulos();
  cambiarSlide('app-maximizado');
}

function cerrarMaximizado() {
  cambiarSlide('escritorio');
}

function minimizarApp() {
  // Salir de pantalla completa a modo maximizado
  actualizarTitulos();
  cambiarSlide('app-maximizado');
}

function cerrarAppCompleta() {
  cambiarSlide('escritorio');
}

function irPantallaCompleta() {
  actualizarTitulos();
  cambiarSlide('app-pantalla-completa');
}

function actualizarHora() {
  const ahora = new Date();
  const locale = navigator.language || undefined;
  const hora = document.getElementById('hora');
  const fecha = document.getElementById('fecha');

  if (hora) {
    hora.textContent = ahora.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
  if (fecha) {
    fecha.textContent = ahora.toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // Standby clickable en toda la pantalla (y accesible con teclado)
  const standbyScreen = document.getElementById('standby');
  if (standbyScreen) {
    standbyScreen.addEventListener('click', activarSistema);
    standbyScreen.setAttribute('role', 'button');
    standbyScreen.setAttribute('aria-label', 'Activar sistema');
    standbyScreen.tabIndex = 0;
    standbyScreen.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') activarSistema();
    });
  }

  const botonSalir = document.getElementById('btn-salir');
  if (botonSalir) botonSalir.addEventListener('click', volverStandby);

  document.querySelectorAll('.abrir-app').forEach((icono) => {
    icono.addEventListener('click', abrirApp);
  });

  const botonMax = document.getElementById('btn-maximizar');
  if (botonMax) botonMax.addEventListener('click', maximizarApp);

  const botonCerrar = document.getElementById('btn-cerrar');
  if (botonCerrar) botonCerrar.addEventListener('click', cerrarMaximizado);

  const botonMinimizar = document.getElementById('btn-minimizar');
  if (botonMinimizar) botonMinimizar.addEventListener('click', minimizarApp);

  const botonCerrarCompleta = document.getElementById('btn-cerrar-completa');
  if (botonCerrarCompleta) botonCerrarCompleta.addEventListener('click', cerrarAppCompleta);

  // Asegurar que todos los botones de “Pantalla completa” funcionen
  document.querySelectorAll('.btn-fullscreen, #btn-pantalla-completa').forEach((btn) => {
    btn.addEventListener('click', irPantallaCompleta);
  });

  actualizarTitulos();
  actualizarHora();
  window.setInterval(actualizarHora, 1000);
});

window.addEventListener('load', cargarSistema);
