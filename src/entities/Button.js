import eventBus from '../core/EventBus.js';

/**
 * Button - Componente de botón interactivo independiente de escenas
 * Responsabilidad: Renderizar y manejar interacciones de botones
 */
class Button {
    constructor(config = {}) {
        this.id = config.id || `button-${Date.now()}`;
        this.text = config.text || 'Button';
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.width = config.width || 200;
        this.height = config.height || 50;
        this.isSelected = false;
        this.isEnabled = config.enabled !== false;
        this.action = config.action || null;
        this.style = {
            backgroundColor: config.backgroundColor || 'rgba(0, 229, 255, 0.2)',
            borderColor: config.borderColor || '#00e5ff',
            textColor: config.textColor || '#00e5ff',
            selectedBg: config.selectedBg || 'rgba(0, 255, 136, 0.3)',
            selectedBorder: config.selectedBorder || '#00ff88',
            selectedText: config.selectedText || '#00ff88',
            disabledBg: config.disabledBg || 'rgba(128, 128, 128, 0.2)',
            disabledBorder: config.disabledBorder || '#808080',
            disabledText: config.disabledText || '#808080'
        };
        
        this.element = null;
        this.onClick = config.onClick || null;
        this.onSelect = config.onSelect || null;
        this.onDeselect = config.onDeselect || null;
        
        this.createButton();
        this.setupEventListeners();
    }

    createButton() {
        this.element = document.createElement('div');
        this.element.id = this.id;
        this.element.className = 'mizu-button';
        this.element.textContent = this.text;
        
        this.updateStyles();
        this.updatePosition();
    }

    updateStyles() {
        if (!this.element) return;

        const style = this.element.style;
        const currentStyle = this.isSelected ? this.style : this.style;
        
        if (!this.isEnabled) {
            style.backgroundColor = this.style.disabledBg;
            style.borderColor = this.style.disabledBorder;
            style.color = this.style.disabledText;
        } else if (this.isSelected) {
            style.backgroundColor = this.style.selectedBg;
            style.borderColor = this.style.selectedBorder;
            style.color = this.style.selectedText;
        } else {
            style.backgroundColor = this.style.backgroundColor;
            style.borderColor = this.style.borderColor;
            style.color = this.style.textColor;
        }

        // Estilos base
        style.position = 'absolute';
        style.width = `${this.width}px`;
        style.height = `${this.height}px`;
        style.border = '2px solid';
        style.borderRadius = '8px';
        style.display = 'flex';
        style.alignItems = 'center';
        style.justifyContent = 'center';
        style.fontFamily = 'Arial, sans-serif';
        style.fontSize = '16px';
        style.fontWeight = 'bold';
        style.cursor = this.isEnabled ? 'pointer' : 'not-allowed';
        style.transition = 'all 0.2s ease';
        style.userSelect = 'none';
        style.zIndex = '10';
    }

    updatePosition() {
        if (!this.element) return;
        
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    setupEventListeners() {
        if (!this.element) return;

        // Click del mouse
        this.element.addEventListener('click', (e) => {
            if (!this.isEnabled) return;
            e.stopPropagation();
            this.handleClick();
        });

        // Hover
        this.element.addEventListener('mouseenter', () => {
            if (!this.isEnabled) return;
            this.select();
        });

        this.element.addEventListener('mouseleave', () => {
            if (!this.isEnabled) return;
            this.deselect();
        });

        // Touch events
        this.element.addEventListener('touchstart', (e) => {
            if (!this.isEnabled) return;
            e.preventDefault();
            this.handleClick();
        });
    }

    handleClick() {
        if (!this.isEnabled) return;

        // Emitir evento de click
        eventBus.emit('buttonClick', {
            buttonId: this.id,
            buttonText: this.text,
            action: this.action
        });

        // Ejecutar callback personalizado
        if (this.onClick) {
            this.onClick(this);
        }

        // Ejecutar acción si está definida
        if (this.action) {
            eventBus.emit(this.action, { button: this });
        }
    }

    select() {
        if (!this.isEnabled || this.isSelected) return;
        
        this.isSelected = true;
        this.updateStyles();
        
        // Emitir evento de selección
        eventBus.emit('buttonSelect', {
            buttonId: this.id,
            buttonText: this.text
        });

        // Ejecutar callback personalizado
        if (this.onSelect) {
            this.onSelect(this);
        }
    }

    deselect() {
        if (!this.isSelected) return;
        
        this.isSelected = false;
        this.updateStyles();
        
        // Emitir evento de deselección
        eventBus.emit('buttonDeselect', {
            buttonId: this.id,
            buttonText: this.text
        });

        // Ejecutar callback personalizado
        if (this.onDeselect) {
            this.onDeselect(this);
        }
    }

    enable() {
        this.isEnabled = true;
        this.updateStyles();
    }

    disable() {
        this.isEnabled = false;
        this.updateStyles();
    }

    setText(text) {
        this.text = text;
        if (this.element) {
            this.element.textContent = text;
        }
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.updatePosition();
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.updateStyles();
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }

    // Método para obtener el elemento DOM
    getElement() {
        return this.element;
    }

    // Método para verificar si el botón está en una posición específica
    isAtPosition(x, y) {
        return x >= this.x && x <= this.x + this.width &&
               y >= this.y && y <= this.y + this.height;
    }
}

export default Button;