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

    // Agregar estilos específicos
    this.addBootStyles();
  }

  /**
   * Agrega los estilos específicos de la escena de boot
   */
  addBootStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .boot-screen {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
        color: #00e5ff;
        font-family: 'Helvetica Neue', sans-serif;
      }

      .boot-logo {
        margin-bottom: 40px;
        animation: logoGlow 2s ease-in-out infinite alternate;
      }

      .logo-image {
        width: 120px;
        height: 120px;
        filter: drop-shadow(0 0 20px rgba(0, 229, 255, 0.5));
      }

      .boot-progress {
        width: 300px;
        margin-bottom: 30px;
      }

      .progress-bar {
        width: 100%;
        height: 8px;
        background: rgba(0, 229, 255, 0.2);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 10px;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #00e5ff, #1a237e);
        width: 0%;
        transition: width 0.3s ease;
      }

      .progress-text {
        text-align: center;
        font-size: 14px;
        opacity: 0.8;
      }

      .boot-status {
        font-size: 12px;
        opacity: 0.6;
        text-align: center;
        max-width: 400px;
      }

      @keyframes logoGlow {
        from { filter: drop-shadow(0 0 20px rgba(0, 229, 255, 0.5)); }
        to { filter: drop-shadow(0 0 30px rgba(0, 229, 255, 0.8)); }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Inicia el proceso de carga de assets
   */
  startLoading() {
    this.updateStatus('Iniciando sistema...');
    
    // Simular carga progresiva
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
   * @param {number} progress - Progreso (0-100)
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
   * @param {string} status - Nuevo estado
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
    
    // Esperar un momento antes de cambiar a la siguiente escena
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
   * @param {*} data - Datos adicionales
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
   * @param {HTMLElement} container - Contenedor HTML
   */
  setContainer(container) {
    this.container = container;
  }
}

export default BootScene;