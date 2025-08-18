# 🌌 Mizu OS

> 🧑‍💻 ¿Quieres crear tu propia app para Mizu OS? Lee la guía: [docs/crear-app-modular.md](docs/crear-app-modular.md)

Webapps OS — SPA que simula un sistema operativo futurista.

---

## 📦 Contrato de una App Modular en Mizu OS

Para que una app sea compatible con Mizu OS debe cumplir con:

- `apps/[nombre]/index.html`: Solo el contenido visual (sin `<html>`, `<head>`, ni `<body>`)
- `apps/[nombre]/styles.css`: Estilos específicos de la app (usa prefijos/IDs únicos, evita reglas globales como `body`, `*`, etc.)
- `apps/[nombre]/main.js`: Función global `initAppX(container)` que recibe el DOM donde se inyectará el contenido y aplica la lógica y estilos. Ejemplo: `window.initAppNotes = function(container) { ... }`
- `data/apps.json`: Metadatos de la app (id, nombre, icono, ruta del JS, nombre de la función init)

**Ejemplo de apps.json:**
```json
[
  {
    "id": "notes",
    "nombre": "Bloc de Notas",
    "icono": "📝",
    "ruta": "apps/notes/main.js",
    "init": "initAppNotes"
  },
  {
    "id": "speech",
    "nombre": "Mizu Speech",
    "icono": "🕹️",
    "ruta": "apps/speech/main.js",
    "init": "initAppSpeech"
  }
]
```

**Requisitos:**
- El sistema cargará el JS de la app solo cuando se abra.
- La función `initAppX(container)` debe inyectar el HTML y lógica en el contenedor recibido.
- Los estilos deben estar aislados usando IDs únicos (ej: `#app-notes .tab`).
- No debe haber conflictos de variables globales ni estilos.

---

## 🛸 Características actuales

- **Pantalla de carga animada** con barra de progreso y fondo estrellado
- **Modo standby** con hora y fecha en tiempo real
- **Escritorio interactivo** con iconos arrastrables y reordenables
- **Ventana flotante de aplicación** con efecto glassmorphism
- **Ventana única con modos normal, maximizado y pantalla completa** (sin slides)
- **Sistema modular de apps externas**: apps como Bloc de Notas y Mizu Speech se cargan dinámicamente, con estilos y lógica aislados
- **Transiciones suaves** entre pantallas
- **Diseño responsive** y adaptable a distintos tamaños de pantalla

## 🚀 Tecnologías utilizadas

- **HTML5** para la estructura
- **CSS3** con efectos de `backdrop-filter`, `box-shadow`, `border-radius` y animaciones
- **JavaScript** para la lógica de navegación, interacción y drag & drop
- **Sin frameworks**: todo el código es puro y fácilmente extensible

## 📦 Cómo usar

1. Clona o descarga el repositorio
2. Abre el archivo `index.html` en tu navegador
3. Interactúa con el sistema: espera la carga, toca el logo para activar,
   arrastra iconos, abre y maximiza aplicaciones

## 🛠️ Planes futuros

Este proyecto está en constante evolución. Aquí algunos desarrollos planeados:

### 🔧 Funcionalidades

- **Persistencia de escritorio**: guardar la posición de los iconos con `localStorage`
- **Multiventanas**: permitir abrir varias apps simultáneamente con gestión de capas
- **Sistema de notificaciones**: mensajes emergentes en la barra superior
- **Modo oscuro/claro**: alternancia de temas visuales
- **Soporte táctil completo**: optimización para dispositivos móviles

### 🎨 Diseño

- **Fondos dinámicos**: cambiar el wallpaper según la hora del día o el clima
- **Animaciones avanzadas**: integración con librerías como GSAP para transiciones más fluidas
- **Iconos personalizados**: SVGs temáticos para cada aplicación

### 📱 PWA (Progressive Web App)

- Convertir el sistema en una app instalable desde el navegador
- Soporte offline y caché inteligente
- Integración con notificaciones push

### 🧠 Inteligencia simulada

- Asistente virtual integrado
- Simulación de tareas automatizadas (calendario, recordatorios, etc.)

## 🤝 Contribuciones

¡Toda idea, sugerencia o mejora es bienvenida! Puedes abrir un issue o enviar un pull request si deseas colaborar.

---

**Licencia:** AGPL

**Autor:** Moises Nuñez

## 🧪 Desarrollo

- Requisitos: Node.js >= 18, npm >= 9
- Instalar deps y validar:

```bash
npm install
npm run check
npm run dev
```

La app se sirve en `http://localhost:5173`.

## 🧭 Versionado

Este repositorio sigue SemVer. Versión actual: `0.7.0`.

- `0.7.0`: sistema modular de apps externas (notes, speech) con carga dinámica y sin conflictos.
- `0.6.0`: refactor a ventana única con modos normal, maximizado y pantalla completa; iconos solo se ocultan en fullscreen; mejoras de UX y robustez.
- `0.5.0`: mejoras en el head, optimización del fondo de pantalla, optimización de los div.
- `0.4.0`: identificación por app y títulos dinámicos (“App N Maximizada” / “App N Modo Pantalla Completa”); navegación coherente entre maximizado y pantalla completa; escritorio con 8 iconos.
- `0.3.1`: fecha/hora locales del dispositivo; “Salir de full screen” vuelve a modo maximizado; escritorio con 8 iconos.
- `0.3.0`: hora local, sombra en reloj, clic en pantalla de standby en cualquier lugar.
- `0.2.0`: reestructuración del proyecto, separación CSS/JS, linters, corrección de assets.
- `0.1.0`: versión inicial.
