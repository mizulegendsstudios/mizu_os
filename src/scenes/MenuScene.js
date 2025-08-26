import eventBus from '../core/EventBus.js';
import UIManagerCanvas from '../ui/UIManagerCanvas.js';

/**
 * MenuScene - Escena del menú principal con UI interactiva en Canvas
 * Responsabilidad: Mostrar menú principal con botones y cursor en canvas
 */
class MenuScene {
    constructor() {
        this.name = 'menu';
        this.uiManager = null;
        this.isActive = false;
        
        this.menuItems = [
            {
                text: 'Iniciar Sistema',
                x: 100,
                y: 200,
                width: 200,
                height: 40,
                action: 'ENTER_SYSTEM',
                onSelect: () => {
                    eventBus.emit('changeScene', { scene: 'desktop' });
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
        
        // Crear botones del menú
        this.createMenuButtons();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        eventBus.emit('menuActivated', { scene: this });
    }

    deactivate() {
        this.isActive = false;
        console.log('MenuScene desactivada');
        
        // Limpiar event listeners
        this.cleanup();
        
        // Destruir UI Manager
        if (this.uiManager) {
            this.uiManager.destroy();
            this.uiManager = null;
        }
        
        eventBus.emit('menuDeactivated', { scene: this });
    }

    createMenuButtons() {
        const buttonConfigs = this.menuItems.map(item => ({
            x: item.x,
            y: item.y,
            width: item.width,
            height: item.height,
            label: item.text,
            onSelect: item.onSelect
        }));

        this.uiManager.createButtons(buttonConfigs);
    }

    render() {
        // El renderizado se maneja automáticamente por UIManagerCanvas
        // Podemos añadir elementos adicionales aquí si es necesario
        if (this.uiManager && this.uiManager.ctx) {
            const ctx = this.uiManager.ctx;
            const width = this.uiManager.canvas.width;
            
            // Dibujar título
            ctx.fillStyle = '#00e5ff';
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('MIZU OS', width / 2, 100);
            
            // Dibujar información de controles
            ctx.fillStyle = '#888';
            ctx.font = '14px Arial';
            ctx.fillText('🔼🔽 Navegar | ⏎ Seleccionar | ESC Salir', width / 2, 500);
            
            // Dibujar versión
            ctx.fillStyle = '#666';
            ctx.font = '12px Arial';
            ctx.textAlign = 'right';
            ctx.fillText('v0.7.2', width - 20, 580);
        }
    }

    showSystemInfo() {
        // Crear modal simple de información
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

    setupEventListeners() {
        // Escuchar eventos del sistema
        this.systemExitHandler = (data) => {
            console.log('Sistema saliendo:', data);
        };
        
        eventBus.on('systemExit', this.systemExitHandler);
    }

    cleanup() {
        // Limpiar event listeners
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
    }

    update() {
        // Lógica de actualización si es necesaria
        this.render();
    }
}

export default MenuScene;
