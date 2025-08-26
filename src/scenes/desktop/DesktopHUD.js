import eventBus from '../../core/EventBus.js';

/**
 * DesktopHUD - Manejo del HUD del escritorio (taskbar y elementos)
 * Responsabilidad: crear y actualizar HUD
 */
class DesktopHUD {
  constructor(uiManager) {
    this.uiManager = uiManager;
  }

  create() {
    this.createTaskbar();
  }

  createTaskbar() {
    this.uiManager.createHUDElement('desktop-taskbar', {
      style: {
        position: 'absolute', bottom: '0', left: '0', width: '100%', height: '40px',
        background: 'rgba(0, 0, 0, 0.8)', borderTop: '1px solid rgba(0, 229, 255, 0.3)',
        display: 'flex', alignItems: 'center', padding: '0 20px', zIndex: '50'
      },
      content: `
        <div style="color: #00e5ff; font-family: Arial, sans-serif; font-size: 12px;">
          Mizu OS - Escritorio
        </div>
        <div style="margin-left: auto; color: #00e5ff; font-size: 12px;" id="desktop-time">
          ${new Date().toLocaleTimeString()}
        </div>
      `
    });

    setInterval(() => {
      const timeElement = document.getElementById('desktop-time');
      if (timeElement) timeElement.textContent = new Date().toLocaleTimeString();
    }, 1000);

    this.uiManager.createButton({
      text: 'Menú', x: 20, y: window.innerHeight - 35, width: 80, height: 30,
      action: 'OPEN_MENU', onClick: () => eventBus.emit('changeScene', { scene: 'menu' })
    });
  }
}

export default DesktopHUD;