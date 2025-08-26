/**
 * DesktopBackground - Encargado del fondo y estilos del escritorio
 * Responsabilidad única: crear y adjuntar el fondo animado
 */
class DesktopBackground {
  constructor(container) {
    this.container = container;
    this.styleId = 'desktop-background-styles';
  }

  attach() {
    const background = document.createElement('div');
    background.className = 'desktop-background';
    background.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
      overflow: hidden;
    `;

    const pattern = document.createElement('div');
    pattern.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image:
        radial-gradient(circle at 25% 25%, rgba(0, 229, 255, 0.1) 1px, transparent 1px),
        radial-gradient(circle at 75% 75%, rgba(0, 255, 136, 0.1) 1px, transparent 1px);
      background-size: 50px 50px;
      animation: backgroundFloat 20s ease-in-out infinite;
    `;

    background.appendChild(pattern);
    this.container.appendChild(background);

    this.injectStyles();
  }

  injectStyles() {
    if (document.getElementById(this.styleId)) return;

    const style = document.createElement('style');
    style.id = this.styleId;
    style.textContent = `
      @keyframes backgroundFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(1deg); }
      }
      .desktop-icon {
        position: absolute;
        width: 64px;
        height: 80px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        user-select: none;
        z-index: 10;
      }
      .desktop-icon:hover { transform: scale(1.1); }
      .desktop-icon.selected {
        background: rgba(0, 255, 136, 0.2);
        border: 2px solid #00ff88;
        border-radius: 8px;
        transform: scale(1.05);
      }
      .desktop-icon-emoji { font-size: 32px; margin-bottom: 5px; }
      .desktop-icon-name {
        font-size: 10px; color: #00e5ff; text-align: center;
        font-family: Arial, sans-serif; text-shadow: 0 0 5px rgba(0, 229, 255, 0.5);
      }
    `;

    document.head.appendChild(style);
  }
}

export default DesktopBackground;