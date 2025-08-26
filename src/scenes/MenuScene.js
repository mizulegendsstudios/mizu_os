/**
 * MenuScene - Escena del menú principal del sistema
 * Implementa navegación por flechas y botones duales (positivo/negativo)
 */
import eventBus from '../core/EventBus.js';
import MenuLogic from './MenuLogic.js';

class MenuScene {
  constructor() {
    this.name = 'menu';
    this.container = null;
    this.logic = new MenuLogic();
    
    this.initializeEventListeners();
  }

  /**
   * Inicializa los listeners de eventos de la escena
   */
  initializeEventListeners() {
    eventBus.on('navigate', (data) => this.logic.handleNavigation(data.direction));
    eventBus.on('action', (data) => this.logic.handleAction(data.type));
    eventBus.on('sceneChanged', (data) => {
      if (data.to === 'menu') this.logic.onSceneActivated();
    });
  }

  /**
   * Inicializa la escena
   */
  initialize() {
    console.log('MenuScene inicializada');
  }

  /**
   * Crea la interfaz de usuario de la escena
   */
  createUI() {
    if (!this.container) return;

    this.container.innerHTML = this.generateHTML();
    this.addMenuEventListeners();
  }

  /**
   * Genera el HTML del menú
   */
  generateHTML() {
    const menuItems = this.logic.getMenuItems();
    return `
      <div class="menu-scene">
        <div class="menu-header">
          <h1 class="menu-title">Mizu OS</h1>
          <p class="menu-subtitle">Sistema Operativo en la Nube</p>
        </div>
        
        <div class="menu-container">
          <div class="menu-items" id="menu-items">
            ${menuItems.map((item, index) => `
              <div class="menu-item ${index === 0 ? 'selected' : ''}" 
                   data-index="${index}" 
                   data-action="${item.action}">
                <span class="menu-icon">${item.icon}</span>
                <span class="menu-name">${item.name}</span>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="menu-controls">
          <div class="control-hint">
            <span class="control-key">↑↓</span> Navegar
          </div>
          <div class="control-hint">
            <span class="control-key">Enter</span> Seleccionar
          </div>
          <div class="control-hint">
            <span class="control-key">Esc</span> Volver
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Agrega event listeners a los elementos del menú
   */
  addMenuEventListeners() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.logic.selectedIndex = index;
        this.logic.updateSelection();
        this.logic.executeSelectedItem();
      });
    });
  }

  /**
   * Activa la escena
   */
  activate(data) {
    console.log('MenuScene activada');
    this.logic.setActive(true);
    this.createUI();
    this.logic.selectedIndex = 0;
    this.logic.updateSelection();
  }

  /**
   * Desactiva la escena
   */
  deactivate() {
    console.log('MenuScene desactivada');
    this.logic.setActive(false);
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  /**
   * Establece el contenedor de la escena
   */
  setContainer(container) {
    this.container = container;
  }
}

export default MenuScene;