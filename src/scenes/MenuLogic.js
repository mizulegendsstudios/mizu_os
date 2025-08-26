/**
 * MenuLogic - Lógica del menú separada de la UI
 */
import eventBus from '../core/EventBus.js';

class MenuLogic {
  constructor() {
    this.menuItems = [];
    this.selectedIndex = 0;
    this.isActive = false;
    
    this.initializeMenuItems();
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
   * Maneja la navegación por teclado
   */
  handleNavigation(direction) {
    if (!this.isActive) return;

    switch (direction) {
      case 'up': this.navigateUp(); break;
      case 'down': this.navigateDown(); break;
      case 'left': this.navigateLeft(); break;
      case 'right': this.navigateRight(); break;
    }
  }

  /**
   * Maneja las acciones de los botones
   */
  handleAction(type) {
    if (!this.isActive) return;

    switch (type) {
      case 'positive': this.executeSelectedItem(); break;
      case 'negative': this.goBack(); break;
    }
  }

  /**
   * Métodos de navegación
   */
  navigateUp() {
    this.selectedIndex = (this.selectedIndex - 1 + this.menuItems.length) % this.menuItems.length;
    this.updateSelection();
  }

  navigateDown() {
    this.selectedIndex = (this.selectedIndex + 1) % this.menuItems.length;
    this.updateSelection();
  }

  navigateLeft() { console.log('Navegación izquierda'); }
  navigateRight() { console.log('Navegación derecha'); }

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
   */
  executeAction(action) {
    const actionMap = {
      'navigateToDesktop': () => eventBus.emit('changeScene', 'desktop'),
      'navigateToApps': () => eventBus.emit('changeScene', 'apps'),
      'navigateToFiles': () => eventBus.emit('changeScene', 'files'),
      'navigateToSettings': () => eventBus.emit('changeScene', 'settings'),
      'navigateToHelp': () => eventBus.emit('changeScene', 'help'),
      'shutdownSystem': () => this.confirmShutdown()
    };

    const actionFn = actionMap[action];
    if (actionFn) {
      actionFn();
    } else {
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
   * Getters
   */
  getMenuItems() { return this.menuItems; }
  getSelectedIndex() { return this.selectedIndex; }
  isActive() { return this.isActive; }
  setActive(active) { this.isActive = active; }
}

export default MenuLogic;