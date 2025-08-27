/**
 * BootScene - Escena de inicio del sistema
 * Maneja la precarga de assets y inicialización básica
 */
import '../css/main.css';
import '../css/components/glass.css';
import '../css/components/slide-transition.css';
import '../css/scenes/boot.css';
import eventBus from '../core/EventBus.js';
import UIManagerCanvas from '../ui/UIManagerCanvas.js';

class BootScene {
  constructor() {
    this.name = 'boot';
    this.uiManager = null;
    this.assets = new Map();
    this.loadingProgress = 0;
    this.isLoaded = false;
    this.hasEmittedComplete = false;
    this.currentStatus = 'Iniciando sistema...';
    
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
    // El loading se inicia en activate(), no aquí
  }

  /**
   * Renderiza la escena de boot
   */
  render() {
    // 🔥 VERIFICAR que uiManager y ctx existan
    if (!this.uiManager || !this.uiManager.ctx) {
      console.warn('BootScene: uiManager o ctx no están listos para renderizar');
      return;
    }

    const ctx = this.uiManager.ctx;
    const width = this.uiManager.canvas.width;
    const height = this.uiManager.canvas.height;
    
    // Limpiar canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    // Logo/texto Mizu OS
    ctx.fillStyle = '#00e5ff';
    ctx.font = 'bold 32px Helvetica Neue';
    ctx.textAlign = 'center';
    ctx.fillText('🌊 Mizu OS', width/2, height/2 - 50);
    
    // Barra de progreso
    const barWidth = 300;
    const barHeight = 20;
    const barX = (width - barWidth) / 2;
    const barY = height/2;
    
    // Fondo barra
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Barra de progreso
    ctx.fillStyle = '#00e5ff';
    ctx.fillRect(barX, barY, (barWidth * this.loadingProgress) / 100, barHeight);
    
    // Texto de progreso
    ctx.fillStyle = '#fff';
    ctx.font = '16px Helvetica Neue';
    ctx.fillText(`${this.loadingProgress}%`, width/2, barY + 40);
    
    // Texto de estado
    ctx.fillStyle = '#888';
    ctx.font = '14px Helvetica Neue';
    ctx.fillText(this.currentStatus, width/2, barY + 70);
  }

  /**
   * Inicia el proceso de carga de assets
   */
  startLoading() {
    this.currentStatus = 'Iniciando sistema...';

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
        
        setTimeout(loadStep, 300);
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
    this.render(); // Ahora es seguro: se llama solo tras ctx verificado
  }

  /**
   * Actualiza el texto de estado
   */
  updateStatus(status) {
    this.currentStatus = status;
    this.render();
  }

  /**
   * Se ejecuta cuando la carga está completa
   */
  onLoadingComplete() {
    if (this.hasEmittedComplete) return;
    this.hasEmittedComplete = true;
    
    this.isLoaded = true;
    this.updateStatus('Sistema listo');
    console.log('BootScene completa, cambiando a MenuScene');
    
    setTimeout(() => {
      const loadingIndicator = document.getElementById('loading-indicator');
      if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
      }
      
      eventBus.emit('changeScene', { scene: 'menu' }); // ✅ Emite 'changeScene', no 'stateChanged'
    }, 500);
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
  activate() {
    console.log('BootScene activada');
    
    // 1. Crear el UI Manager
    this.uiManager = new UIManagerCanvas();
    
    // 2. Montar el canvas
    this.uiManager.mount(0, 0);
    
    // 3. 🔥 VERIFICAR que el contexto 2D esté listo ANTES de continuar
    if (!this.uiManager.ctx) {
      console.error('BootScene: Fallo al crear contexto 2D. Abortando.');
      return;
    }

    // 4. ✅ AHORA es seguro iniciar la carga
    this.startLoading();
  }

  /**
   * Desactiva la escena
   */
  deactivate() {
    console.log('BootScene desactivada');
    if (this.uiManager) {
      this.uiManager.destroy();
      this.uiManager = null;
    }
    this.hasEmittedComplete = false;
  }

  /**
   * Actualiza la escena
   */
  update() {
    // Lógica de actualización si es necesaria
  }
}

export default BootScene;
