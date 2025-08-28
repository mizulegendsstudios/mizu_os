/**
 * Mizu OS - Main Entry Point
 * Sistema operativo en la nube con arquitectura modular
 */
import eventBus from './core/EventBus.js';
import SceneManager from './core/SceneManager.js';
import State from './core/State.js';
import InputManager from './core/InputManager.js';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import DesktopScene from './scenes/DesktopSceneLite.js';

/**
 * Clase principal del sistema
 */
class MizuOS {
  constructor() {
    this.eventBus = eventBus;
    this.sceneManager = null;
    this.state = null;
    this.inputManager = null;
    this.isInitialized = false;
    
    // Hacer el EventBus global para compatibilidad
    window.eventBus = this.eventBus;
  }

  /**
   * Inicializa el sistema operativo
   */
  async initialize() {
    try {
      console.log('🚀 Inicializando Mizu OS...');
      
      // Inicializar componentes core
      this.state = new State();
      this.sceneManager = new SceneManager();
      this.inputManager = new InputManager();
      
      console.log('SceneManager inicializado');
      
      // Configurar contenedor de escenas
      const sceneContainer = document.getElementById('scene-container') || document.body;
      this.sceneManager.setSceneContainer(sceneContainer);
      
      // Registrar escenas
      this.registerScenes();
      
      // Configurar event listeners del sistema
      this.setupSystemEventListeners();
      
      // Inicializar escenas
      this.sceneManager.initializeScenes();
      
      this.isInitialized = true;
      console.log('✅ Mizu OS inicializado correctamente');
      
      // Emitir evento de inicialización completa
      this.eventBus.emit('systemReady');
      
      // Cambiar a la escena de boot
      console.log('Cambiando a BootScene');
      this.sceneManager.changeScene('boot');
      
    } catch (error) {
      console.error('❌ Error al inicializar Mizu OS:', error);
      this.eventBus.emit('systemError', { error });
    }
  }

  /**
   * Registra todas las escenas del sistema
   */
  registerScenes() {
    // Escena de boot
    const bootScene = new BootScene();
    this.sceneManager.addScene('boot', bootScene);
    
    // Escena del menú principal
    const menuScene = new MenuScene();
    this.sceneManager.addScene('menu', menuScene);
    
    // Escena del escritorio
    const desktopScene = new DesktopScene();
    this.sceneManager.addScene('desktop', desktopScene);
    
    console.log('📱 Escenas registradas:', this.sceneManager.getAllScenes());
  }

  /**
   * Configura los event listeners del sistema
   */
  setupSystemEventListeners() {
    // === COMENTADO: Este listener causaba duplicidad con SceneManager ===
    // this.eventBus.on('bootComplete', () => {
    //   console.log('🔄 Boot completado, cambiando al menú...');
    //   this.sceneManager.changeScene('menu');
    // });

    // Cambio de escena solicitado
    this.eventBus.on('changeScene', (data) => {
      if (data && data.scene) {
        this.sceneManager.changeScene(data.scene, data.data);
      }
    });

    // Navegación hacia atrás
    this.eventBus.on('goBack', () => {
      // Implementar lógica de navegación hacia atrás
      console.log('⬅️ Navegando hacia atrás...');
    });

    // Apagado del sistema
    this.eventBus.on('shutdown', () => {
      console.log('⏻ Apagando sistema...');
      this.shutdown();
    });

    // Cambio de escena
    this.eventBus.on('sceneChanged', (data) => {
      console.log(`🔄 Escena cambiada: ${data.from} → ${data.to}`);
    });

    // Errores del sistema
    this.eventBus.on('systemError', (data) => {
      console.error('💥 Error del sistema:', data.error);
    });
  }

  /**
   * Apaga el sistema
   */
  shutdown() {
    try {
      // Limpiar recursos
      if (this.sceneManager) {
        this.sceneManager.reset();
      }
      
      if (this.inputManager) {
        this.inputManager.reset();
      }
      
      // Emitir evento de apagado
      this.eventBus.emit('systemShutdown');
      
      console.log('🔄 Sistema apagado correctamente');
      
      // Opcional: recargar la página
      // window.location.reload();
      
    } catch (error) {
      console.error('❌ Error al apagar el sistema:', error);
    }
  }

  /**
   * Obtiene el estado del sistema
   */
  getSystemStatus() {
    return {
      initialized: this.isInitialized,
      currentScene: this.sceneManager ? this.sceneManager.getCurrentScene()?.name : null,
      systemState: this.state ? this.state.getCurrentState() : null,
      registeredScenes: this.sceneManager ? this.sceneManager.getAllScenes() : []
    };
  }
}

// Inicializar el sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌊 Mizu OS - Sistema Operativo en la Nube');
  
  const mizuOS = new MizuOS();
  
  // Hacer el sistema global para debugging
  window.mizuOS = mizuOS;
  
  // Inicializar el sistema
  mizuOS.initialize();
});

// Exportar para uso en módulos
export default MizuOS;
