import eventBus from '../core/EventBus.js';

/**
 * Cursor - Control visual que responde al InputManager
 * Responsabilidad: Mostrar posición del cursor y navegación visual
 */
class Cursor {
    constructor(config = {}) {
        this.x = config.x || 100;
        this.y = config.y || 100;
        this.width = config.width || 20;
        this.height = config.height || 20;
        this.speed = config.speed || 5;
        this.isVisible = config.visible !== false;
        this.isActive = false;
        
        this.style = {
            backgroundColor: config.backgroundColor || 'rgba(0, 255, 136, 0.8)',
            borderColor: config.borderColor || '#00ff88',
            size: config.size || 20,
            pulseColor: config.pulseColor || 'rgba(0, 255, 136, 0.3)'
        };
        
        this.element = null;
        this.pulseElement = null;
        this.targetX = this.x;
        this.targetY = this.y;
        this.animationId = null;
        
        this.createCursor();
        this.setupEventListeners();
    }

    createCursor() {
        // Crear elemento principal del cursor
        this.element = document.createElement('div');
        this.element.id = 'mizu-cursor';
        this.element.className = 'mizu-cursor';
        
        // Crear elemento de pulso
        this.pulseElement = document.createElement('div');
        this.pulseElement.className = 'mizu-cursor-pulse';
        
        this.element.appendChild(this.pulseElement);
        
        this.updateStyles();
        this.updatePosition();
        
        // Agregar estilos CSS
        this.addCursorStyles();
    }

    addCursorStyles() {
        if (document.getElementById('mizu-cursor-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'mizu-cursor-styles';
        style.textContent = `
            .mizu-cursor {
                position: absolute;
                width: ${this.style.size}px;
                height: ${this.style.size}px;
                background: ${this.style.backgroundColor};
                border: 2px solid ${this.style.borderColor};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                transition: all 0.1s ease;
                box-shadow: 0 0 10px ${this.style.borderColor};
            }
            
            .mizu-cursor.active {
                transform: scale(1.2);
                box-shadow: 0 0 20px ${this.style.borderColor};
            }
            
            .mizu-cursor-pulse {
                position: absolute;
                top: -5px;
                left: -5px;
                width: ${this.style.size + 10}px;
                height: ${this.style.size + 10}px;
                border: 2px solid ${this.style.pulseColor};
                border-radius: 50%;
                animation: cursorPulse 2s infinite;
            }
            
            @keyframes cursorPulse {
                0% {
                    transform: scale(1);
                    opacity: 1;
                }
                100% {
                    transform: scale(2);
                    opacity: 0;
                }
            }
            
            .mizu-cursor.hidden {
                opacity: 0;
            }
        `;
        
        document.head.appendChild(style);
    }

    updateStyles() {
        if (!this.element) return;
        
        const style = this.element.style;
        style.width = `${this.style.size}px`;
        style.height = `${this.style.size}px`;
        style.backgroundColor = this.style.backgroundColor;
        style.borderColor = this.style.borderColor;
        style.opacity = this.isVisible ? '1' : '0';
    }

    updatePosition() {
        if (!this.element) return;
        
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    setupEventListeners() {
        // Escuchar eventos de navegación del InputManager
        eventBus.on('navigate', (data) => {
            this.handleNavigation(data);
        });

        // Escuchar eventos de mouse
        eventBus.on('cursorMove', (data) => {
            this.moveTo(data.x, data.y);
        });

        // Escuchar eventos de acción
        eventBus.on('action', (data) => {
            this.handleAction(data);
        });

        // Escuchar cambios de escena para reposicionar
        eventBus.on('sceneChanged', () => {
            this.centerCursor();
        });
    }

    handleNavigation(data) {
        const { direction } = data;
        const step = this.speed;
        
        switch (direction) {
            case 'up':
                this.moveBy(0, -step);
                break;
            case 'down':
                this.moveBy(0, step);
                break;
            case 'left':
                this.moveBy(-step, 0);
                break;
            case 'right':
                this.moveBy(step, 0);
                break;
        }
    }

    handleAction(data) {
        const { type } = data;
        
        if (type === 'positive') {
            this.activate();
        } else if (type === 'negative') {
            this.deactivate();
        }
    }

    moveTo(x, y) {
        this.targetX = Math.max(0, Math.min(window.innerWidth - this.style.size, x));
        this.targetY = Math.max(0, Math.min(window.innerHeight - this.style.size, y));
        
        this.x = this.targetX;
        this.y = this.targetY;
        this.updatePosition();
        
        // Emitir evento de movimiento del cursor
        eventBus.emit('cursorMoved', {
            x: this.x,
            y: this.y,
            targetX: this.targetX,
            targetY: this.targetY
        });
    }

    moveBy(dx, dy) {
        this.moveTo(this.x + dx, this.y + dy);
    }

    centerCursor() {
        const centerX = window.innerWidth / 2 - this.style.size / 2;
        const centerY = window.innerHeight / 2 - this.style.size / 2;
        this.moveTo(centerX, centerY);
    }

    activate() {
        this.isActive = true;
        if (this.element) {
            this.element.classList.add('active');
        }
        
        // Emitir evento de activación
        eventBus.emit('cursorActivated', {
            x: this.x,
            y: this.y
        });
    }

    deactivate() {
        this.isActive = false;
        if (this.element) {
            this.element.classList.remove('active');
        }
        
        // Emitir evento de desactivación
        eventBus.emit('cursorDeactivated', {
            x: this.x,
            y: this.y
        });
    }

    show() {
        this.isVisible = true;
        this.updateStyles();
    }

    hide() {
        this.isVisible = false;
        this.updateStyles();
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    setSize(size) {
        this.style.size = size;
        this.updateStyles();
    }

    setColor(backgroundColor, borderColor) {
        this.style.backgroundColor = backgroundColor;
        this.style.borderColor = borderColor;
        this.updateStyles();
    }

    // Método para obtener la posición actual
    getPosition() {
        return { x: this.x, y: this.y };
    }

    // Método para verificar si el cursor está en una posición específica
    isAtPosition(x, y, tolerance = 10) {
        const distance = Math.sqrt(
            Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2)
        );
        return distance <= tolerance;
    }

    // Método para obtener el elemento DOM
    getElement() {
        return this.element;
    }

    // Método para destruir el cursor
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        
        // Remover estilos
        const styleElement = document.getElementById('mizu-cursor-styles');
        if (styleElement) {
            styleElement.remove();
        }
        
        this.element = null;
        this.pulseElement = null;
    }

    // Método para animar el cursor a una posición
    animateTo(x, y, duration = 500) {
        const startX = this.x;
        const startY = this.y;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Función de easing (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            this.x = startX + (x - startX) * easeOut;
            this.y = startY + (y - startY) * easeOut;
            this.updatePosition();
            
            if (progress < 1) {
                this.animationId = requestAnimationFrame(animate);
            }
        };
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        this.animationId = requestAnimationFrame(animate);
    }

    // Método para detener animación
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

export default Cursor;