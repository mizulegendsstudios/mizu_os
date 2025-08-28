import eventBus from '../../core/EventBus.js';

/**
 * DesktopIcons - Manejo de iconos del escritorio
 * Responsabilidad: crear iconos, manejar selección y navegación
 */
class DesktopIcons {
  constructor(container, config) {
    this.container = container;
    this.config = config;
    this.icons = [];
    this.selectedIndex = 0;
  }

  setIconsData(iconsData = []) {
    this.iconsData = iconsData;
  }

  createAll() {
    this.clear();
    let column = 0;
    let row = 0;

    (this.iconsData || []).forEach((iconData, index) => {
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

    this.select(0);
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

    icon.addEventListener('click', () => {
      this.select(index);
      this.launch();
    });

    icon.addEventListener('mouseenter', () => {
      this.select(index);
    });

    this.container.appendChild(icon);

    return { element: icon, data: iconData, index, x, y };
  }

  select(index) {
    if (index < 0 || index >= this.icons.length) return;

    if (this.selectedIndex < this.icons.length) {
      this.icons[this.selectedIndex].element.classList.remove('selected');
    }

    this.selectedIndex = index;
    const icon = this.icons[index];
    icon.element.classList.add('selected');

    eventBus.emit('iconSelected', {
      iconId: icon.data.id,
      iconName: icon.data.name,
      index
    });
  }

  navigate(direction) {
    if (this.icons.length === 0) return;

    const cols = this.config.gridColumns;
    const total = this.icons.length;
    let next = this.selectedIndex;

    switch (direction) {
      case 'up':
        next = this.selectedIndex - cols;
        if (next < 0) next = total - 1;
        break;
      case 'down':
        next = this.selectedIndex + cols;
        if (next >= total) next = 0;
        break;
      case 'left':
        next = this.selectedIndex - 1;
        if (next < 0) next = total - 1;
        break;
      case 'right':
        next = this.selectedIndex + 1;
        if (next >= total) next = 0;
        break;
    }

    this.select(next);
  }

  moveCursorToSelected(cursor, iconSize) {
    if (!cursor || this.icons.length === 0) return;
    const icon = this.icons[this.selectedIndex];
    cursor.animateTo(icon.x + iconSize / 2, icon.y + iconSize / 2);
  }

  launch() {
    if (this.selectedIndex >= this.icons.length) return;
    const icon = this.icons[this.selectedIndex];

    eventBus.emit('APP_LAUNCH', {
      appId: icon.data.id,
      appName: icon.data.name,
      action: icon.data.action
    });

    eventBus.emit(icon.data.action, {
      appId: icon.data.id,
      appName: icon.data.name
    });
  }

  handleCursorHover(x, y) {
    this.icons.forEach((icon, idx) => {
      const rect = icon.element.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        this.select(idx);
      }
    });
  }

  clear() {
    this.icons.forEach(icon => {
      if (icon.element && icon.element.parentNode) {
        icon.element.parentNode.removeChild(icon.element);
      }
    });
    this.icons = [];
  }
}

export default DesktopIcons;