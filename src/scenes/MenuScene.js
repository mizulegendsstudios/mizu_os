import eventBus from '../core/EventBus.js';
import UIManager from '../ui/UIManager.js';
import CanvasButton from '../entities/CanvasButton.js';
import CanvasCursor from '../entities/CanvasCursor.js';

/**
 * MenuScene - Escena del menú principal con UI interactiva
 * Responsabilidad: Mostrar menú principal con botones y cursor
 */
class MenuScene {
    constructor() {
        this.name = 'menu';
        this.container = null;
        this.uiManager = null;
        this.isActive = false;
        
        this.menuItems = [
            {
                text: 'Entrar al Sistema',
                action: 'ENTER_SYSTEM',
                onClick: () => {
                    eventBus.emit('changeScene', { scene: 'desktop' });
                }
            },
            {
                text: 'Configuración',
                action: 'OPEN_SETTINGS',
                onClick: () => {
                    eventBus.emit('changeScene', { scene: 'settings' });
                }
            },
            {
                text: 'Información del Sistema',
                action: 'SHOW_SYSTEM_INFO',
                onClick: () => {
                    this.showSystemInfo();
                }
            },
            {
                text: 'Salir',
                action: 'EXIT_SYSTEM',
                onClick: () => {
                    this.exitSystem();
                }
            }
        ];
    }

    activate(container) {
        this.container = container;
        this.isActive = true;
        
        this.render();
        this.setupEventListeners();
        
        // Emitir evento de activación
        eventBus.emit('menuActivated', { scene: this });
    }

    deactivate() {
        this.isActive = false;
        this.cleanup();
        
        // Emitir evento de desactivación
        eventBus.emit('menuDeactivated', { scene: this });
    }

    render() {
        if (!this.container) return;
        
        // Limpiar contenedor
        this.container.innerHTML = '';
        
        // Crear fondo del menú
        this.createMenuBackground();
        
        // Crear UIManager para esta escena
        this.uiManager = new UIManager({
            container: this.container,
            cursorSize: 24,
            cursorSpeed: 8
        });
        
        // Crear elementos del menú
        this.createMenuElements();
        
        // Aplicar estilos
        this.applyMenuStyles();
    }

    createMenuBackground() {
        const background = document.createElement('div');
        background.className = 'menu-background';
        background.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        this.container.appendChild(background);
    }

    createMenuElements() {
        const menuContainer = document.createElement('div');
        menuContainer.className = 'menu-container';
        menuContainer.style.cssText = `
            text-align: center;
            color: #00e5ff;
            font-family: Arial, sans-serif;
            position: relative;
            z-index: 20;
        `;
        
        // Título del menú
        const title = document.createElement('h1');
        title.textContent = 'MIZU OS';
        title.style.cssText = `
            font-size: 48px;
            margin-bottom: 50px;
            text-shadow: 0 0 20px rgba(0, 229, 255, 0.8);
            animation: titleGlow 2s ease-in-out infinite alternate;
        `;
        
        menuContainer.appendChild(title);
        
        // Crear botones del menú usando UIManager
        const buttons = this.uiManager.createMenuButtons(this.menuItems, {
            y: 250,
            spacing: 25
        });
        
        // Prueba: render canvas button
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 120;
        canvas.style.cssText = 'position:absolute; left:20px; top:120px; z-index:10; border:1px solid rgba(0,229,255,0.2)';
        menuContainer.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        const testButton = new CanvasButton(20, 20, 180, 40, 'Canvas Button', () => {
            eventBus.emit('uiButtonClick', { buttonId: 'canvas-test', action: 'ENTER_SYSTEM' });
        });
        const cursor = new CanvasCursor();
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            testButton.render(ctx);
            cursor.render(ctx);
            requestAnimationFrame(draw);
        }
        draw();
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            testButton.setState(testButton.isHovered(x, y) ? 'hover' : 'normal');
        });
        canvas.addEventListener('mousedown', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            if (testButton.isHovered(x, y)) testButton.setState('pressed');
        });
        canvas.addEventListener('mouseup', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const hovered = testButton.isHovered(x, y);
            testButton.setState(hovered ? 'hover' : 'normal');
            if (hovered) testButton.trigger();
        });

        // Integración Cursor: seleccionar con input positivo si está sobre el botón
        eventBus.on('cursor:select', ({ x, y }) => {
            // convertir coords globales a coords del canvas
            const rect = canvas.getBoundingClientRect();
            const cx = x - rect.left;
            const cy = y - rect.top;
            if (testButton.isHovered(cx, cy)) {
                testButton.setState('pressed');
                testButton.trigger();
                setTimeout(() => testButton.setState('normal'), 100);
            }
        });
        
        // Crear HUD del menú
        this.createMenuHUD();

        // Adjuntar contenedor visual del menú
        const background = this.container.querySelector('.menu-background');
        (background || this.container).appendChild(menuContainer);
    }

    createMenuHUD() {
        // Crear información de controles
        const controlsInfo = this.uiManager.createHUDElement('menu-controls-info', {
            style: {
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                color: '#00e5ff',
                fontFamily: 'Arial, sans-serif',
                fontSize: '12px',
                zIndex: '30'
            },
            content: `
                <div>🔼🔽 Navegar | ⏎ Seleccionar | ESC Salir</div>
            `
        });
        
        // Crear información de versión
        const versionInfo = this.uiManager.createHUDElement('menu-version-info', {
            style: {
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                color: '#00e5ff',
                fontFamily: 'Arial, sans-serif',
                fontSize: '12px',
                zIndex: '30'
            },
            content: `
                <div>Mizu OS v0.7.2</div>
            `
        });
    }

    applyMenuStyles() {
        if (document.getElementById('menu-scene-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'menu-scene-styles';
        style.textContent = `
            @keyframes titleGlow {
                0% { text-shadow: 0 0 20px rgba(0, 229, 255, 0.8); }
                100% { text-shadow: 0 0 30px rgba(0, 229, 255, 1), 0 0 40px rgba(0, 229, 255, 0.5); }
            }
        `;
        
        document.head.appendChild(style);
    }

    showSystemInfo() {
        // Crear modal de información del sistema
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: rgba(15, 15, 35, 0.95);
            border: 2px solid #00e5ff;
            border-radius: 10px;
            padding: 30px;
            color: #00e5ff;
            font-family: Arial, sans-serif;
            max-width: 500px;
            text-align: center;
        `;
        
        content.innerHTML = `
            <h2>Información del Sistema</h2>
            <p><strong>Versión:</strong> Mizu OS 0.7.2</p>
            <p><strong>Arquitectura:</strong> Cloud OS</p>
            <p><strong>Motor:</strong> Vanilla JavaScript</p>
            <p><strong>Navegador:</strong> ${navigator.userAgent}</p>
            <p><strong>Resolución:</strong> ${window.innerWidth}x${window.innerHeight}</p>
            <br>
            <button id="close-system-info" style="
                background: rgba(0, 229, 255, 0.2);
                border: 1px solid #00e5ff;
                color: #00e5ff;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-family: Arial, sans-serif;
            ">Cerrar</button>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Event listener para cerrar
        document.getElementById('close-system-info').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Cerrar con ESC
        const closeModal = () => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
            document.removeEventListener('keydown', handleKeydown);
        };
        
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };
        
        document.addEventListener('keydown', handleKeydown);
    }

    exitSystem() {
        if (confirm('¿Estás seguro de que quieres salir del sistema?')) {
            eventBus.emit('systemExit', { reason: 'user_request' });
            window.close();
        }
    }

    setupEventListeners() {
        // Escuchar eventos de UI
        eventBus.on('uiButtonClick', (data) => {
            this.handleUIButtonClick(data);
        });
        
        // Escuchar eventos del sistema
        eventBus.on('systemExit', (data) => {
            console.log('Sistema saliendo:', data);
        });
    }

    handleUIButtonClick(data) {
        const { action } = data;
        
        switch (action) {
            case 'ENTER_SYSTEM':
                eventBus.emit('changeScene', { scene: 'desktop' });
                break;
            case 'OPEN_SETTINGS':
                eventBus.emit('changeScene', { scene: 'settings' });
                break;
            case 'SHOW_SYSTEM_INFO':
                this.showSystemInfo();
                break;
            case 'EXIT_SYSTEM':
                this.exitSystem();
                break;
        }
    }

    cleanup() {
        // Limpiar event listeners
        eventBus.off('uiButtonClick');
        eventBus.off('systemExit');
        
        // Destruir UIManager
        if (this.uiManager) {
            this.uiManager.destroy();
            this.uiManager = null;
        }
        
        // Limpiar contenedor
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

export default MenuScene;