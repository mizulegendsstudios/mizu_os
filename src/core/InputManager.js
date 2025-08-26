/**
 * InputManager - Gestión de entrada del sistema
 * Maneja navegación por flechas y botones duales (positivo/negativo)
 */
import eventBus from './EventBus.js';

class InputManager {
  constructor() {
    this.keys = new Set();
    this.buttons = new Map();
    this.cursor = { x: 0, y: 0 };
    this.focusedElement = null;
    this.navigationMode = false;
    
    this.initializeEventListeners();
    this.setupKeyboardNavigation();
  }

  /**
   * Inicializa los listeners de eventos del sistema
   */
  initializeEventListeners() {
    // Eventos de teclado
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    
    // Eventos de mouse
    document.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    
    // Eventos de touch para dispositivos móviles
    document.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    document.addEventListener('touchmove', (e) => this.handleTouchMove(e));
  }

  /**
   * Configura la navegación por teclado
   */
  setupKeyboardNavigation() {
    // Mapeo de teclas a acciones
    this.keyMap = {
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
      'Enter': 'positive',
      'Escape': 'negative',
      ' ': 'positive', // Espacio
      'Tab': 'next',
      'Shift+Tab': 'previous'
    };
  }

  /**
   * Maneja el evento de tecla presionada
   * @param {KeyboardEvent} e - Evento de teclado
   */
  handleKeyDown(e) {
    const key = e.key;
    this.keys.add(key);
    
    // Prevenir comportamiento por defecto para teclas de navegación
    if (this.keyMap[key]) {
      e.preventDefault();
    }
    
    // Emitir evento de tecla presionada
    eventBus.emit('keyDown', { key, code: e.code });
    
    // Procesar navegación
    this.processNavigation(key);
  }

  /**
   * Maneja el evento de tecla liberada
   * @param {KeyboardEvent} e - Evento de teclado
   */
  handleKeyUp(e) {
    const key = e.key;
    this.keys.delete(key);
    
    // Emitir evento de tecla liberada
    eventBus.emit('keyUp', { key, code: e.code });
  }

  /**
   * Maneja el evento de mouse presionado
   * @param {MouseEvent} e - Evento de mouse
   */
  handleMouseDown(e) {
    const target = e.target;
    
    // Verificar si es un botón del sistema
    if (target.classList.contains('system-button')) {
      const action = target.dataset.action;
      if (action) {
        this.handleButtonAction(action, target);
      }
    }
    
    // Emitir evento de click
    eventBus.emit('mouseClick', { x: e.clientX, y: e.clientY, target });
  }

  /**
   * Maneja el movimiento del mouse
   * @param {MouseEvent} e - Evento de mouse
   */
  handleMouseMove(e) {
    this.cursor.x = e.clientX;
    this.cursor.y = e.clientY;
    
    // Emitir evento de movimiento del cursor
    eventBus.emit('cursorMove', { x: this.cursor.x, y: this.cursor.y });
  }

  /**
   * Maneja el inicio del touch
   * @param {TouchEvent} e - Evento de touch
   */
  handleTouchStart(e) {
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (target && target.classList.contains('system-button')) {
      const action = target.dataset.action;
      if (action) {
        this.handleButtonAction(action, target);
      }
    }
    
    // Emitir evento de touch
    eventBus.emit('touchStart', { x: touch.clientX, y: touch.clientY, target });
  }

  /**
   * Maneja el movimiento del touch
   * @param {TouchEvent} e - Evento de touch
   */
  handleTouchMove(e) {
    const touch = e.touches[0];
    this.cursor.x = touch.clientX;
    this.cursor.y = touch.clientY;
    
    // Emitir evento de movimiento del touch
    eventBus.emit('touchMove', { x: this.cursor.x, y: this.cursor.y });
  }

  /**
   * Procesa la navegación por teclado
   * @param {string} key - Tecla presionada
   */
  processNavigation(key) {
    const action = this.keyMap[key];
    
    if (!action) return;
    
    switch (action) {
      case 'up':
        this.navigateUp();
        break;
      case 'down':
        this.navigateDown();
        break;
      case 'left':
        this.navigateLeft();
        break;
      case 'right':
        this.navigateRight();
        break;
      case 'positive':
        this.triggerPositiveAction();
        break;
      case 'negative':
        this.triggerNegativeAction();
        break;
      case 'next':
        this.navigateNext();
        break;
      case 'previous':
        this.navigatePrevious();
        break;
    }
  }

  /**
   * Navega hacia arriba
   */
  navigateUp() {
    eventBus.emit('navigate', { direction: 'up' });
  }

  /**
   * Navega hacia abajo
   */
  navigateDown() {
    eventBus.emit('navigate', { direction: 'down' });
  }

  /**
   * Navega hacia la izquierda
   */
  navigateLeft() {
    eventBus.emit('navigate', { direction: 'left' });
  }

  /**
   * Navega hacia la derecha
   */
  navigateRight() {
    eventBus.emit('navigate', { direction: 'right' });
  }

  /**
   * Navega al siguiente elemento
   */
  navigateNext() {
    eventBus.emit('navigate', { direction: 'next' });
  }

  /**
   * Navega al elemento anterior
   */
  navigatePrevious() {
    eventBus.emit('navigate', { direction: 'previous' });
  }

  /**
   * Dispara la acción positiva (Enter, Espacio)
   */
  triggerPositiveAction() {
    eventBus.emit('action', { type: 'positive' });
  }

  /**
   * Dispara la acción negativa (Escape)
   */
  triggerNegativeAction() {
    eventBus.emit('action', { type: 'negative' });
  }

  /**
   * Maneja la acción de un botón del sistema
   * @param {string} action - Acción del botón
   * @param {HTMLElement} element - Elemento del botón
   */
  handleButtonAction(action, element) {
    eventBus.emit('buttonAction', { action, element });
  }

  /**
   * Verifica si una tecla está presionada
   * @param {string} key - Tecla a verificar
   * @returns {boolean} True si está presionada
   */
  isKeyPressed(key) {
    return this.keys.has(key);
  }

  /**
   * Obtiene la posición actual del cursor
   * @returns {Object} Posición {x, y}
   */
  getCursorPosition() {
    return { ...this.cursor };
  }

  /**
   * Establece el modo de navegación
   * @param {boolean} enabled - True para habilitar navegación
   */
  setNavigationMode(enabled) {
    this.navigationMode = enabled;
    eventBus.emit('navigationModeChanged', { enabled });
  }

  /**
   * Limpia y resetea el gestor de entrada
   */
  reset() {
    this.keys.clear();
    this.buttons.clear();
    this.cursor = { x: 0, y: 0 };
    this.focusedElement = null;
    this.navigationMode = false;
  }
}

export default InputManager;