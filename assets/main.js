'use strict';
/* eslint-env browser */

function cambiarSlide(id) {
  document.querySelectorAll('.slide').forEach((slide) => slide.classList.remove('active'));
  var destino = document.getElementById(id);
  if (destino) destino.classList.add('active');
}

function cargarSistema() {
  window.setTimeout(function () {
    cambiarSlide('standby');
  }, 2700);
}

function activarSistema() {
  cambiarSlide('escritorio');
}

function volverStandby() {
  cambiarSlide('standby');
  var ventana = document.getElementById('ventana-app');
  if (ventana) ventana.style.display = 'none';
}

function abrirApp() {
  var ventana = document.getElementById('ventana-app');
  if (ventana) ventana.style.display = 'block';
}

function maximizarApp() {
  cambiarSlide('app-maximizado');
}

function cerrarMaximizado() {
  cambiarSlide('escritorio');
}

function actualizarHora() {
  var ahora = new Date();
  var hora = document.getElementById('hora');
  var fecha = document.getElementById('fecha');

  // Usar hora y fecha locales del dispositivo con opciones legibles
  var opcionesHora = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  var opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  if (hora) hora.textContent = ahora.toLocaleTimeString(undefined, opcionesHora);
  if (fecha) fecha.textContent = ahora.toLocaleDateString(undefined, opcionesFecha);
}

window.addEventListener('DOMContentLoaded', function () {
  // Permitir activar haciendo clic en cualquier parte del standby
  var slideStandby = document.getElementById('standby');
  if (slideStandby) {
    slideStandby.addEventListener('click', activarSistema);
    slideStandby.setAttribute('role', 'button');
    slideStandby.setAttribute('aria-label', 'Activar sistema');
    slideStandby.tabIndex = 0;
    slideStandby.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') activarSistema();
    });
  }

  // Interacciones existentes
  var logoStandby = document.getElementById('logo-standby');
  if (logoStandby) logoStandby.addEventListener('click', activarSistema);

  var botonSalir = document.getElementById('btn-salir');
  if (botonSalir) botonSalir.addEventListener('click', volverStandby);

  var iconosAbrir = document.querySelectorAll('.abrir-app');
  iconosAbrir.forEach(function (icono) {
    icono.addEventListener('click', abrirApp);
  });

  var botonMax = document.getElementById('btn-maximizar');
  if (botonMax) botonMax.addEventListener('click', maximizarApp);

  var botonCerrar = document.getElementById('btn-cerrar');
  if (botonCerrar) botonCerrar.addEventListener('click', cerrarMaximizado);

  // Reloj
  actualizarHora();
  window.setInterval(actualizarHora, 1000);
});

window.addEventListener('load', cargarSistema);
