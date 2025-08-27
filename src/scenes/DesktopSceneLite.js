import '../css/main.css';
import '../css/components/glass.css';
import '../css/scenes/desktop.css';
import '../css/components/button.css';
import { ensureContainer } from '../core/DOM.js';
import eventBus from '../core/EventBus.js';
import UIManager from '../ui/UIManagerSimple.js';
import CanvasCursor from '../entities/CanvasCursor.js';

export default class DesktopSceneLite {
  constructor() {
    this.name = 'desktop';
    this.container = null;
    this.canvas = null;
    this.ctx = null;
    this.ui = new UIManager();
    this.cursor = new CanvasCursor();
    this.icons = [
      { x: 100, y: 100, label: 'App 1', width: 80, height: 80 },
      { x: 200, y: 100, label: 'App 2', width: 80, height: 80 },
      { x: 300, y: 100, label: 'App 3', width: 80, height: 80 }
    ];
    this._raf = 0;

    eventBus.on('cursor:select', ({ x, y }) => this.checkIconSelect(x, y));
  }

  activate(container) {
    this.container = ensureContainer('scene-container', 'width:100vw; height:100vh; position:relative;');
    this._mountCanvas();
    this.ui.addElement({ render: (ctx) => this.renderBackground(ctx) });
    this.ui.addElement(this.cursor);
    this.ui.addElement({ render: (ctx) => this.renderIcons(ctx) });
    this._loop();
  }

  deactivate() {
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this.ui.clear();
    this.canvas = null;
    this.ctx = null;
  }

  _mountCanvas() {
    if (!this.container) {
      console.error('DesktopSceneLite: No hay contenedor (this.container es null)');
      return;
    }

    this.container.innerHTML = '';
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.container.clientWidth || window.innerWidth;
    this.canvas.height = this.container.clientHeight || window.innerHeight;
    this.canvas.style.cssText = 'position:absolute; left:0; top:0; width:100%; height:100%;';
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
  }

  _loop() {
    const draw = () => {
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ui.render(this.ctx);
      this._raf = requestAnimationFrame(draw);
    };
    draw();
  }

  renderBackground(ctx) {
    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  renderIcons(ctx) {
    ctx.font = 'bold 12px Arial';
    this.icons.forEach(icon => {
      ctx.fillStyle = '#1f4068';
      ctx.fillRect(icon.x, icon.y, icon.width, icon.height);
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 2;
      ctx.strokeRect(icon.x + 1, icon.y + 1, icon.width - 2, icon.height - 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(icon.label, icon.x + 10, icon.y + icon.height + 14);
    });
  }

  checkIconSelect(x, y) {
    const icon = this.icons.find(i => 
      x >= i.x && x <= i.x + i.width && 
      y >= i.y && y <= i.y + i.height
    );
    if (icon) {
      eventBus.emit('APP_LAUNCH', icon.label);
      eventBus.emit('OPEN_APP', { id: icon.label });
    }
  }
}
