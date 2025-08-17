'use strict';
/* eslint-env browser */

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

function abrirApp() {
  cambiarSlide('app-maximizado');
}

function maximizarApp() {
  cambiarSlide('app-maximizado');
}

function cerrarMaximizado() {
  cambiarSlide('escritorio');
}

function cerrarAppCompleta() {
  cambiarSlide('escritorio');
}

function irPantallaCompleta() {
  cambiarSlide('app-pantalla-completa');
}

function minimizarApp() {
  cambiarSlide('app-maximizado');
}

function actualizarHora() {
  const ahora = new Date();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  const hora = document.getElementById('hora');
  const fecha = document.getElementById('fecha');

  if (hora) {
    hora.textContent = ahora.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: tz
    });
  }
  if (fecha) {
    fecha.textContent = ahora.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: tz
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
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

  const iconosAbrir = document.querySelectorAll('.abrir-app');
  iconosAbrir.forEach((icono) => icono.addEventListener('click', abrirApp));

  const botonMax = document.getElementById('btn-maximizar');
  if (botonMax) botonMax.addEventListener('click', maximizarApp);

  const botonCerrar = document.getElementById('btn-cerrar');
  if (botonCerrar) botonCerrar.addEventListener('click', cerrarMaximizado);

  const botonMinimizar = document.getElementById('btn-minimizar');
  if (botonMinimizar) botonMinimizar.addEventListener('click', minimizarApp);

  const botonCerrarCompleta = document.getElementById('btn-cerrar-completa');
  if (botonCerrarCompleta) botonCerrarCompleta.addEventListener('click', cerrarAppCompleta);

  const botonPantallaCompleta = document.getElementById('btn-pantalla-completa');
  if (botonPantallaCompleta) botonPantallaCompleta.addEventListener('click', irPantallaCompleta);

  actualizarHora();
  window.setInterval(actualizarHora, 1000);
});

window.addEventListener('load', cargarSistema);
