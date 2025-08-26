export default class UIManager {
  constructor() {
    this.elements = [];
  }

  addElement(element) {
    if (element && typeof element.render === 'function') {
      this.elements.push(element);
    }
  }

  clear() {
    this.elements = [];
  }

  render(ctx) {
    this.elements.forEach(el => el.render(ctx));
  }
}