# 🧩 Cómo crear una app modular para Mizu OS

Mizu OS permite integrar apps externas de forma limpia, segura y sin conflictos. Aquí tienes la guía y una plantilla base para que desarrolles tu propia app.

---

## 📦 Estructura de una app

Cada app debe estar en su propia carpeta dentro de `apps/`:

```
apps/
  └── tuapp/
      ├── index.html   # Solo el contenido visual (sin <html>, <head>, <body>)
      ├── styles.css   # Estilos con prefijo único (ej: #app-tuapp)
      └── main.js      # Función global window.initAppTuapp(container)
```

---

## 📝 Contrato de una app

- **index.html**: Solo el contenido visual, dentro de un contenedor único (ej: `<div id="app-tuapp">...</div>`)
- **styles.css**: Todos los estilos bajo el prefijo `#app-tuapp` (evita reglas globales como `body`, `*`, etc.)
- **main.js**: Función global `window.initAppTuapp(container)` que:
  - Carga el HTML y CSS (usando fetch).
  - Inyecta el HTML en el `container` recibido.
  - Añade los estilos solo una vez.
  - Toda la lógica y selectores deben estar encapsulados bajo `#app-tuapp`.
- **apps.json**: Agrega tu app al catálogo con los campos: id, name, icon, path, init, title, version.

---

## 🧑‍💻 Plantilla base/core

### index.html
```html
<div id="app-tuapp">
  <h2>Mi App Modular</h2>
  <p>¡Bienvenido a tu app!</p>
</div>
```

### styles.css
```css
#app-tuapp {
  font-family: sans-serif;
  background: #222;
  color: #fff;
  padding: 16px;
  border-radius: 12px;
}
#app-tuapp h2 { color: #00e5ff; }
```

### main.js
```js
let tuappHTML = '';
let tuappCSS = '';
function loadTuappAssets() {
  if (tuappHTML && tuappCSS) return Promise.resolve();
  return Promise.all([
    fetch('apps/tuapp/index.html').then(r => r.text()).then(txt => { tuappHTML = txt; }),
    fetch('apps/tuapp/styles.css').then(r => r.text()).then(txt => { tuappCSS = txt; })
  ]);
}
window.initAppTuapp = function(container) {
  loadTuappAssets().then(() => {
    container.innerHTML = tuappHTML;
    if (!document.getElementById('tuapp-styles')) {
      const style = document.createElement('style');
      style.id = 'tuapp-styles';
      style.textContent = tuappCSS;
      document.head.appendChild(style);
    }
    // Aquí va tu lógica JS, usando selectores relativos a #app-tuapp
    const root = container.querySelector('#app-tuapp');
    if (!root) return;
    // Ejemplo: root.querySelector('h2').textContent = '¡Hola, mundo!';
  });
};
```

---

## 📋 apps.json (ejemplo)
```json
[
  {
    "id": 7,
    "name": "Mi App",
    "icon": "🧩",
    "path": "apps/tuapp/",
    "init": "initAppTuapp",
    "title": "Mi App Modular",
    "version": "1.0.0"
  }
]
```

---

## ✅ Recomendaciones
- Usa siempre IDs y prefijos únicos para evitar conflictos.
- No uses variables globales fuera de la función init.
- Si tu app necesita guardar datos, usa localStorage con una clave única.
- Puedes usar cualquier librería JS, pero cárgala dinámicamente dentro de tu función init si es necesario.

---

¿Dudas? ¡Abre un issue o revisa los ejemplos de apps existentes en el repositorio!
