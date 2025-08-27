/**
 * CanvasButton - Botón renderizado en canvas con soporte para foco (navegación con flechas)
 * Compatible con UIManagerCanvas.updateButtonsFocus()
 */
export default class CanvasButton {
  constructor(x, y, width, height, label, onSelect, isFocused = false) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.label = label;
    this.onSelect = onSelect;
    this.state = 'normal'; // 'normal', 'hover', 'pressed'
    this.isFocused = isFocused; // 🔥 Nuevo: indica si el botón está enfocado (modo tradicional)
  }

  /**
   * Verifica si el cursor está sobre el botón
   */
  isHovered(cursorX, cursorY) {
    return (
      cursorX >= this.x &&
      cursorX <= this.x + this.width &&
      cursorY >= this.y &&
      cursorY <= this.y + this.height
    );
  }

  /**
   * Cambia el estado visual del botón
   */
  setState(state) {
    this.state = state;
  }

  /**
   * Establece el estado de foco (para navegación con flechas)
   * @param {boolean} focused - Si el botón está enfocado
   */
  setFocused(focused) {
    this.isFocused = focused;
    // Opcional: cambiar estado visual cuando se enfoca
    if (focused && this.state === 'normal') {
      this.state = 'hover';
    } else if (!focused && this.state === 'hover') {
      // Solo si no está presionado
      this.state = 'normal';
    }
  }

  /**
   * Renderiza el botón en el contexto 2D
   */
  render(ctx) {
    // Colores por estado
    const colors = {
      normal: { bg: '#555', border: '#333', text: '#fff' },
      hover: { bg: '#777', border: '#00e5ff', text: '#fff' },
      pressed: { bg: '#888', border: '#333', text: '#ccc' }
    };

    const c = colors[this.state] || colors.normal;

    // Fondo
    ctx.fillStyle = c.bg;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Borde
    ctx.strokeStyle = c.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);

    // 🔥 Efecto de foco: rayas punteadas si está enfocado (modo tradicional)
    if (this.isFocused) {
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#00e5ff';
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      ctx.setLineDash([]);
      ctx.lineWidth = 2; // Restaurar
    }

    // Texto
    ctx.fillStyle = c.text;
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.label, this.x + 10, this.y + this.height / 2);
  }

  /**
   * Ejecuta la acción del botón
   */
  trigger() {
    if (typeof this.onSelect === 'function') {
      this.onSelect();
    }
  }
}
