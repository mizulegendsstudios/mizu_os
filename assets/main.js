'use strict';
/* eslint-env browser */

// Estado actual del sistema
var appState = { currentAppId: 1 };

// Nombres de las aplicaciones por ID
const nombresApps = {
  1: 'Explorador de Archivos',
  2: 'Galería',
  3: 'Reproductor de Música',
  4: 'Bloc de Notas',
  5: 'Navegador Web',
  6: 'Juego',
  7: 'Ajustes'
};

/**
 * Cambia a una diapositiva específica
 * @param {string} id - ID de la diapositiva destino
 */
function cambiarSlide(id) {
  document.querySelectorAll('.slide').forEach((slide) => {
    slide.classList.remove('active');
  });
  const destino = document.getElementById(id);
  if (destino) destino.classList.add('active');
}

/**
 * Inicia el sistema tras la carga
 */
function cargarSistema() {
  window.setTimeout(() => {
    cambiarSlide('standby');
  }, 2700);
}

/**
 * Activa el sistema (pasa a escritorio)
 */
function activarSistema() {
  cambiarSlide('escritorio');
}

/**
 * Vuelve al modo standby
 */
function volverStandby() {
  cambiarSlide('standby');
  const ventana = document.getElementById('ventana-app');
  if (ventana) ventana.style.display = 'none';
}

/**
 * Actualiza todos los títulos según la app actual
 */
function actualizarTitulos() {
  const id = appState.currentAppId || 1;
  const nombre = nombresApps[id] || `App ${id}`;

  const titleMax = document.getElementById('app-title-max');
  if (titleMax) titleMax.textContent = `${nombre} Maximizada`;

  const titleFull = document.getElementById('app-title-full');
  if (titleFull) titleFull.textContent = `${nombre} Modo Pantalla Completa`;

  const appTitle = document.getElementById('app-title');
  if (appTitle) appTitle.textContent = nombre;
}

/**
 * Abre una app desde el escritorio
 * @param {MouseEvent} ev - Evento de clic
 */
function abrirApp(ev) {
  const target = ev.currentTarget;
  const appId = Number(target.dataset.app);
  if (!appId || appId < 1 || appId > 7) return;

  appState.currentAppId = appId;
  actualizarTitulos();

  // Mostrar ventana en el escritorio
  const ventana = document.getElementById('ventana-app');
  if (ventana) {
    ventana.style.display = 'block';
  }
}

/**
 * Maximiza la app actual
 */
function maximizarApp() {
  actualizarTitulos();
  cambiarSlide('app-maximizado');
}

/**
 * Cierra la app maximizada y vuelve al escritorio
 */
function cerrarMaximizado() {
  cambiarSlide('escritorio');
}

/**
 * Minimiza desde pantalla completa (vuelve a maximizado)
 */
function minimizarApp() {
  actualizarTitulos();
  cambiarSlide('app-maximizado');
}

/**
 * Cierra la app desde pantalla completa
 */
function cerrarAppCompleta() {
  cambiarSlide('escritorio');
}

/**
 * Entra en modo pantalla completa
 */
function irPantallaCompleta() {
  actualizarTitulos();
  cambiarSlide('app-pantalla-completa');
}

/**
 * Actualiza reloj y fecha
 */
function actualizarHora() {
  const ahora = new Date();
  const locale = navigator.language || 'es-ES';

  const hora = document.getElementById('hora');
  if (hora) {
    hora.textContent = ahora.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  const fecha = document.getElementById('fecha');
  if (fecha) {
    fecha.textContent = ahora.toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

/**
 * Inicialización al cargar el DOM
 */
window.addEventListener('DOMContentLoaded', () => {
  // Standby: clic o Enter/espacio
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

  // Botón "salir" vuelve a standby
  const botonSalir = document.getElementById('btn-salir');
  if (botonSalir) {
    botonSalir.addEventListener('click', volverStandby);
  }

  // Abrir apps por ícono
  document.querySelectorAll('.abrir-app').forEach((icono) => {
    icono.addEventListener('click', abrirApp);
  });

  // Botón maximizar (desde ventana normal)
  const botonMax = document.getElementById('btn-maximizar');
  if (botonMax) {
    botonMax.addEventListener('click', maximizarApp);
  }

  // Botón cerrar (desde maximizado)
  const botonCerrar = document.getElementById('btn-cerrar');
  if (botonCerrar) {
    botonCerrar.addEventListener('click', cerrarMaximizado);
  }

  // Botón minimizar (desde pantalla completa)
  const botonMinimizar = document.getElementById('btn-minimizar');
  if (botonMinimizar) {
    botonMinimizar.addEventListener('click', minimizarApp);
  }

  // Botón cerrar (desde pantalla completa)
  const botonCerrarCompleta = document.getElementById('btn-cerrar-completa');
  if (botonCerrarCompleta) {
    botonCerrarCompleta.addEventListener('click', cerrarAppCompleta);
  }

  // Todos los botones de "Pantalla completa" (clase común)
  document.querySelectorAll('.btn-fullscreen').forEach((btn) => {
    btn.addEventListener('click', irPantallaCompleta);
  });

  // Inicializar
  actualizarTitulos();
  actualizarHora();
  window.setInterval(actualizarHora, 1000);
});

// Iniciar carga del sistema al cargar la página
window.addEventListener('load', cargarSistema);
