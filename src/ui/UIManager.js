import eventBus from '../core/EventBus.js';
import Button from '../entities/Button.js';
import Cursor from '../entities/Cursor.js';

/**
 * UIManager - Gestor de componentes visuales
 * Responsabilidad: Manejar botones, cursor y HUD de manera centralizada
 */
class UIManager {
    constructor(config = {}) {
        this.container = config.container || document.body;
        this.buttons = new Map();
        this.cursor = null;
        this.hudElements = new Map();
        this.isEnabled = config.enabled !== false;
        this.currentScene = null;
        
        this.style = {
            buttonSpacing: config.buttonSpacing || 20,
            defaultButtonWidth: config.defaultButtonWidth || 200,
            defaultButtonHeight: config.defaultButtonHeight || 50,
            cursorSize: config.cursorSize || 20,
            cursorSpeed: config.cursorSpeed || 5
        };
        
        this.initialize();
    }

    initialize() {
        this.createCursor();
        this.setupEventListeners();
        
        // Emitir evento de inicialización
        eventBus.emit('uiManagerReady', { manager: this });
    }

    createCursor() {
        this.cursor = new Cursor({
            size: this.style.cursorSize,
            speed: this.style.cursorSpeed,
            visible: true
        });
        
        this.container.appendChild(this.cursor.getElement());
        this.cursor.centerCursor();
    }

    setupEventListeners() {
        // Escuchar cambios de escena
        eventBus.on('sceneChanged', (data) => {
            this.handleSceneChange(data);
        });

        // Escuchar eventos de botón
        eventBus.on('buttonClick', (data) => {
            this.handleButtonClick(data);
        });

        eventBus.on('buttonSelect', (data) => {
            this.handleButtonSelect(data);
        });

        // Escuchar eventos de cursor
        eventBus.on('cursorMoved', (data) => {
            this.handleCursorMove(data);
        });

        // Escuchar eventos de navegación
        eventBus.on('navigate', (data) => {
            this.handleNavigation(data);
        });
    }

    handleSceneChange(data) {
        this.currentScene = data.to;
        
        // Limpiar botones de la escena anterior
        this.clearButtons();
        
        // Centrar cursor en nueva escena
        if (this.cursor) {
            this.cursor.centerCursor();
        }
        
        // Emitir evento de cambio de UI
        eventBus.emit('uiSceneChanged', {
            scene: this.currentScene,
            manager: this
        });
    }

    handleButtonClick(data) {
        const { buttonId, action } = data;
        
        // Emitir evento de click de botón
        eventBus.emit('uiButtonClick', {
            buttonId,
            action,
            scene: this.currentScene
        });
    }

    handleButtonSelect(data) {
        const { buttonId } = data;
        
        // Deseleccionar otros botones
        this.deselectOtherButtons(buttonId);
        
        // Emitir evento de selección
        eventBus.emit('uiButtonSelect', {
            buttonId,
            scene: this.currentScene
        });
    }

    handleCursorMove(data) {
        // Verificar si el cursor está sobre algún botón
        this.checkButtonHover(data);
    }

    handleNavigation(data) {
        const { direction } = data;
        
        // Navegar entre botones si hay botones activos
        if (this.buttons.size > 0) {
            this.navigateButtons(direction);
        }
    }

    // Métodos para manejar botones
    createButton(config = {}) {
        const button = new Button({
            width: config.width || this.style.defaultButtonWidth,
            height: config.height || this.style.defaultButtonHeight,
            ...config
        });
        
        this.buttons.set(button.id, button);
        this.container.appendChild(button.getElement());
        
        return button;
    }

    createButtonGrid(config = {}) {
        const {
            items = [],
            x = 100,
            y = 100,
            columns = 2,
            spacing = this.style.buttonSpacing
        } = config;
        
        const buttons = [];
        let currentX = x;
        let currentY = y;
        let columnCount = 0;
        
        items.forEach((item, index) => {
            const button = this.createButton({
                text: item.text,
                x: currentX,
                y: currentY,
                action: item.action,
                onClick: item.onClick,
                ...item.config
            });
            
            buttons.push(button);
            columnCount++;
            
            if (columnCount >= columns) {
                currentX = x;
                currentY += this.style.defaultButtonHeight + spacing;
                columnCount = 0;
            } else {
                currentX += this.style.defaultButtonWidth + spacing;
            }
        });
        
        return buttons;
    }

    createMenuButtons(menuItems = [], config = {}) {
        const {
            x = window.innerWidth / 2 - this.style.defaultButtonWidth / 2,
            y = 200,
            spacing = this.style.buttonSpacing
        } = config;
        
        const buttons = [];
        let currentY = y;
        
        menuItems.forEach((item, index) => {
            const button = this.createButton({
                text: item.text,
                x: x,
                y: currentY,
                action: item.action,
                onClick: item.onClick,
                ...item.config
            });
            
            buttons.push(button);
            currentY += this.style.defaultButtonHeight + spacing;
        });
        
        return buttons;
    }

    getButton(buttonId) {
        return this.buttons.get(buttonId);
    }

    selectButton(buttonId) {
        const button = this.getButton(buttonId);
        if (button) {
            button.select();
        }
    }

    deselectButton(buttonId) {
        const button = this.getButton(buttonId);
        if (button) {
            button.deselect();
        }
    }

    deselectOtherButtons(excludeId) {
        this.buttons.forEach((button, id) => {
            if (id !== excludeId) {
                button.deselect();
            }
        });
    }

    enableButton(buttonId) {
        const button = this.getButton(buttonId);
        if (button) {
            button.enable();
        }
    }

    disableButton(buttonId) {
        const button = this.getButton(buttonId);
        if (button) {
            button.disable();
        }
    }

    removeButton(buttonId) {
        const button = this.getButton(buttonId);
        if (button) {
            button.destroy();
            this.buttons.delete(buttonId);
        }
    }

    clearButtons() {
        this.buttons.forEach((button) => {
            button.destroy();
        });
        this.buttons.clear();
    }

    // Métodos para navegación entre botones
    navigateButtons(direction) {
        const buttonArray = Array.from(this.buttons.values());
        if (buttonArray.length === 0) return;
        
        const currentSelected = buttonArray.find(button => button.isSelected);
        let nextIndex = 0;
        
        if (currentSelected) {
            const currentIndex = buttonArray.indexOf(currentSelected);
            
            switch (direction) {
                case 'up':
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : buttonArray.length - 1;
                    break;
                case 'down':
                    nextIndex = currentIndex < buttonArray.length - 1 ? currentIndex + 1 : 0;
                    break;
                case 'left':
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : buttonArray.length - 1;
                    break;
                case 'right':
                    nextIndex = currentIndex < buttonArray.length - 1 ? currentIndex + 1 : 0;
                    break;
            }
        }
        
        const nextButton = buttonArray[nextIndex];
        if (nextButton) {
            this.selectButton(nextButton.id);
            
            // Mover cursor al botón seleccionado
            if (this.cursor) {
                const buttonElement = nextButton.getElement();
                const rect = buttonElement.getBoundingClientRect();
                this.cursor.animateTo(
                    rect.left + rect.width / 2,
                    rect.top + rect.height / 2
                );
            }
        }
    }

    checkButtonHover(cursorData) {
        const { x, y } = cursorData;
        
        this.buttons.forEach((button) => {
            if (button.isAtPosition(x, y)) {
                button.select();
            } else {
                button.deselect();
            }
        });
    }

    // Métodos para el cursor
    getCursor() {
        return this.cursor;
    }

    showCursor() {
        if (this.cursor) {
            this.cursor.show();
        }
    }

    hideCursor() {
        if (this.cursor) {
            this.cursor.hide();
        }
    }

    centerCursor() {
        if (this.cursor) {
            this.cursor.centerCursor();
        }
    }

    // Métodos para HUD
    createHUDElement(id, config = {}) {
        const element = document.createElement('div');
        element.id = id;
        element.className = 'mizu-hud-element';
        
        // Aplicar estilos básicos
        Object.assign(element.style, {
            position: 'absolute',
            zIndex: '100',
            ...config.style
        });
        
        if (config.content) {
            element.innerHTML = config.content;
        }
        
        this.hudElements.set(id, element);
        this.container.appendChild(element);
        
        return element;
    }

    updateHUDElement(id, content) {
        const element = this.hudElements.get(id);
        if (element) {
            element.innerHTML = content;
        }
    }

    removeHUDElement(id) {
        const element = this.hudElements.get(id);
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
            this.hudElements.delete(id);
        }
    }

    clearHUD() {
        this.hudElements.forEach((element) => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        this.hudElements.clear();
    }

    // Métodos de utilidad
    enable() {
        this.isEnabled = true;
        this.showCursor();
        this.buttons.forEach(button => button.enable());
    }

    disable() {
        this.isEnabled = false;
        this.hideCursor();
        this.buttons.forEach(button => button.disable());
    }

    getButtonCount() {
        return this.buttons.size;
    }

    getCurrentScene() {
        return this.currentScene;
    }

    // Método para destruir el UIManager
    destroy() {
        this.clearButtons();
        this.clearHUD();
        
        if (this.cursor) {
            this.cursor.destroy();
            this.cursor = null;
        }
        
        // Remover event listeners
        eventBus.off('sceneChanged');
        eventBus.off('buttonClick');
        eventBus.off('buttonSelect');
        eventBus.off('cursorMoved');
        eventBus.off('navigate');
    }
}

export default UIManager;