# 🌌 Mizu OS

> 🧑‍💻 ¿Quieres crear tu propia app para Mizu OS? Lee la guía: [docs/crear-app-modular.md](docs/crear-app-modular.md)

WebOS — Interfaz de Escritorio Virtual que ofrece un entorno unificado para acceder a herramientas básicas sin salir del navegador sin dependencias externas.

---

## 🚀 Ejecutar en local (Vite)

Requisitos: Node 18+

```bash
npm install
npm run dev
```

- Abre la URL que indica Vite (por defecto `http://localhost:5173`)
- Build: `npm run build`
- Preview: `npm run preview`

Estructura de escenas activa: Boot → Menu → Desktop (seleccionable desde el menú)

Controles:
- Flechas: navegar (↑ ↓ ← →)
- Enter: acción positiva (seleccionar/entrar)
- Escape: acción negativa (volver/salir)

---

## 🧪 Páginas de prueba incluidas

- `ui-test.html`: prueba de UI (botones, cursor, navegación y escenas)
- `stress-test.html`: estrés de 100 evt/s, cambios rápidos de escena, memoria
- `optimization-test.html`: métricas de FPS, memoria y tiempo de carga

Abrirlas con Vite en:
- `http://localhost:5173/ui-test.html`
- `http://localhost:5173/stress-test.html`
- `http://localhost:5173/optimization-test.html`

---

## 🧩 Arquitectura actual (0.7.2)

- `src/core/`: `EventBus`, `SceneManager`, `State`, `InputManager`
- `src/scenes/`: `BootScene`, `MenuScene`, `DesktopScene`
- `src/ui/`: `UIManager`
- `src/entities/`: `Button`, `Cursor`
- `src/assets/`: estilos de escenas

Regla de oro: cada archivo ≤ 200 líneas (si crece, se divide).

---

## 🆘 Troubleshooting (pantalla negra)

Si ves solo “cargando…” y luego pantalla negra:
- Revisa la consola: no debe haber errores.
- Asegura que `MenuScene` adjunta su contenedor visual (corregido en 0.7.2).
- Verifica que `src/main.js` registre las escenas `boot`, `menu`, `desktop`.
- Limpia caché/Hard Reload si estás en GitHub Pages.
- En móvil, prueba `ui-test.html` para verificar InputManager/UI.

Si persiste, abre un issue con: navegador, SO, logs de consola y pasos.

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

- Carga/boot con transición a menú
- Menú con navegación por flechas, cursor y botones
- Escritorio básico con iconos navegables y evento `APP_LAUNCH`
- Páginas de test de rendimiento y UI

## 🚀 Tecnologías utilizadas

- Vanilla JS (sin frameworks)
- Vite para desarrollo y build
- HTML/CSS

## 🤝 Contribuciones

¡Toda idea, sugerencia o mejora es bienvenida! Abre un issue o PR.

---

**Licencia:** MIT

**Autor:** Moises Nuñez

## 🧭 Versionado

Versión actual: `0.7.2`.
- `0.7.2`: arquitectura por escenas, UI interactiva, DesktopScene básica, páginas de prueba.
- `0.7.1`: correciones de compatibilidad y documentación.
- `0.7.0`: sistema modular de apps externas (notes, speech) con carga dinámica y sin conflictos.
