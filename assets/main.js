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
  if (hora) hora.textContent = ahora.toLocaleTimeString();
  if (fecha) fecha.textContent = ahora.toLocaleDateString();
}

window.addEventListener('DOMContentLoaded', function () {
  // Interacciones
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
