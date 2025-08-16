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
  // Salta directamente a la vista de pantalla completa
  cambiarSlide('app-pantalla-completa');
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

// Función para minimizar desde pantalla completa
function minimizarApp() {
  // Vuelve al slide 'escritorio'
  cambiarSlide('escritorio');
}

// Función para cerrar desde pantalla completa
function cerrarAppCompleta() {
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
    hora.textContent = ahora.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  // Si existe el elemento de fecha, actualiza su contenido
  if (fecha) {
    fecha.textContent = ahora.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

// Evento que se dispara cuando el DOM está completamente cargado
window.addEventListener('DOMContentLoaded', () => {
  // ===== INTERACCIONES =====

  // Asigna evento click a toda la pantalla standby para activar el sistema
  const standbyScreen = document.getElementById('standby');
  if (standbyScreen) {
    standbyScreen.addEventListener('click', activarSistema);
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

  // Asigna evento click al botón de minimizar en pantalla completa
  const botonMinimizar = document.getElementById('btn-minimizar');
  if (botonMinimizar) {
    botonMinimizar.addEventListener('click', minimizarApp);
  }

  // Asigna evento click al botón de cerrar en pantalla completa
  const botonCerrarCompleta = document.getElementById('btn-cerrar-completa');
  if (botonCerrarCompleta) {
    botonCerrarCompleta.addEventListener('click', cerrarAppCompleta);
  }

  // ===== RELOJ =====

  // Actualiza la hora inmediatamente al cargar
  actualizarHora();

  // Configura un intervalo para actualizar la hora cada segundo
  window.setInterval(actualizarHora, 1000);
});

// Evento que se dispara cuando todos los recursos (imágenes, estilos) han cargado
window.addEventListener('load', cargarSistema);
