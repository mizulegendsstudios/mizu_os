'use strict'; // Modo estricto para evitar prácticas inseguras y optimizar el rendimiento

/* eslint-env browser */ // Indica a ESLint que este código se ejecutará en un navegador

// Función para cambiar entre diferentes "slides" (vistas/pantallas)
function cambiarSlide(id) {
  // Oculta todos los slides
  document.querySelectorAll('.slide').forEach((slide) => {
    slide.classList.remove('active');
  });

  // Muestra el slide específico
  const destino = document.getElementById(id);
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
  cambiarSlide('escritorio');
}

// Función para volver al modo standby (pantalla de reposo)
function volverStandby() {
  cambiarSlide('standby');
  
  // Oculta la ventana de aplicaciones si existe
  const ventana = document.getElementById('ventana-app');
  if (ventana) {
    ventana.style.display = 'none';
  }
}

// Función para abrir una aplicación
function abrirApp() {
  // Abre directamente en vista maximizada
  cambiarSlide('app-maximizado');
}

// Función para maximizar una aplicación
function maximizarApp() {
  cambiarSlide('app-maximizado');
}

// Función para cerrar la vista maximizada
function cerrarMaximizado() {
  cambiarSlide('escritorio');
}

// Función para minimizar desde pantalla completa
function minimizarApp() {
  cambiarSlide('escritorio');
}

// Función para cerrar desde pantalla completa
function cerrarAppCompleta() {
  cambiarSlide('escritorio');
}

// Función para ir a pantalla completa desde maximizado
function irPantallaCompleta() {
  cambiarSlide('app-pantalla-completa');
}

// Función para actualizar la hora y fecha mostradas
function actualizarHora() {
  const ahora = new Date();
  const hora = document.getElementById('hora');
  const fecha = document.getElementById('fecha');

  // Actualiza la hora si el elemento existe
  if (hora) {
    hora.textContent = ahora.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  // Actualiza la fecha si el elemento existe
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
  // ===== CONFIGURACIÓN DE INTERACCIONES =====

  // Pantalla standby - click para activar sistema
  const standbyScreen = document.getElementById('standby');
  if (standbyScreen) {
    standbyScreen.addEventListener('click', activarSistema);
    // Accesibilidad: permite activar con teclado
    standbyScreen.setAttribute('role', 'button');
    standbyScreen.setAttribute('aria-label', 'Activar sistema');
    standbyScreen.tabIndex = 0;
    standbyScreen.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        activarSistema();
      }
    });
  }

  // Botón de salir
  const botonSalir = document.getElementById('btn-salir');
  if (botonSalir) {
    botonSalir.addEventListener('click', volverStandby);
  }

  // Iconos para abrir aplicaciones
  const iconosAbrir = document.querySelectorAll('.abrir-app');
  iconosAbrir.forEach((icono) => {
    icono.addEventListener('click', abrirApp);
  });

  // Controles de ventana - maximizar
  const botonMax = document.getElementById('btn-maximizar');
  if (botonMax) {
    botonMax.addEventListener('click', maximizarApp);
  }

  // Controles de ventana - cerrar vista maximizada
  const botonCerrar = document.getElementById('btn-cerrar');
  if (botonCerrar) {
    botonCerrar.addEventListener('click', cerrarMaximizado);
  }

  // Controles de pantalla completa - minimizar
  const botonMinimizar = document.getElementById('btn-minimizar');
  if (botonMinimizar) {
    botonMinimizar.addEventListener('click', minimizarApp);
  }

  // Controles de pantalla completa - cerrar
  const botonCerrarCompleta = document.getElementById('btn-cerrar-completa');
  if (botonCerrarCompleta) {
    botonCerrarCompleta.addEventListener('click', cerrarAppCompleta);
  }

  // Botón para ir a pantalla completa
  const botonPantallaCompleta = document.getElementById('btn-pantalla-completa');
  if (botonPantallaCompleta) {
    botonPantallaCompleta.addEventListener('click', irPantallaCompleta);
  }

  // ===== CONFIGURACIÓN DEL RELOJ =====

  // Actualiza la hora inmediatamente al cargar
  actualizarHora();

  // Configura un intervalo para actualizar la hora cada segundo
  window.setInterval(actualizarHora, 1000);
});

// Evento que se dispara cuando todos los recursos (imágenes, estilos) han cargado
window.addEventListener('load', cargarSistema);