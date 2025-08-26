import eventBus from '../core/EventBus.js';
import UIManager from '../ui/UIManager.js';

/**
 * DesktopScene - Escena del escritorio principal
 * Responsabilidad: Mostrar escritorio con iconos y navegación
 */
class DesktopScene {
    constructor() {
        this.name = 'desktop';
        this.container = null;
        this.uiManager = null;
        this.icons = [];
        this.selectedIconIndex = 0;
        this.isActive = false;
        
        this.config = {
            iconSize: 64,
            iconSpacing: 20,
            gridColumns: 4,
            startX: 100,
            startY: 100
        };
        
        this.desktopIcons = [
            {
                id: 'file-manager',
                name: 'Explorador',
                icon: '📁',
                action: 'OPEN_FILE_MANAGER',
                x: 0,
                y: 0
            },
            {
                id: 'text-editor',
                name: 'Editor',
                icon: '📝',
                action: 'OPEN_TEXT_EDITOR',
                x: 0,
                y: 0
            },
            {
                id: 'calculator',
                name: 'Calculadora',
                icon: '🧮',
                action: 'OPEN_CALCULATOR',
                x: 0,
                y: 0
            },
            {
                id: 'settings',
                name: 'Configuración',
                icon: '⚙️',
                action: 'OPEN_SETTINGS',
                x: 0,
                y: 0
            },
            {
                id: 'terminal',
                name: 'Terminal',
                icon: '💻',
                action: 'OPEN_TERMINAL',
                x: 0,
                y: 0
            },
            {
                id: 'browser',
                name: 'Navegador',
                icon: '🌐',
                action: 'OPEN_BROWSER',
                x: 0,
                y: 0
            }
        ];
    }

    activate(container) {
        this.container = container;
        this.isActive = true;
        
        this.render();
        this.setupEventListeners();
        
        // Emitir evento de activación
        eventBus.emit('desktopActivated', { scene: this });
    }

    deactivate() {
        this.isActive = false;
        this.cleanup();
        
        // Emitir evento de desactivación
        eventBus.emit('desktopDeactivated', { scene: this });
    }

    render() {
        if (!this.container) return;
        
        // Limpiar contenedor
        this.container.innerHTML = '';
        
        // Crear fondo del escritorio
        this.createDesktopBackground();
        
        // Crear UIManager para esta escena
        this.uiManager = new UIManager({
            container: this.container,
            cursorSize: 24,
            cursorSpeed: 8
        });
        
        // Crear iconos del escritorio
        this.createDesktopIcons();
        
        // Crear HUD del escritorio
        this.createDesktopHUD();
        
        // Seleccionar primer icono
        this.selectIcon(0);
    }

    createDesktopBackground() {
        const background = document.createElement('div');
        background.className = 'desktop-background';
        background.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
            overflow: hidden;
        `;
        
        // Agregar patrón de fondo
        const pattern = document.createElement('div');
        pattern.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                radial-gradient(circle at 25% 25%, rgba(0, 229, 255, 0.1) 1px, transparent 1px),
                radial-gradient(circle at 75% 75%, rgba(0, 255, 136, 0.1) 1px, transparent 1px);
            background-size: 50px 50px;
            animation: backgroundFloat 20s ease-in-out infinite;
        `;
        
        background.appendChild(pattern);
        this.container.appendChild(background);
        
        // Agregar estilos de animación
        this.addBackgroundStyles();
    }

    addBackgroundStyles() {
        if (document.getElementById('desktop-background-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'desktop-background-styles';
        style.textContent = `
            @keyframes backgroundFloat {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-10px) rotate(1deg); }
            }
            
            .desktop-icon {
                position: absolute;
                width: 64px;
                height: 80px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                user-select: none;
                z-index: 10;
            }
            
            .desktop-icon:hover {
                transform: scale(1.1);
            }
            
            .desktop-icon.selected {
                background: rgba(0, 255, 136, 0.2);
                border: 2px solid #00ff88;
                border-radius: 8px;
                transform: scale(1.05);
            }
            
            .desktop-icon-emoji {
                font-size: 32px;
                margin-bottom: 5px;
            }
            
            .desktop-icon-name {
                font-size: 10px;
                color: #00e5ff;
                text-align: center;
                font-family: Arial, sans-serif;
                text-shadow: 0 0 5px rgba(0, 229, 255, 0.5);
            }
        `;
        
        document.head.appendChild(style);
    }

    createDesktopIcons() {
        this.icons = [];
        let column = 0;
        let row = 0;
        
        this.desktopIcons.forEach((iconData, index) => {
            const x = this.config.startX + (column * (this.config.iconSize + this.config.iconSpacing));
            const y = this.config.startY + (row * (this.config.iconSize + this.config.iconSpacing + 20));
            
            const icon = this.createIcon(iconData, x, y, index);
            this.icons.push(icon);
            
            column++;
            if (column >= this.config.gridColumns) {
                column = 0;
                row++;
            }
        });
    }

    createIcon(iconData, x, y, index) {
        const icon = document.createElement('div');
        icon.className = 'desktop-icon';
        icon.dataset.iconId = iconData.id;
        icon.dataset.iconIndex = index;
        icon.style.left = `${x}px`;
        icon.style.top = `${y}px`;
        
        icon.innerHTML = `
            <div class="desktop-icon-emoji">${iconData.icon}</div>
            <div class="desktop-icon-name">${iconData.name}</div>
        `;
        
        // Event listeners
        icon.addEventListener('click', () => {
            this.handleIconClick(index);
        });
        
        icon.addEventListener('mouseenter', () => {
            this.selectIcon(index);
        });
        
        this.container.appendChild(icon);
        
        return {
            element: icon,
            data: iconData,
            index: index,
            x: x,
            y: y
        };
    }

    createDesktopHUD() {
        // Crear barra de tareas
        const taskbar = this.uiManager.createHUDElement('desktop-taskbar', {
            style: {
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '100%',
                height: '40px',
                background: 'rgba(0, 0, 0, 0.8)',
                borderTop: '1px solid rgba(0, 229, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 20px',
                zIndex: '50'
            },
            content: `
                <div style="color: #00e5ff; font-family: Arial, sans-serif; font-size: 12px;">
                    Mizu OS - Escritorio
                </div>
                <div style="margin-left: auto; color: #00e5ff; font-size: 12px;" id="desktop-time">
                    ${new Date().toLocaleTimeString()}
                </div>
            `
        });
        
        // Actualizar tiempo cada segundo
        setInterval(() => {
            const timeElement = document.getElementById('desktop-time');
            if (timeElement) {
                timeElement.textContent = new Date().toLocaleTimeString();
            }
        }, 1000);
        
        // Crear botón de menú
        const menuButton = this.uiManager.createButton({
            text: 'Menú',
            x: 20,
            y: window.innerHeight - 35,
            width: 80,
            height: 30,
            action: 'OPEN_MENU',
            onClick: () => {
                eventBus.emit('changeScene', { scene: 'menu' });
            }
        });
    }

    setupEventListeners() {
        // Escuchar eventos de navegación
        eventBus.on('navigate', (data) => {
            this.handleNavigation(data);
        });
        
        // Escuchar eventos de acción
        eventBus.on('action', (data) => {
            this.handleAction(data);
        });
        
        // Escuchar eventos de UI
        eventBus.on('uiButtonClick', (data) => {
            this.handleUIButtonClick(data);
        });
        
        // Escuchar eventos de cursor
        eventBus.on('cursorMoved', (data) => {
            this.handleCursorMove(data);
        });
    }

    handleNavigation(data) {
        const { direction } = data;
        
        switch (direction) {
            case 'up':
                this.navigateIcons('up');
                break;
            case 'down':
                this.navigateIcons('down');
                break;
            case 'left':
                this.navigateIcons('left');
                break;
            case 'right':
                this.navigateIcons('right');
                break;
        }
    }

    handleAction(data) {
        const { type } = data;
        
        if (type === 'positive') {
            this.launchSelectedApp();
        } else if (type === 'negative') {
            eventBus.emit('changeScene', { scene: 'menu' });
        }
    }

    handleUIButtonClick(data) {
        const { action } = data;
        
        switch (action) {
            case 'OPEN_MENU':
                eventBus.emit('changeScene', { scene: 'menu' });
                break;
        }
    }

    handleCursorMove(data) {
        const { x, y } = data;
        
        // Verificar si el cursor está sobre algún icono
        this.icons.forEach((icon, index) => {
            const rect = icon.element.getBoundingClientRect();
            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                this.selectIcon(index);
            }
        });
    }

    navigateIcons(direction) {
        if (this.icons.length === 0) return;
        
        const currentIndex = this.selectedIconIndex;
        let nextIndex = currentIndex;
        
        switch (direction) {
            case 'up':
                nextIndex = currentIndex - this.config.gridColumns;
                if (nextIndex < 0) {
                    nextIndex = this.icons.length - 1;
                }
                break;
            case 'down':
                nextIndex = currentIndex + this.config.gridColumns;
                if (nextIndex >= this.icons.length) {
                    nextIndex = 0;
                }
                break;
            case 'left':
                nextIndex = currentIndex - 1;
                if (nextIndex < 0) {
                    nextIndex = this.icons.length - 1;
                }
                break;
            case 'right':
                nextIndex = currentIndex + 1;
                if (nextIndex >= this.icons.length) {
                    nextIndex = 0;
                }
                break;
        }
        
        this.selectIcon(nextIndex);
    }

    selectIcon(index) {
        if (index < 0 || index >= this.icons.length) return;
        
        // Deseleccionar icono anterior
        if (this.selectedIconIndex < this.icons.length) {
            this.icons[this.selectedIconIndex].element.classList.remove('selected');
        }
        
        // Seleccionar nuevo icono
        this.selectedIconIndex = index;
        this.icons[index].element.classList.add('selected');
        
        // Mover cursor al icono seleccionado
        if (this.uiManager && this.uiManager.getCursor()) {
            const icon = this.icons[index];
            this.uiManager.getCursor().animateTo(
                icon.x + this.config.iconSize / 2,
                icon.y + this.config.iconSize / 2
            );
        }
        
        // Emitir evento de selección
        eventBus.emit('iconSelected', {
            iconId: this.icons[index].data.id,
            iconName: this.icons[index].data.name,
            index: index
        });
    }

    handleIconClick(index) {
        this.selectIcon(index);
        this.launchSelectedApp();
    }

    launchSelectedApp() {
        if (this.selectedIconIndex >= this.icons.length) return;
        
        const selectedIcon = this.icons[this.selectedIconIndex];
        const action = selectedIcon.data.action;
        
        // Emitir evento de lanzamiento de aplicación
        eventBus.emit('APP_LAUNCH', {
            appId: selectedIcon.data.id,
            appName: selectedIcon.data.name,
            action: action
        });
        
        // Emitir evento específico de la aplicación
        eventBus.emit(action, {
            appId: selectedIcon.data.id,
            appName: selectedIcon.data.name
        });
        
        console.log(`🚀 Lanzando aplicación: ${selectedIcon.data.name} (${action})`);
    }

    cleanup() {
        // Limpiar event listeners
        eventBus.off('navigate');
        eventBus.off('action');
        eventBus.off('uiButtonClick');
        eventBus.off('cursorMoved');
        
        // Destruir UIManager
        if (this.uiManager) {
            this.uiManager.destroy();
            this.uiManager = null;
        }
        
        // Limpiar iconos
        this.icons.forEach(icon => {
            if (icon.element && icon.element.parentNode) {
                icon.element.parentNode.removeChild(icon.element);
            }
        });
        this.icons = [];
        
        // Limpiar contenedor
        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    // Métodos de utilidad
    getSelectedIcon() {
        if (this.selectedIconIndex < this.icons.length) {
            return this.icons[this.selectedIconIndex];
        }
        return null;
    }

    getIconCount() {
        return this.icons.length;
    }

    isIconSelected() {
        return this.selectedIconIndex >= 0 && this.selectedIconIndex < this.icons.length;
    }
}

export default DesktopScene;