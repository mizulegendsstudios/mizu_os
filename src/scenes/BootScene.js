/**
 * BootScene - Escena de inicio del sistema
 * Maneja la precarga de assets y inicialización básica
 */
import eventBus from '../core/EventBus.js';

class BootScene {
  constructor() {
    this.name = 'boot';
    this.container = null;
    this.assets = new Map();
    this.loadingProgress = 0;
    this.isLoaded = false;
    
    this.initializeEventListeners();
  }

  /**
   * Inicializa los listeners de eventos de la escena
   */
  initializeEventListeners() {
    eventBus.on('assetsLoaded', () => {
      this.onAssetsLoaded();
    });

    eventBus.on('loadingProgress', (data) => {
      this.updateProgress(data.progress);
    });
  }

  /**
   * Inicializa la escena
   */
  initialize() {
    console.log('BootScene inicializada');
    this.createUI();
    this.startLoading();
  }

  /**
   * Crea la interfaz de usuario de la escena
   */
  createUI() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="boot-screen">
        <div class="boot-logo">
          <img src="assets/logo.svg" alt="Mizu OS" class="logo-image">
        </div>
        <div class="boot-progress">
          <div class="progress-bar">
            <div class="progress-fill" id="boot-progress-fill"></div>
          </div>
          <div class="progress-text" id="boot-progress-text">Iniciando sistema...</div>
        </div>
        <div class="boot-status" id="boot-status">Preparando entorno...</div>
      </div>
    `;
  }

  /**
   * Inicia el proceso de carga de assets
   */
  startLoading() {
    this.updateStatus('Iniciando sistema...');
    
    const loadingSteps = [
      { progress: 10, status: 'Inicializando núcleo...' },
      { progress: 25, status: 'Cargando módulos del sistema...' },
      { progress: 40, status: 'Preparando interfaz de usuario...' },
      { progress: 60, status: 'Cargando recursos gráficos...' },
      { progress: 80, status: 'Verificando integridad del sistema...' },
      { progress: 95, status: 'Finalizando inicialización...' },
      { progress: 100, status: 'Sistema listo' }
    ];

    let currentStep = 0;
    const loadStep = () => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        this.updateProgress(step.progress);
        this.updateStatus(step.status);
        currentStep++;
        
        setTimeout(loadStep, 800);
      } else {
        this.onLoadingComplete();
      }
    };

    loadStep();
  }

  /**
   * Actualiza el progreso de carga
   */
  updateProgress(progress) {
    this.loadingProgress = progress;
    
    const progressFill = document.getElementById('boot-progress-fill');
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
  }

  /**
   * Actualiza el texto de estado
   */
  updateStatus(status) {
    const statusElement = document.getElementById('boot-status');
    if (statusElement) {
      statusElement.textContent = status;
    }
  }

  /**
   * Se ejecuta cuando la carga está completa
   */
  onLoadingComplete() {
    this.isLoaded = true;
    this.updateStatus('Sistema listo');
    
    setTimeout(() => {
      eventBus.emit('bootComplete');
    }, 1000);
  }

  /**
   * Se ejecuta cuando todos los assets están cargados
   */
  onAssetsLoaded() {
    console.log('Todos los assets cargados');
  }

  /**
   * Activa la escena
   */
  activate(data) {
    console.log('BootScene activada');
    this.createUI();
    this.startLoading();
  }

  /**
   * Desactiva la escena
   */
  deactivate() {
    console.log('BootScene desactivada');
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

export default BootScene;