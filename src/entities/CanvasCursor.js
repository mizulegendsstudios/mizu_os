/**
 * CanvasCursor - Representa un cursor personalizado para UI en canvas
 */
class CanvasCursor {
    constructor(x = 0, y = 0, size = 20) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.visible = true; // 🔥 PROPIDAD PARA VISIBILIDAD
    }

    /**
     * Renderiza el cursor en el contexto canvas
     * @param {CanvasRenderingContext2D} ctx - Contexto de renderizado
     */
    render(ctx) {
        // 🔥 NO RENDERIZAR SI NO ES VISIBLE
        if (!this.visible) return;
        
        // Círculo amarillo sólido
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Borde negro para mejor contraste
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Punto central para mejor precisión
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Actualiza la posición del cursor
     * @param {number} x - Nueva posición X
     * @param {number} y - Nueva posición Y
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Establece la visibilidad del cursor
     * @param {boolean} visible - Si el cursor es visible
     */
    setVisible(visible) {
        this.visible = visible;
    }

    /**
     * Verifica si el cursor está sobre un área
     * @param {number} x - Posición X del área
     * @param {number} y - Posición Y del área
     * @param {number} width - Ancho del área
     * @param {number} height - Alto del área
     * @returns {boolean} True si el cursor está sobre el área
     */
    isOver(x, y, width, height) {
        return this.x >= x && this.x <= x + width &&
               this.y >= y && this.y <= y + height;
    }
}

export default CanvasCursor;
