/**
 * Constantes del proyecto Mizu OS
 * Configuraciones y valores estáticos del sistema
 */

// Estados del sistema
export const SYSTEM_STATES = {
  BOOT: 'boot',
  MENU: 'menu',
  APP: 'app',
  FULLSCREEN: 'fullscreen',
  SETTINGS: 'settings',
  ERROR: 'error'
};

// Eventos del sistema
export const SYSTEM_EVENTS = {
  BOOT_COMPLETE: 'bootComplete',
  SCENE_CHANGED: 'sceneChanged',
  SYSTEM_READY: 'systemReady',
  SYSTEM_ERROR: 'systemError',
  SYSTEM_SHUTDOWN: 'systemShutdown',
  NAVIGATE: 'navigate',
  ACTION: 'action',
  STATE_CHANGED: 'stateChanged'
};

// Direcciones de navegación
export const NAVIGATION_DIRECTIONS = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
  NEXT: 'next',
  PREVIOUS: 'previous'
};

// Tipos de acciones
export const ACTION_TYPES = {
  POSITIVE: 'positive',
  NEGATIVE: 'negative'
};

// Configuración de la interfaz
export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  TRANSITION_DELAY: 100,
  MENU_ITEM_HEIGHT: 60,
  MENU_ITEM_SPACING: 15
};

// Configuración de assets
export const ASSETS_CONFIG = {
  IMAGE_FORMATS: ['webp', 'png', 'jpg'],
  AUDIO_FORMATS: ['mp3', 'ogg', 'wav'],
  MAX_FILE_SIZE: 10 * 1024 * 1024 // 10MB
};

// Configuración de rendimiento
export const PERFORMANCE_CONFIG = {
  TARGET_FPS: 60,
  FRAME_BUDGET: 16.67, // ms
  MAX_LOADING_TIME: 5000 // ms
};

// Configuración de navegadores soportados
export const BROWSER_SUPPORT = {
  MIN_CHROME_VERSION: 90,
  MIN_FIREFOX_VERSION: 88,
  MIN_SAFARI_VERSION: 14,
  MIN_EDGE_VERSION: 90
};

// Mensajes del sistema
export const SYSTEM_MESSAGES = {
  BOOT_INIT: 'Iniciando sistema...',
  BOOT_CORE: 'Inicializando núcleo...',
  BOOT_MODULES: 'Cargando módulos del sistema...',
  BOOT_UI: 'Preparando interfaz de usuario...',
  BOOT_ASSETS: 'Cargando recursos gráficos...',
  BOOT_VERIFY: 'Verificando integridad del sistema...',
  BOOT_FINAL: 'Finalizando inicialización...',
  BOOT_READY: 'Sistema listo',
  ERROR_INIT: 'Error al inicializar el sistema',
  ERROR_SCENE: 'Error al cambiar de escena',
  ERROR_NAVIGATION: 'Error en la navegación'
};

// Colores del tema
export const THEME_COLORS = {
  PRIMARY: '#00e5ff',
  SECONDARY: '#1a237e',
  BACKGROUND: '#0f0f23',
  BACKGROUND_ALT: '#1a1a2e',
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: 'rgba(255, 255, 255, 0.7)',
  ACCENT: '#00e5ff',
  ERROR: '#ff4444',
  SUCCESS: '#00ff88',
  WARNING: '#ffaa00'
};

// Configuración de sonidos
export const AUDIO_CONFIG = {
  NAVIGATION_VOLUME: 0.3,
  UI_VOLUME: 0.5,
  MUSIC_VOLUME: 0.7,
  MASTER_VOLUME: 1.0
};

// Configuración de almacenamiento
export const STORAGE_CONFIG = {
  PREFIX: 'mizu_os_',
  VERSION: '0.7.2',
  MAX_STORAGE_SIZE: 50 * 1024 * 1024 // 50MB
};