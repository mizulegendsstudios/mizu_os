/**
 * State - Gestión del estado global del sistema
 * Máquina de estados simple para el Cloud OS
 */
class State {
  constructor() {
    this.currentState = 'boot';
    this.states = new Map();
    this.transitions = new Map();
    this.data = new Map();
    
    this.initializeStates();
  }

  /**
   * Inicializa los estados disponibles del sistema
   */
  initializeStates() {
    this.states.set('boot', {
      name: 'boot',
      description: 'Sistema iniciando',
      canTransitionTo: ['menu', 'error']
    });

    this.states.set('menu', {
      name: 'menu',
      description: 'Menú principal',
      canTransitionTo: ['app', 'settings', 'boot']
    });

    this.states.set('app', {
      name: 'app',
      description: 'Aplicación activa',
      canTransitionTo: ['menu', 'fullscreen', 'boot']
    });

    this.states.set('fullscreen', {
      name: 'fullscreen',
      description: 'Aplicación en pantalla completa',
      canTransitionTo: ['app', 'menu', 'boot']
    });

    this.states.set('settings', {
      name: 'settings',
      description: 'Configuración del sistema',
      canTransitionTo: ['menu', 'boot']
    });

    this.states.set('error', {
      name: 'error',
      description: 'Estado de error',
      canTransitionTo: ['boot']
    });
  }

  /**
   * Cambia al estado especificado si es válido
   * @param {string} newState - Nuevo estado
   * @param {*} data - Datos adicionales para el cambio
   * @returns {boolean} True si el cambio fue exitoso
   */
  changeState(newState, data = null) {
    if (!this.states.has(newState)) {
      console.error(`Estado inválido: ${newState}`);
      return false;
    }

    const currentStateData = this.states.get(this.currentState);
    if (!currentStateData.canTransitionTo.includes(newState)) {
      console.error(`Transición inválida de ${this.currentState} a ${newState}`);
      return false;
    }

    const previousState = this.currentState;
    this.currentState = newState;
    
    // Emitir evento de cambio de estado
    if (window.eventBus) {
      window.eventBus.emit('stateChanged', {
        from: previousState,
        to: newState,
        data: data
      });
    }

    console.log(`Estado cambiado: ${previousState} → ${newState}`);
    return true;
  }

  /**
   * Obtiene el estado actual
   * @returns {string} Estado actual
   */
  getCurrentState() {
    return this.currentState;
  }

  /**
   * Obtiene información del estado actual
   * @returns {Object} Información del estado actual
   */
  getCurrentStateInfo() {
    return this.states.get(this.currentState);
  }

  /**
   * Verifica si se puede cambiar a un estado específico
   * @param {string} state - Estado a verificar
   * @returns {boolean} True si es válido
   */
  canTransitionTo(state) {
    const currentStateData = this.states.get(this.currentState);
    return currentStateData && currentStateData.canTransitionTo.includes(state);
  }

  /**
   * Obtiene todos los estados disponibles
   * @returns {Array} Lista de estados disponibles
   */
  getAvailableStates() {
    return Array.from(this.states.keys());
  }

  /**
   * Almacena datos en el estado
   * @param {string} key - Clave de los datos
   * @param {*} value - Valor a almacenar
   */
  setData(key, value) {
    this.data.set(key, value);
  }

  /**
   * Obtiene datos del estado
   * @param {string} key - Clave de los datos
   * @returns {*} Valor almacenado
   */
  getData(key) {
    return this.data.get(key);
  }

  /**
   * Limpia todos los datos del estado
   */
  clearData() {
    this.data.clear();
  }

  /**
   * Resetea el estado al estado inicial
   */
  reset() {
    this.currentState = 'boot';
    this.clearData();
  }
}

export default State;