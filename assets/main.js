'use strict';
/* eslint-env browser */

//Body Visible
window.addEventListener("load", () => {
  document.body.style.visibility = "visible";
});

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

  // Actualiza el título en la barra de la ventana principal
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
    // Centrar ventana en pantalla y un poco arriba
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = ventana.offsetWidth;
    const h = ventana.offsetHeight;
    ventana.style.left = ((vw - w) / 2) + 'px';
    ventana.style.top = (vh * 0.18) + 'px';
    ventana.style.right = 'auto';
    ventana.style.bottom = 'auto';
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

  // Botón minimizar (ventana principal)
  const btnMinVentana = document.getElementById('btn-minimizar-ventana');
  if (btnMinVentana) {
    btnMinVentana.addEventListener('click', () => {
      const ventana = document.getElementById('ventana-app');
      if (ventana) ventana.style.display = 'none';
    });
  }
  // Botón maximizar (ventana principal)
  const btnMaxVentana = document.getElementById('btn-maximizar');
  if (btnMaxVentana) {
    btnMaxVentana.addEventListener('click', maximizarApp);
  }
  // Botón cerrar (ventana principal)
  const btnCerrarVentana = document.getElementById('btn-cerrar-ventana');
  if (btnCerrarVentana) {
    btnCerrarVentana.addEventListener('click', () => {
      const ventana = document.getElementById('ventana-app');
      if (ventana) ventana.style.display = 'none';
    });
  }
  // Botón minimizar (maximizada)
  const btnMinMax = document.getElementById('btn-minimizar-max');
  if (btnMinMax) {
    btnMinMax.addEventListener('click', () => {
      cambiarSlide('escritorio');
    });
  }
  // Botón fullscreen (maximizada)
  const btnFullMax = document.getElementById('btn-fullscreen-max');
  if (btnFullMax) {
    btnFullMax.addEventListener('click', irPantallaCompleta);
  }
  // Botón cerrar (maximizada)
  const btnCerrarMax = document.getElementById('btn-cerrar');
  if (btnCerrarMax) {
    btnCerrarMax.addEventListener('click', cerrarMaximizado);
  }
  // Botón minimizar (pantalla completa)
  const btnMinFull = document.getElementById('btn-minimizar');
  if (btnMinFull) {
    btnMinFull.addEventListener('click', minimizarApp);
  }
  // Botón maximizar (pantalla completa)
  const btnMaxFull = document.getElementById('btn-maximizar-full');
  if (btnMaxFull) {
    btnMaxFull.addEventListener('click', maximizarApp);
  }
  // Botón cerrar (pantalla completa)
  const btnCerrarFull = document.getElementById('btn-cerrar-completa');
  if (btnCerrarFull) {
    btnCerrarFull.addEventListener('click', cerrarAppCompleta);
  }

  // Todos los botones de "Pantalla completa" (clase común)
  document.querySelectorAll('.btn-fullscreen').forEach((btn) => {
    btn.addEventListener('click', irPantallaCompleta);
  });

  // Permitir mover la ventana principal
  const barraVentana = document.querySelector('#ventana-app .barra-ventana');
  const ventanaApp = document.getElementById('ventana-app');
  if (barraVentana && ventanaApp) {
    let offsetX = 0, offsetY = 0, isDragging = false;
    barraVentana.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - ventanaApp.offsetLeft;
      offsetY = e.clientY - ventanaApp.offsetTop;
      document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        ventanaApp.style.left = (e.clientX - offsetX) + 'px';
        ventanaApp.style.top = (e.clientY - offsetY) + 'px';
        ventanaApp.style.right = 'auto';
        ventanaApp.style.bottom = 'auto';
      }
    });
    document.addEventListener('mouseup', () => {
      isDragging = false;
      document.body.style.userSelect = '';
    });
  }

  // Permitir redimensionar la ventana principal
  if (ventanaApp) {
    let isResizing = false;
    let currentHandle = null;
    let startX, startY, startW, startH, startL, startT;
    const minW = 180, minH = 120;
    const handles = ventanaApp.querySelectorAll('.resize-handle');
    handles.forEach(handle => {
      handle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        isResizing = true;
        currentHandle = handle;
        startX = e.clientX;
        startY = e.clientY;
        startW = ventanaApp.offsetWidth;
        startH = ventanaApp.offsetHeight;
        startL = ventanaApp.offsetLeft;
        startT = ventanaApp.offsetTop;
        document.body.style.userSelect = 'none';
      });
    });
    document.addEventListener('mousemove', (e) => {
      if (!isResizing || !currentHandle) return;
      let dx = e.clientX - startX;
      let dy = e.clientY - startY;
      let newW = startW, newH = startH, newL = startL, newT = startT;
      if (currentHandle.classList.contains('resize-e')) {
        newW = Math.max(minW, startW + dx);
      } else if (currentHandle.classList.contains('resize-s')) {
        newH = Math.max(minH, startH + dy);
      } else if (currentHandle.classList.contains('resize-w')) {
        newW = Math.max(minW, startW - dx);
        newL = startL + dx;
      } else if (currentHandle.classList.contains('resize-n')) {
        newH = Math.max(minH, startH - dy);
        newT = startT + dy;
      } else if (currentHandle.classList.contains('resize-nw')) {
        newW = Math.max(minW, startW - dx);
        newL = startL + dx;
        newH = Math.max(minH, startH - dy);
        newT = startT + dy;
      } else if (currentHandle.classList.contains('resize-ne')) {
        newW = Math.max(minW, startW + dx);
        newH = Math.max(minH, startH - dy);
        newT = startT + dy;
      } else if (currentHandle.classList.contains('resize-sw')) {
        newW = Math.max(minW, startW - dx);
        newL = startL + dx;
        newH = Math.max(minH, startH + dy);
      } else if (currentHandle.classList.contains('resize-se')) {
        newW = Math.max(minW, startW + dx);
        newH = Math.max(minH, startH + dy);
      }
      ventanaApp.style.width = newW + 'px';
      ventanaApp.style.height = newH + 'px';
      ventanaApp.style.left = newL + 'px';
      ventanaApp.style.top = newT + 'px';
    });
    document.addEventListener('mouseup', () => {
      isResizing = false;
      currentHandle = null;
      document.body.style.userSelect = '';
    });
  }

  // Inicializar
  actualizarTitulos();
  actualizarHora();
  window.setInterval(actualizarHora, 1000);
});

// Iniciar carga del sistema al cargar la página
window.addEventListener('load', cargarSistema);
