import bus from '../core/EventBus.js';

export default class Cursor {
  constructor() {
    this.x = 100;
    this.y = 100;
    this.speed = 5;

    // Compatibilidad con InputManager del sistema
    bus.on('navigate', (data) => {
      const d = data?.direction;
      if (d === 'up') this.move(0, -this.speed);
      if (d === 'down') this.move(0, this.speed);
      if (d === 'left') this.move(-this.speed, 0);
      if (d === 'right') this.move(this.speed, 0);
    });
    bus.on('action', (data) => {
      if (data?.type === 'positive') this.select();
    });

    // Soporte para eventos tipo input:* si existen
    bus.on('input:up', () => this.move(0, -this.speed));
    bus.on('input:down', () => this.move(0, this.speed));
    bus.on('input:left', () => this.move(-this.speed, 0));
    bus.on('input:right', () => this.move(this.speed, 0));
    bus.on('input:positive', () => this.select());
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
    bus.emit('cursor:moved', { x: this.x, y: this.y });
  }

  select() {
    bus.emit('cursor:select', { x: this.x, y: this.y });
  }

  render(ctx) {
    ctx.fillStyle = '#ff0';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}