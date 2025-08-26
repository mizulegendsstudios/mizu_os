export default class Button {
  constructor(x, y, width, height, label, onSelect) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.label = label;
    this.onSelect = onSelect;
    this.state = 'normal'; // normal, hover, pressed
  }

  isHovered(cursorX, cursorY) {
    return (
      cursorX >= this.x &&
      cursorX <= this.x + this.width &&
      cursorY >= this.y &&
      cursorY <= this.y + this.height
    );
  }

  setState(state) {
    this.state = state;
  }

  render(ctx) {
    // Fondo según estado
    if (this.state === 'pressed') {
      ctx.fillStyle = '#888';
    } else if (this.state === 'hover') {
      ctx.fillStyle = '#777';
    } else {
      ctx.fillStyle = '#555';
    }
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Borde
    ctx.strokeStyle = this.state === 'hover' ? '#00e5ff' : '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);

    // Texto
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.label, this.x + 10, this.y + this.height / 2);
  }

  trigger() {
    if (typeof this.onSelect === 'function') this.onSelect();
  }
}