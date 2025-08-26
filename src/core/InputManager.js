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
    
    this.setupKeyboardNavigation();
    this.initializeEventListeners();
  }

  /**
   * Configura la navegación por teclado
   */
  setupKeyboardNavigation() {
    this.keyMap = {
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
      'Enter': 'positive',
      'Escape': 'negative',
      ' ': 'positive',
      'Tab': 'next',
      'Shift+Tab': 'previous'
    };
  }

  /**
   * Inicializa los listeners de eventos del sistema
   */
  initializeEventListeners() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    document.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    document.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    document.addEventListener('touchmove', (e) => this.handleTouchMove(e));
  }

  /**
   * Maneja el evento de tecla presionada
   */
  handleKeyDown(e) {
    const key = e.key;
    this.keys.add(key);
    
    if (this.keyMap[key]) {
      e.preventDefault();
    }
    
    eventBus.emit('keyDown', { key, code: e.code });
    this.processNavigation(key);
  }

  /**
   * Maneja el evento de tecla liberada
   */
  handleKeyUp(e) {
    const key = e.key;
    this.keys.delete(key);
    eventBus.emit('keyUp', { key, code: e.code });
  }

  /**
   * Maneja el evento de mouse presionado
   */
  handleMouseDown(e) {
    const target = e.target;
    
    if (target.classList.contains('system-button')) {
      const action = target.dataset.action;
      if (action) {
        this.handleButtonAction(action, target);
      }
    }
    
    eventBus.emit('mouseClick', { x: e.clientX, y: e.clientY, target });
  }

  /**
   * Maneja el movimiento del mouse
   */
  handleMouseMove(e) {
    this.cursor.x = e.clientX;
    this.cursor.y = e.clientY;
    eventBus.emit('cursorMove', { x: this.cursor.x, y: this.cursor.y });
  }

  /**
   * Maneja el inicio del touch
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
    
    eventBus.emit('touchStart', { x: touch.clientX, y: touch.clientY, target });
  }

  /**
   * Maneja el movimiento del touch
   */
  handleTouchMove(e) {
    const touch = e.touches[0];
    this.cursor.x = touch.clientX;
    this.cursor.y = touch.clientY;
    eventBus.emit('touchMove', { x: this.cursor.x, y: this.cursor.y });
  }

  /**
   * Procesa la navegación por teclado
   */
  processNavigation(key) {
    const action = this.keyMap[key];
    if (!action) return;
    
    switch (action) {
      case 'up': this.navigateUp(); break;
      case 'down': this.navigateDown(); break;
      case 'left': this.navigateLeft(); break;
      case 'right': this.navigateRight(); break;
      case 'positive': this.triggerPositiveAction(); break;
      case 'negative': this.triggerNegativeAction(); break;
      case 'next': this.navigateNext(); break;
      case 'previous': this.navigatePrevious(); break;
    }
  }

  /**
   * Métodos de navegación
   */
  navigateUp() { eventBus.emit('navigate', { direction: 'up' }); }
  navigateDown() { eventBus.emit('navigate', { direction: 'down' }); }
  navigateLeft() { eventBus.emit('navigate', { direction: 'left' }); }
  navigateRight() { eventBus.emit('navigate', { direction: 'right' }); }
  navigateNext() { eventBus.emit('navigate', { direction: 'next' }); }
  navigatePrevious() { eventBus.emit('navigate', { direction: 'previous' }); }
  triggerPositiveAction() { eventBus.emit('action', { type: 'positive' }); }
  triggerNegativeAction() { eventBus.emit('action', { type: 'negative' }); }

  /**
   * Maneja la acción de un botón del sistema
   */
  handleButtonAction(action, element) {
    eventBus.emit('buttonAction', { action, element });
  }

  /**
   * Utilidades
   */
  isKeyPressed(key) { return this.keys.has(key); }
  getCursorPosition() { return { ...this.cursor }; }
  setNavigationMode(enabled) { 
    this.navigationMode = enabled;
    eventBus.emit('navigationModeChanged', { enabled });
  }
  reset() {
    this.keys.clear();
    this.buttons.clear();
    this.cursor = { x: 0, y: 0 };
    this.focusedElement = null;
    this.navigationMode = false;
  }
}

export default InputManager;