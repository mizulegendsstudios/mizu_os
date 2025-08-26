import eventBus from '../core/EventBus.js';
import UIManagerCanvas from '../ui/UIManagerCanvas.js';

/**
 * MenuScene - Escena del menú principal con navegación híbrida
 * Modo tradicional: Flechas navegan entre opciones como consola (focus highlight)
 * Modo libre: Mouse/Flechas mueven cursor amarillo (como mouse)
 */
class MenuScene {
    constructor() {
        this.name = 'menu';
        this.uiManager = null;
        this.isActive = false;
        this.currentFocusIndex = 0;       // Índice del botón enfocado (modo tradicional)
        this.freeMode = true;             // true = libre (cursor), false = tradicional (focus)
        this.autoStartTimer = null;       // Timer para auto-inicio
        this.autoStartCountdown = 10;     // Segundos restantes para auto-inicio
        this.originalStartText = 'Iniciar Sistema'; // Texto original del botón
        
        this.menuItems = [
            {
                text: 'Iniciar Sistema (10)',
                x: 100,
                y: 200,
                width: 280,
                height: 40,
                action: 'ENTER_SYSTEM',
                onSelect: () => {
                    this.startSystem();
                }
            },
            {
                text: 'Configuración',
                x: 100,
                y: 260,
                width: 200,
                height: 40,
                action: 'OPEN_SETTINGS',
                onSelect: () => {
                    this.cancelAutoStart();
                    eventBus.emit('changeScene', { scene: 'settings' });
                }
            },
            {
                text: 'Información',
                x: 100,
                y: 320,
                width: 200,
                height: 40,
                action: 'SHOW_SYSTEM_INFO',
                onSelect: () => {
                    this.cancelAutoStart();
                    this.showSystemInfo();
                }
            },
            {
                text: 'Salir',
                x: 100,
                y: 380,
                width: 200,
                height: 40,
                action: 'EXIT_SYSTEM',
                onSelect: () => {
                    this.cancelAutoStart();
                    this.exitSystem();
                }
            }
        ];
    }

    activate() {
        this.isActive = true;
        console.log('MenuScene activada');
        
        // Inicializar UI Manager con canvas
        this.uiManager = new UIManagerCanvas();
        this.uiManager.mount(0, 0);
        
        // 🔥 POSICIONAR CURSOR EN EL PRIMER BOTÓN AL ACTIVAR
        if (this.uiManager && this.uiManager.cursor && this.menuItems[0]) {
            const firstItem = this.menuItems[0];
            this.uiManager.cursor.x = firstItem.x + (firstItem.width / 2);
            this.uiManager.cursor.y = firstItem.y + (firstItem.height / 2);
            this.uiManager.cursor.visible = this.freeMode;
        }
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Crear botones del menú
        this.createMenuButtons();
        
        // Iniciar contador de auto-inicio
        this.startAutoStartTimer();
        
        // Renderizar inicialmente
        this.render();
        
        eventBus.emit('menuActivated', { scene: this });
    }

    deactivate() {
        this.isActive = false;
        console.log('MenuScene desactivada');
        
        // Detener timers
        this.cancelAutoStart();
        
        // Limpiar event listeners
        this.cleanup();
        
        // Destruir UI Manager
        if (this.uiManager) {
            this.uiManager.destroy();
            this.uiManager = null;
        }
        
        eventBus.emit('menuDeactivated', { scene: this });
    }

    setupEventListeners() {
        // Escuchar eventos de teclado
        this.keyHandler = (event) => {
            if (!this.isActive) return;
            
            if (this.freeMode) {
                // Modo libre: Las flechas mueven el cursor
                this.handleFreeModeNavigation(event);
            } else {
                // Modo tradicional: Las flechas navegan entre opciones
                this.handleTraditionalNavigation(event);
            }
            
            // Tecla Tab para cambiar modo
            if (event.key === 'Tab') {
                event.preventDefault();
                this.toggleNavigationMode();
            }
        };

        // Escuchar movimiento del mouse para modo libre
        this.mouseMoveHandler = (event) => {
            if (!this.isActive || !this.freeMode || !this.uiManager || !this.uiManager.cursor) return;
            
            const rect = this.uiManager.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            // Mover cursor con el mouse
            this.uiManager.cursor.x = x;
            this.uiManager.cursor.y = y;
        };

        document.addEventListener('keydown', this.keyHandler);
        document.addEventListener('mousemove', this.mouseMoveHandler);

        // Escuchar eventos del sistema
        this.systemExitHandler = (data) => {
            console.log('Sistema saliendo:', data);
        };
        
        eventBus.on('systemExit', this.systemExitHandler);
    }

    handleTraditionalNavigation(event) {
        switch(event.key) {
            case 'ArrowUp':
                event.preventDefault();
                this.navigate(-1);
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.navigate(1);
                break;
            case 'Enter':
                event.preventDefault();
                this.selectCurrentItem();
                break;
            case 'Escape':
                event.preventDefault();
                this.exitSystem();
                break;
        }
    }

    handleFreeModeNavigation(event) {
        // En modo libre, las flechas mueven el cursor
        if (this.uiManager && this.uiManager.cursor) {
            const speed = 10;
            
            switch(event.key) {
                case 'ArrowUp':
                    event.preventDefault();
                    this.uiManager.cursor.y -= speed;
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    this.uiManager.cursor.y += speed;
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    this.uiManager.cursor.x -= speed;
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    this.uiManager.cursor.x += speed;
                    break;
                case 'Enter':
                    event.preventDefault();
                    // Simular click en la posición actual del cursor
                    this.handleCursorClick(this.uiManager.cursor.x, this.uiManager.cursor.y);
                    break;
                case 'Escape':
                    event.preventDefault();
                    this.exitSystem();
                    break;
            }
            
            // Limitar cursor dentro del canvas
            this.clampCursorPosition();
        }
    }

    clampCursorPosition() {
        if (this.uiManager && this.uiManager.cursor) {
            this.uiManager.cursor.x = Math.max(0, Math.min(this.uiManager.canvas.width, this.uiManager.cursor.x));
            this.uiManager.cursor.y = Math.max(0, Math.min(this.uiManager.canvas.height, this.uiManager.cursor.y));
        }
    }

    toggleNavigationMode() {
        this.freeMode = !this.freeMode;
        
        // Ocultar/mostrar cursor según el modo
        if (this.uiManager && this.uiManager.cursor) {
            this.uiManager.cursor.visible = this.freeMode;
            
            // 🔥 EN MODO TRADICIONAL: Posicionar cursor en el botón seleccionado
            if (!this.freeMode && this.menuItems[this.currentFocusIndex]) {
                const item = this.menuItems[this.currentFocusIndex];
                this.uiManager.cursor.x = item.x + (item.width / 2);
                this.uiManager.cursor.y = item.y + (item.height / 2);
            }
        }
        
        // Si cambiamos a modo tradicional, posicionar focus en el primer item
        if (!this.freeMode) {
            this.currentFocusIndex = 0;
            this.cancelAutoStart(); // Cancelar auto-start al interactuar
        }
        
        // Actualizar botones
        this.updateMenuButtons();
        
        console.log(`Modo de navegación: ${this.freeMode ? 'Libre (Cursor)' : 'Tradicional (Focus)'}`);
    }

    navigate(direction) {
        const newIndex = this.currentFocusIndex + direction;
        
        // Navegación circular
        if (newIndex < 0) {
            this.currentFocusIndex = this.menuItems.length - 1;
        } else if (newIndex >= this.menuItems.length) {
            this.currentFocusIndex = 0;
        } else {
            this.currentFocusIndex = newIndex;
        }
        
        // 🔥 MOVER CURSOR AL BOTÓN SELECCIONADO EN MODO TRADICIONAL
        if (!this.freeMode && this.uiManager && this.uiManager.cursor && this.menuItems[this.currentFocusIndex]) {
            const item = this.menuItems[this.currentFocusIndex];
            this.uiManager.cursor.x = item.x + (item.width / 2);
            this.uiManager.cursor.y = item.y + (item.height / 2);
        }
        
        // Cancelar auto-inicio si el usuario interactúa
        if (this.currentFocusIndex !== 0) {
            this.cancelAutoStart();
        }
        
        this.updateMenuButtons();
    }

    selectCurrentItem() {
        if (this.menuItems[this.currentFocusIndex]) {
            this.menuItems[this.currentFocusIndex].onSelect();
        }
    }

    handleCursorClick(x, y) {
        // Verificar si el click está sobre algún botón
        this.menuItems.forEach((item, index) => {
            if (x >= item.x && x <= item.x + item.width &&
                y >= item.y && y <= item.y + item.height) {
                item.onSelect();
            }
        });
    }

    createMenuButtons() {
        this.updateMenuButtons();
    }

    updateMenuButtons() {
        const buttonConfigs = this.menuItems.map((item, index) => ({
            x: item.x,
            y: item.y,
            width: item.width,
            height: item.height,
            label: item.text,
            isFocused: !this.freeMode && index === this.currentFocusIndex,
            onSelect: item.onSelect
        }));

        if (this.uiManager) {
            this.uiManager.createButtons(buttonConfigs);
            this.render();
        }
    }

    startAutoStartTimer() {
        this.autoStartCountdown = 10;
        this.updateAutoStartText();
        
        this.autoStartTimer = setInterval(() => {
            this.autoStartCountdown--;
            
            if (this.autoStartCountdown <= 0) {
                this.startSystem();
                return;
            }
            
            this.updateAutoStartText();
            
        }, 1000);
    }

    cancelAutoStart() {
        if (this.autoStartTimer) {
            clearInterval(this.autoStartTimer);
            this.autoStartTimer = null;
            
            // Restaurar texto original
            this.menuItems[0].text = this.originalStartText;
            this.updateMenuButtons();
        }
    }

    updateAutoStartText() {
        this.menuItems[0].text = `Iniciar Sistema (${this.autoStartCountdown})`;
        this.updateMenuButtons();
    }

    startSystem() {
        this.cancelAutoStart();
        eventBus.emit('changeScene', { scene: 'desktop' });
    }

    render() {
        if (this.uiManager && this.uiManager.ctx) {
            const ctx = this.uiManager.ctx;
            const width = this.uiManager.canvas.width;
            const height = this.uiManager.canvas.height;
            
            // Limpiar canvas
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, width, height);
            
            // Dibujar título
            ctx.fillStyle = '#00e5ff';
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('MIZU OS', width / 2, 100);
            
            // Dibujar información de controles
            ctx.fillStyle = this.freeMode ? '#00ff00' : '#888';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            
            let controlsText;
            if (this.freeMode) {
                controlsText = '🖱️ Modo Libre: Mouse/Flechas mueven cursor | ⏎ Click | TAB Cambiar modo';
            } else {
                controlsText = '🎮 Modo Tradicional: 🔼🔽 Navegar | ⏎ Seleccionar | TAB Cambiar modo | ESC Salir';
            }
            
            ctx.fillText(controlsText, width / 2, 500);
            
            // Dibujar versión
            ctx.fillStyle = '#666';
            ctx.font = '12px Arial';
            ctx.textAlign = 'right';
            ctx.fillText('v0.7.2', width - 20, height - 20);
        }
    }

    showSystemInfo() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(15, 15, 35, 0.95);
            border: 2px solid #00e5ff;
            border-radius: 10px;
            padding: 20px;
            color: #00e5ff;
            font-family: Arial, sans-serif;
            z-index: 1000;
            min-width: 300px;
        `;
        
        modal.innerHTML = `
            <h2 style="margin: 0 0 15px 0; text-align: center;">Información del Sistema</h2>
            <div style="line-height: 1.6;">
                <p><strong>Versión:</strong> Mizu OS 0.7.2</p>
                <p><strong>Resolución:</strong> ${window.innerWidth}x${window.innerHeight}</p>
                <p><strong>Modo navegación:</strong> ${this.freeMode ? 'Libre' : 'Tradicional'}</p>
            </div>
            <button style="
                background: rgba(0, 229, 255, 0.2);
                border: 1px solid #00e5ff;
                color: #00e5ff;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 15px;
                width: 100%;
            " onclick="this.parentElement.parentElement.remove()">Cerrar</button>
        `;
        
        document.body.appendChild(modal);
    }

    exitSystem() {
        if (confirm('¿Estás seguro de que quieres salir del sistema?')) {
            eventBus.emit('systemExit', { reason: 'user_request' });
        }
    }

    cleanup() {
        // Limpiar event listeners
        if (this.keyHandler) {
            document.removeEventListener('keydown', this.keyHandler);
        }
        if (this.mouseMoveHandler) {
            document.removeEventListener('mousemove', this.mouseMoveHandler);
        }
        if (this.systemExitHandler) {
            eventBus.off('systemExit', this.systemExitHandler);
        }
        
        // Remover cualquier modal abierto
        const modals = document.querySelectorAll('div');
        modals.forEach(modal => {
            if (modal.style.position === 'fixed' && modal.style.zIndex === '1000') {
                modal.remove();
            }
        });
        
        // Asegurar que el timer se detenga
        this.cancelAutoStart();
    }

    update() {
        // Lógica de actualización si es necesaria
    }
}

export default MenuScene;
