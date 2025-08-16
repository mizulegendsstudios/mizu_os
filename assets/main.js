'use strict'; // Modo estricto para evitar prácticas inseguras y optimizar el rendimiento

/* eslint-env browser */ // Indica a ESLint que este código se ejecutará en un navegador

// Función para cambiar entre diferentes "slides" (vistas/pantallas)
function cambiarSlide(id) {
  // Selecciona todos los elementos con clase 'slide'
  document.querySelectorAll('.slide').forEach((slide) => {
    // Remueve la clase 'active' de cada slide (oculta todos los slides)
    slide.classList.remove('active');
  });

  // Busca el slide específico por su ID
  const destino = document.getElementById(id);
  // Si el slide existe, le agrega la clase 'active' (lo hace visible)
  if (destino) {
    destino.classList.add('active');
  }
}

// Función que se ejecuta al cargar la página
function cargarSistema() {
  // Establece un temporizador para cambiar al slide 'standby' después de 2.7 segundos
  window.setTimeout(() => {
    cambiarSlide('standby');
  }, 2700);
}

// Función para activar el sistema principal (pantalla de escritorio)
function activarSistema() {
  // Cambia al slide 'escritorio'
  cambiarSlide('escritorio');
}

// Función para volver al modo standby (pantalla de reposo)
function volverStandby() {
  // Cambia al slide 'standby'
  cambiarSlide('standby');

  // Oculta la ventana de aplicaciones si existe
  const ventana = document.getElementById('ventana-app');
  if (ventana) {
    ventana.style.display = 'none';
  }
}

// Función para abrir una aplicación
function abrirApp() {
  // Salta directamente a la vista maximizada
  cambiarSlide('app-maximizado');
}

// Función para maximizar una aplicación
function maximizarApp() {
  // Cambia al slide 'app-maximizado' (vista maximizada)
  cambiarSlide('app-maximizado');
}

// Función para cerrar la vista maximizada
function cerrarMaximizado() {
  // Vuelve al slide 'escritorio'
  cambiarSlide('escritorio');
}

// Función para actualizar la hora y fecha mostradas
function actualizarHora() {
  // Obtiene la fecha y hora actual
  const ahora = new Date();

  // Busca los elementos para mostrar hora y fecha
  const hora = document.getElementById('hora');
  const fecha = document.getElementById('fecha');

  // Si existe el elemento de hora, actualiza su contenido
  if (hora) {
    hora.textContent = ahora.toLocaleTimeString();
  }

  // Si existe el elemento de fecha, actualiza su contenido
  if (fecha) {
    fecha.textContent = ahora.toLocaleDateString();
  }
}

// Evento que se dispara cuando el DOM está completamente cargado
window.addEventListener('DOMContentLoaded', () => {
  // ===== INTERACCIONES =====

  // Asigna evento click al logo en modo standby para activar el sistema
  const logoStandby = document.getElementById('logo-standby');
  if (logoStandby) {
    logoStandby.addEventListener('click', activarSistema);
  }

  // Asigna evento click al botón de salir para volver a standby
  const botonSalir = document.getElementById('btn-salir');
  if (botonSalir) {
    botonSalir.addEventListener('click', volverStandby);
  }

  // Asigna evento click a todos los iconos para abrir aplicaciones
  const iconosAbrir = document.querySelectorAll('.abrir-app');
  iconosAbrir.forEach((icono) => {
    icono.addEventListener('click', abrirApp);
  });

  // Asigna evento click al botón de maximizar
  const botonMax = document.getElementById('btn-maximizar');
  if (botonMax) {
    botonMax.addEventListener('click', maximizarApp);
  }

  // Asigna evento click al botón de cerrar vista maximizada
  const botonCerrar = document.getElementById('btn-cerrar');
  if (botonCerrar) {
    botonCerrar.addEventListener('click', cerrarMaximizado);
  }

  // ===== RELOJ =====

  // Actualiza la hora inmediatamente al cargar
  actualizarHora();

  // Configura un intervalo para actualizar la hora cada segundo
  window.setInterval(actualizarHora, 1000);
});

// Evento que se dispara cuando todos los recursos (imágenes, estilos) han cargado
window.addEventListener('load', cargarSistema);
