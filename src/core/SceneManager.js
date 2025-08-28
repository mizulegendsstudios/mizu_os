/**
 * SceneManager - Gestión de escenas del sistema
 * Maneja la transición entre diferentes vistas del Cloud OS
 */
import eventBus from './EventBus.js';

class SceneManager {
  constructor() {
    this.scenes = new Map();
    this.currentScene = null;
    this.sceneContainer = null;
    
    this.initializeEventListeners();
  }

  /**
   * Inicializa los listeners de eventos del sistema
   */
  initializeEventListeners() {
    eventBus.on('stateChanged', (data) => {
      this.handleStateChange(data);
    });

    eventBus.on('sceneReady', (sceneName) => {
      this.activateScene(sceneName);
    });
  }

  /**
   * Registra una nueva escena en el sistema
   * @param {string} name - Nombre de la escena
   * @param {Object} scene - Objeto de la escena
   */
  addScene(name, scene) {
    if (this.scenes.has(name)) {
      console.warn(`Escena ${name} ya existe, sobrescribiendo...`);
    }

    this.scenes.set(name, scene);
    console.log(`Escena ${name} registrada`);
  }

  /**
   * Cambia a la escena especificada
   * @param {string} sceneName - Nombre de la escena destino
   * @param {*} data - Datos adicionales para la escena
   */
  changeScene(sceneName, data = null) {
    if (!this.scenes.has(sceneName)) {
      console.error(`Escena ${sceneName} no encontrada`);
      return false;
    }

    const targetScene = this.scenes.get(sceneName);
    
    // Desactivar escena actual si existe
    if (this.currentScene && this.currentScene.deactivate) {
      this.currentScene.deactivate();
    }

    // Activar nueva escena
    this.currentScene = targetScene;
    
    if (this.currentScene.activate) {
      this.currentScene.activate(data);
    }

    // Emitir evento de cambio de escena
    eventBus.emit('sceneChanged', {
      from: this.currentScene ? this.currentScene.name : null,
      to: sceneName,
      data: data
    });

    console.log(`Escena cambiada a: ${sceneName}`);
    return true;
  }

  /**
   * Obtiene la escena actual
   * @returns {Object} Escena actual
   */
  getCurrentScene() {
    return this.currentScene;
  }

  /**
   * Obtiene una escena específica por nombre
   * @param {string} name - Nombre de la escena
   * @returns {Object} Escena solicitada
   */
  getScene(name) {
    return this.scenes.get(name);
  }

  /**
   * Obtiene todas las escenas registradas
   * @returns {Array} Lista de nombres de escenas
   */
  getAllScenes() {
    return Array.from(this.scenes.keys());
  }

  /**
   * Maneja los cambios de estado del sistema
   * @param {Object} data - Datos del cambio de estado
   */
  handleStateChange(data) {
    const { to } = data;
    
    // Mapear estados a escenas
    const stateToSceneMap = {
      'boot': 'boot',
      'menu': 'menu',
      'app': 'app',
      'fullscreen': 'fullscreen',
      'settings': 'settings',
      'error': 'error'
    };

    const targetScene = stateToSceneMap[to];
    if (targetScene && this.scenes.has(targetScene)) {
      this.changeScene(targetScene, data);
    }
  }

  /**
   * Activa una escena específica
   * @param {string} sceneName - Nombre de la escena
   */
  activateScene(sceneName) {
    if (this.scenes.has(sceneName)) {
      this.changeScene(sceneName);
    }
  }

  /**
   * Establece el contenedor donde se renderizarán las escenas
   * @param {HTMLElement} container - Elemento contenedor
   */
  setSceneContainer(container) {
    this.sceneContainer = container;
    
    // Notificar a todas las escenas sobre el contenedor
    this.scenes.forEach(scene => {
      if (scene.setContainer) {
        scene.setContainer(container);
      }
    });
  }

  /**
   * Obtiene el contenedor de escenas
   * @returns {HTMLElement} Contenedor de escenas
   */
  getSceneContainer() {
    return this.sceneContainer;
  }

  /**
   * Inicializa todas las escenas registradas
   */
  initializeScenes() {
    this.scenes.forEach((scene, name) => {
      if (scene.initialize) {
        scene.initialize();
      }
    });
  }

  /**
   * Limpia y resetea el gestor de escenas
   */
  reset() {
    if (this.currentScene && this.currentScene.deactivate) {
      this.currentScene.deactivate();
    }
    
    this.currentScene = null;
    this.scenes.clear();
  }
}

export default SceneManager;