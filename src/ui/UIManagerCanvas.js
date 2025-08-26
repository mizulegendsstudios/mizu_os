import eventBus from '../core/EventBus.js';
import CanvasButton from '../entities/CanvasButton.js';
import CanvasCursor from '../entities/CanvasCursor.js';

export default class UIManagerCanvas {
  constructor(container, opts = {}) {
    this.container = container || document.body;
    this.width = opts.width || 480;
    this.height = opts.height || 240;
    this.canvas = null;
    this.ctx = null;
    this.buttons = [];
    this.cursor = new CanvasCursor();
    this._raf = 0;
  }

  mount(x = 0, y = 0) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.cssText = `position:absolute; left:${x}px; top:${y}px; z-index:10; border:1px solid rgba(0,229,255,0.2)`;
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this._bindPointerEvents();
    this._bindCursorSelect();
    this._loop();
    return this.canvas;
  }

  _bindPointerEvents() {
    const c = this.canvas;
    c.addEventListener('mousemove', (e) => {
      const { x, y } = this._rel(e);
      this.buttons.forEach(b => b.setState(b.isHovered(x, y) ? 'hover' : 'normal'));
    });
    c.addEventListener('mousedown', (e) => {
      const { x, y } = this._rel(e);
      this.buttons.forEach(b => { if (b.isHovered(x, y)) b.setState('pressed'); });
    });
    c.addEventListener('mouseup', (e) => {
      const { x, y } = this._rel(e);
      this.buttons.forEach(b => {
        const hovered = b.isHovered(x, y);
        b.setState(hovered ? 'hover' : 'normal');
        if (hovered) b.trigger();
      });
    });
  }

  _bindCursorSelect() {
    eventBus.on('cursor:select', ({ x, y }) => {
      const rect = this.canvas.getBoundingClientRect();
      const cx = x - rect.left;
      const cy = y - rect.top;
      this.buttons.forEach(b => {
        if (b.isHovered(cx, cy)) {
          b.setState('pressed');
          b.trigger();
          setTimeout(() => b.setState('normal'), 100);
        }
      });
    });
  }

  _loop() {
    const draw = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.buttons.forEach(b => b.render(this.ctx));
      this.cursor.render(this.ctx);
      this._raf = requestAnimationFrame(draw);
    };
    draw();
  }

  _rel(e) {
    const r = this.canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  createButtons(configs = []) {
    this.buttons = configs.map(c => new CanvasButton(c.x, c.y, c.width, c.height, c.label, c.onSelect));
    return this.buttons;
  }

  destroy() {
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this.canvas && this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
    this.canvas = null;
    this.ctx = null;
    this.buttons = [];
  }
}