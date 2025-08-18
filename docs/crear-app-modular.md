# 🧩 Cómo crear una app modular para Mizu OS

Mizu OS permite integrar apps externas de forma limpia, segura y sin conflictos. Aquí tienes la guía y una plantilla base para que desarrolles tu propia app.

---

## 🌐 Compatibilidad con la configuración global del sistema

Para que tu app se integre perfectamente con Mizu OS y respete las preferencias del usuario, sigue estas recomendaciones:

### Tema visual (oscuro, claro, daltonico, igual al sistema)
- Usa clases en el body: `theme-dark`, `theme-light`, `theme-daltonic`.
- Si tu app tiene selector de tema, incluye la opción "igual al sistema" y aplica el tema leyendo la clase del body:
  ```js
  const theme = document.body.classList.contains('theme-light') ? 'light' :
                document.body.classList.contains('theme-daltonic') ? 'daltonic' : 'dark';
  // Aplica el tema en tu app según este valor
  ```
- Usa variables CSS o clases en tu contenedor para cambiar colores según el tema.

### Idioma
- El idioma global está en `document.documentElement.lang` (`es` o `en`).
- Si tu app soporta varios idiomas, detecta el idioma así:
  ```js
  const lang = document.documentElement.lang || 'es';
  // Aplica textos según el idioma
  ```
- Si tu app tiene selector de idioma, incluye la opción "igual al sistema".

### Tamaño de fuente
- El tamaño global se aplica en `body.style.fontSize` (`14px`, `16px`, `20px`).
- Usa `em` o `rem` en tus estilos para que tu app escale automáticamente.
- Si tu app tiene selector de tamaño, incluye la opción "igual al sistema" y usa:
  ```js
  const fontSize = getComputedStyle(document.body).fontSize;
  // Aplica fontSize en tu app si es necesario
  ```

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

## 🧑‍💻 Ejemplo avanzado: app que respeta el sistema

```js
let ejemploHTML = '<div id="app-ejemplo"><h2>Demo App</h2><p id="msg"></p></div>';
let ejemploCSS = '#app-ejemplo { padding: 16px; border-radius: 8px; background: #222; color: #fff; }';
window.initAppEjemplo = function(container) {
  container.innerHTML = ejemploHTML;
  if (!document.getElementById('ejemplo-styles')) {
    const style = document.createElement('style');
    style.id = 'ejemplo-styles';
    style.textContent = ejemploCSS;
    document.head.appendChild(style);
  }
  const root = container.querySelector('#app-ejemplo');
  const msg = root.querySelector('#msg');
  // Detectar tema
  const theme = document.body.classList.contains('theme-light') ? 'claro' :
                document.body.classList.contains('theme-daltonic') ? 'daltonico' : 'oscuro';
  // Detectar idioma
  const lang = document.documentElement.lang || 'es';
  // Detectar tamaño de fuente
  const fontSize = getComputedStyle(document.body).fontSize;
  msg.textContent = `Tema: ${theme}, Idioma: ${lang}, Fuente: ${fontSize}`;
  // Aplicar tamaño de fuente
  root.style.fontSize = fontSize;
  // Cambiar colores según tema
  if (theme === 'claro') root.style.background = '#fff', root.style.color = '#222';
  if (theme === 'daltonico') root.style.background = '#0A1D37', root.style.color = '#fff';
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
