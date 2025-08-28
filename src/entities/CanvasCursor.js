/**
 * CanvasButton - Botón interactivo para UI en canvas
 * Soporta estados: normal, hover, pressed, focused
 */
class CanvasButton {
    constructor(x, y, width, height, label, onSelect, isFocused = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.label = label;
        this.onSelect = onSelect;
        this.state = 'normal'; // normal, hover, pressed, focused
        this.isFocused = isFocused;
    }

    /**
     * Renderiza el botón en el contexto canvas
     * @param {CanvasRenderingContext2D} ctx - Contexto de renderizado
     */
    render(ctx) {
        // Colores según el estado
        let bgColor, textColor, borderColor;
        
        switch (this.state) {
            case 'hover':
                bgColor = 'rgba(0, 229, 255, 0.3)';
                textColor = '#00e5ff';
                borderColor = '#00e5ff';
                break;
            case 'pressed':
                bgColor = 'rgba(0, 229, 255, 0.5)';
                textColor = '#ffffff';
                borderColor = '#00e5ff';
                break;
            case 'focused':
                bgColor = 'rgba(0, 229, 255, 0.7)'; // 🔥 MÁS INTENSO PARA FOCUS
                textColor = '#ffffff';
                borderColor = '#00ffff';
                break;
            default: // normal
                bgColor = 'rgba(0, 229, 255, 0.1)';
                textColor = '#00e5ff';
                borderColor = '#00e5ff';
        }

        // Fondo del botón
        ctx.fillStyle = bgColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Borde del botón
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // 🔥 BORDE EXTRA GRUESO PARA ESTADO FOCUSED
        if (this.state === 'focused') {
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
        }

        // Texto del botón
        ctx.fillStyle = textColor;
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            this.label,
            this.x + this.width / 2,
            this.y + this.height / 2
        );

        // 🔥 INDICADOR DE FOCO (TRIÁNGULO) PARA MODO TRADICIONAL
        if (this.isFocused) {
            ctx.fillStyle = '#00ffff';
            ctx.beginPath();
            ctx.moveTo(this.x - 15, this.y + this.height / 2);
            ctx.lineTo(this.x - 5, this.y + this.height / 2 - 5);
            ctx.lineTo(this.x - 5, this.y + this.height / 2 + 5);
            ctx.closePath();
            ctx.fill();
        }
    }

    /**
     * Establece el estado del botón
     * @param {string} state - Nuevo estado (normal, hover, pressed, focused)
     */
    setState(state) {
        this.state = state;
    }

    /**
     * Establece si el botón está enfocado
     * @param {boolean} focused - Si el botón está enfocado
     */
    setFocused(focused) {
        this.isFocused = focused;
        if (focused) {
            this.state = 'focused';
        } else {
            this.state = 'normal';
        }
    }

    /**
     * Verifica si las coordenadas están dentro del botón
     * @param {number} x - Coordenada X
     * @param {number} y - Coordenada Y
     * @returns {boolean} True si está dentro del botón
     */
    isHovered(x, y) {
        return x >= this.x && x <= this.x + this.width &&
               y >= this.y && y <= this.y + this.height;
    }

    /**
     * Ejecuta la acción del botón
     */
    trigger() {
        if (this.onSelect) {
            this.onSelect();
        }
    }

    /**
     * Actualiza las propiedades del botón
     */
    update(props) {
        if (props.x !== undefined) this.x = props.x;
        if (props.y !== undefined) this.y = props.y;
        if (props.width !== undefined) this.width = props.width;
        if (props.height !== undefined) this.height = props.height;
        if (props.label !== undefined) this.label = props.label;
        if (props.onSelect !== undefined) this.onSelect = props.onSelect;
        if (props.isFocused !== undefined) this.isFocused = props.isFocused;
    }
}

export default CanvasButton;
