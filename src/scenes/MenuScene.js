/**
 * MenuScene - Escena del menú principal del sistema
 * Implementa navegación por flechas y botones duales (positivo/negativo)
 */
import eventBus from '../core/EventBus.js';

class MenuScene {
  constructor() {
    this.name = 'menu';
    this.container = null;
    this.menuItems = [];
    this.selectedIndex = 0;
    this.isActive = false;
    
    this.initializeMenuItems();
    this.initializeEventListeners();
  }

  /**
   * Inicializa los elementos del menú
   */
  initializeMenuItems() {
    this.menuItems = [
      { id: 'desktop', name: 'Escritorio', icon: '🖥️', action: 'navigateToDesktop' },
      { id: 'apps', name: 'Aplicaciones', icon: '📱', action: 'navigateToApps' },
      { id: 'files', name: 'Archivos', icon: '📁', action: 'navigateToFiles' },
      { id: 'settings', name: 'Configuración', icon: '⚙️', action: 'navigateToSettings' },
      { id: 'help', name: 'Ayuda', icon: '❓', action: 'navigateToHelp' },
      { id: 'shutdown', name: 'Apagar', icon: '⏻', action: 'shutdownSystem' }
    ];
  }

  /**
   * Inicializa los listeners de eventos de la escena
   */
  initializeEventListeners() {
    // Navegación por teclado
    eventBus.on('navigate', (data) => {
      this.handleNavigation(data.direction);
    });

    // Acciones de botones
    eventBus.on('action', (data) => {
      this.handleAction(data.type);
    });

    // Cambio de escena
    eventBus.on('sceneChanged', (data) => {
      if (data.to === 'menu') {
        this.onSceneActivated();
      }
    });
  }

  /**
   * Maneja la navegación por teclado
   * @param {string} direction - Dirección de navegación
   */
  handleNavigation(direction) {
    if (!this.isActive) return;

    switch (direction) {
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
    }
  }

  /**
   * Maneja las acciones de los botones
   * @param {string} type - Tipo de acción
   */
  handleAction(type) {
    if (!this.isActive) return;

    switch (type) {
      case 'positive':
        this.executeSelectedItem();
        break;
      case 'negative':
        this.goBack();
        break;
    }
  }

  /**
   * Navega hacia arriba en el menú
   */
  navigateUp() {
    this.selectedIndex = (this.selectedIndex - 1 + this.menuItems.length) % this.menuItems.length;
    this.updateSelection();
  }

  /**
   * Navega hacia abajo en el menú
   */
  navigateDown() {
    this.selectedIndex = (this.selectedIndex + 1) % this.menuItems.length;
    this.updateSelection();
  }

  /**
   * Navega hacia la izquierda
   */
  navigateLeft() {
    // Implementar navegación horizontal si es necesario
    console.log('Navegación izquierda');
  }

  /**
   * Navega hacia la derecha
   */
  navigateRight() {
    // Implementar navegación horizontal si es necesario
    console.log('Navegación derecha');
  }

  /**
   * Ejecuta el elemento seleccionado del menú
   */
  executeSelectedItem() {
    const selectedItem = this.menuItems[this.selectedIndex];
    if (selectedItem && selectedItem.action) {
      this.executeAction(selectedItem.action);
    }
  }

  /**
   * Ejecuta una acción específica
   * @param {string} action - Acción a ejecutar
   */
  executeAction(action) {
    switch (action) {
      case 'navigateToDesktop':
        eventBus.emit('changeScene', 'desktop');
        break;
      case 'navigateToApps':
        eventBus.emit('changeScene', 'apps');
        break;
      case 'navigateToFiles':
        eventBus.emit('changeScene', 'files');
        break;
      case 'navigateToSettings':
        eventBus.emit('changeScene', 'settings');
        break;
      case 'navigateToHelp':
        eventBus.emit('changeScene', 'help');
        break;
      case 'shutdownSystem':
        this.confirmShutdown();
        break;
      default:
        console.log(`Acción no implementada: ${action}`);
    }
  }

  /**
   * Confirma el apagado del sistema
   */
  confirmShutdown() {
    if (confirm('¿Estás seguro de que quieres apagar el sistema?')) {
      eventBus.emit('shutdown');
    }
  }

  /**
   * Regresa a la escena anterior
   */
  goBack() {
    eventBus.emit('goBack');
  }

  /**
   * Actualiza la selección visual del menú
   */
  updateSelection() {
    const menuElements = document.querySelectorAll('.menu-item');
    menuElements.forEach((element, index) => {
      element.classList.toggle('selected', index === this.selectedIndex);
    });
  }

  /**
   * Se ejecuta cuando la escena es activada
   */
  onSceneActivated() {
    this.isActive = true;
    this.selectedIndex = 0;
    this.updateSelection();
    console.log('MenuScene activada');
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

    this.container.innerHTML = `
      <div class="menu-scene">
        <div class="menu-header">
          <h1 class="menu-title">Mizu OS</h1>
          <p class="menu-subtitle">Sistema Operativo en la Nube</p>
        </div>
        
        <div class="menu-container">
          <div class="menu-items" id="menu-items">
            ${this.menuItems.map((item, index) => `
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

    // Agregar estilos específicos
    this.addMenuStyles();
    
    // Agregar event listeners a los elementos del menú
    this.addMenuEventListeners();
  }

  /**
   * Agrega los estilos específicos de la escena del menú
   */
  addMenuStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .menu-scene {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
        color: #00e5ff;
        font-family: 'Helvetica Neue', sans-serif;
      }

      .menu-header {
        text-align: center;
        margin-bottom: 60px;
      }

      .menu-title {
        font-size: 48px;
        margin: 0;
        text-shadow: 0 0 20px rgba(0, 229, 255, 0.5);
        animation: titleGlow 2s ease-in-out infinite alternate;
      }

      .menu-subtitle {
        font-size: 18px;
        opacity: 0.7;
        margin: 10px 0 0 0;
      }

      .menu-container {
        margin-bottom: 60px;
      }

      .menu-items {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .menu-item {
        display: flex;
        align-items: center;
        padding: 15px 25px;
        background: rgba(0, 229, 255, 0.1);
        border: 2px solid transparent;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
        min-width: 250px;
      }

      .menu-item:hover {
        background: rgba(0, 229, 255, 0.2);
        border-color: rgba(0, 229, 255, 0.3);
      }

      .menu-item.selected {
        background: rgba(0, 229, 255, 0.3);
        border-color: #00e5ff;
        box-shadow: 0 0 20px rgba(0, 229, 255, 0.3);
      }

      .menu-icon {
        font-size: 24px;
        margin-right: 15px;
        width: 30px;
        text-align: center;
      }

      .menu-name {
        font-size: 18px;
        font-weight: 500;
      }

      .menu-controls {
        display: flex;
        gap: 30px;
        opacity: 0.6;
      }

      .control-hint {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
      }

      .control-key {
        background: rgba(0, 229, 255, 0.2);
        padding: 4px 8px;
        border-radius: 4px;
        font-family: monospace;
        font-weight: bold;
      }

      @keyframes titleGlow {
        from { text-shadow: 0 0 20px rgba(0, 229, 255, 0.5); }
        to { text-shadow: 0 0 30px rgba(0, 229, 255, 0.8); }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Agrega event listeners a los elementos del menú
   */
  addMenuEventListeners() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.selectedIndex = index;
        this.updateSelection();
        this.executeSelectedItem();
      });
    });
  }

  /**
   * Activa la escena
   * @param {*} data - Datos adicionales
   */
  activate(data) {
    console.log('MenuScene activada');
    this.isActive = true;
    this.createUI();
    this.selectedIndex = 0;
    this.updateSelection();
  }

  /**
   * Desactiva la escena
   */
  deactivate() {
    console.log('MenuScene desactivada');
    this.isActive = false;
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  /**
   * Establece el contenedor de la escena
   * @param {HTMLElement} container - Contenedor HTML
   */
  setContainer(container) {
    this.container = container;
  }
}

export default MenuScene;