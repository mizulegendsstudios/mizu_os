# 🌌 Mizu OS

Webapps OS — SPA que simula un sistema operativo futurista.

## 🧩 Características actuales

- **Pantalla de carga animada** con barra de progreso y fondo estrellado
- **Modo standby** con hora y fecha en tiempo real
- **Escritorio interactivo** con iconos arrastrables y reordenables
- **Ventana flotante de aplicación** con efecto glassmorphism
- **Modo maximizado** que cubre toda la pantalla con bordes cuadrados
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

**Autor:** Moises Núñez

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

Este repositorio sigue SemVer. Versión actual: `0.4.0`.

- `0.4.0`: independencia de las ventanas de las apps.
- `0.3.1`: hora local, 4 nuevos iconos, ajustes menores.
- `0.3.0`: hora local, sombra en reloj, clic en pantalla de standby en cualquier lugar.
- `0.2.0`: reestructuración del proyecto, separación CSS/JS, linters, corrección de assets.
- `0.1.0`: versión inicial.
