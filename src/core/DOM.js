export function ensureContainer(id, styles = '') {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('div');
    el.id = id;
    el.style.cssText = styles;
    document.body.appendChild(el);
  }
  return el;
}
