/**
 * EventBus - Sistema de comunicación desacoplada
 * Gestiona eventos entre componentes del sistema
 */
class EventBus {
  constructor() {
    this.events = new Map();
    this.onceEvents = new Map();
  }

  /**
   * Registra un listener para un evento
   * @param {string} event - Nombre del evento
   * @param {Function} callback - Función a ejecutar
   */
  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(callback);
  }

  /**
   * Registra un listener que se ejecuta solo una vez
   * @param {string} event - Nombre del evento
   * @param {Function} callback - Función a ejecutar
   */
  once(event, callback) {
    if (!this.onceEvents.has(event)) {
      this.onceEvents.set(event, []);
    }
    this.onceEvents.get(event).push(callback);
  }

  /**
   * Emite un evento a todos los listeners registrados
   * @param {string} event - Nombre del evento
   * @param {*} data - Datos a pasar a los listeners
   */
  emit(event, data = null) {
    // Ejecutar listeners regulares
    if (this.events.has(event)) {
      this.events.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error en listener de evento ${event}:`, error);
        }
      });
    }

    // Ejecutar listeners de una vez y limpiarlos
    if (this.onceEvents.has(event)) {
      const callbacks = this.onceEvents.get(event);
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error en listener once de evento ${event}:`, error);
        }
      });
      this.onceEvents.delete(event);
    }
  }

  /**
   * Remueve un listener específico de un evento
   * @param {string} event - Nombre del evento
   * @param {Function} callback - Función a remover
   */
  off(event, callback) {
    if (this.events.has(event)) {
      const callbacks = this.events.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Limpia todos los listeners de un evento
   * @param {string} event - Nombre del evento
   */
  clear(event) {
    if (event) {
      this.events.delete(event);
      this.onceEvents.delete(event);
    } else {
      this.events.clear();
      this.onceEvents.clear();
    }
  }

  /**
   * Obtiene el número de listeners para un evento
   * @param {string} event - Nombre del evento
   * @returns {number} Número de listeners
   */
  listenerCount(event) {
    let count = 0;
    if (this.events.has(event)) {
      count += this.events.get(event).length;
    }
    if (this.onceEvents.has(event)) {
      count += this.onceEvents.get(event).length;
    }
    return count;
  }
}

// Exportar como singleton global
const eventBus = new EventBus();
export default eventBus;