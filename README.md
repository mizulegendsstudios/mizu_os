# 🌌 Mizu Cloud OS - M1ST

WebOS — Interfaz de Escritorio Virtual que ofrece un entorno unificado para acceder a herramientas básicas sin salir del navegador sin dependencias externas.

---

Controles (smartphone+tablet):
- Tactil

Controles (Smart-TV):
- Flechas: navegar (↑ ↓ ← →)
- Ok: acción positiva (seleccionar/entrar)
- Back: acción negativa (volver/salir)

Controles (desktop+laptop):
- Flechas: navegar (↑ ↓ ← →)
- Enter: acción positiva (seleccionar/entrar)
- Escape: acción negativa (volver/salir)

---
## 🧩 Arquitectura actual (2.1.0)

- `src/core/`: `EventBus`, `SceneManager`, `State`, `InputManager`
- `src/scenes/`: `BootScene`, `MenuScene`, `DesktopScene`
- `src/ui/`: `UIManager`
- `src/entities/`: `Button`, `Cursor`
- `src/assets/`: estilos de escenas

Regla de oro: cada archivo ≤ 300 líneas (si crece, se divide).

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

- Barra de tareas lateral con navegación por flechas, cursor y botones.
- Escritorio básico con iconos navegables y evento `APP_LAUNCH`

---

## 🛸 Características futuras
- Compatibilidad con Android 11 o versiones más recientes.

## 🚀 Tecnologías utilizadas

- Vanilla JS (sin frameworks)
- Vite para desarrollo y build
- HTML/CSS

## 🤝 Contribuciones

¡Toda idea, sugerencia o mejora es bienvenida! Abre un issue o PR.

---

**Licencia:** AGPL 3.0

**Autor:** Moises Nuñez

## 🧭 Versionado

Versión actual: `3.0.1`.
- `3.0.1`: github login
- `3.0.0`: arquitectura por escenas, UI interactiva, DesktopScene básica, páginas de prueba, correciones documentación y limpieza de archivos incompatibles.
- `2.0.0`: base de Mizu Cloud OS 2.0.0
