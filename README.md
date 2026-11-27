# DevShelf

Biblioteca personal para guardar y organizar recursos de aprendizaje de programación.
Permite centralizar videos, artículos, documentación, cursos y herramientas en un solo lugar.

## Funcionalidades

- Página de bienvenida con estadísticas (total de recursos, favoritos y temas).
- Registro de recursos con validación de formulario.
- Listado de recursos en tarjetas con badges por tipo.
- Edición de recursos.
- Persistencia en `localStorage` (clave `"devshelf:recursos"`).

## Tecnologías

- **Vite**: `^8.3.6`
- **JavaScript vanilla**: módulos ES (sin frameworks)
- **CSS**: estilos basados en variables CSS
- **uuid**: generación de identificadores únicos (sin versión declarada en `package.json`)

## Requisitos

- Node.js
- pnpm

## Estructura del proyecto

```text
src/
├── main.js                # Punto de entrada de la aplicación
├── style.css              # Importa los archivos de estilos de src/styles/
├── router.js              # Router por hash
├── components/            # Piezas reutilizables (navbar, toast)
├── views/                 # Una vista por página
├── services/
│   └── storage.js         # Acceso y persistencia en localStorage
└── data/
    └── options.js         # Opciones de tipo, tema y nivel
```

## Modelo de datos

Cada recurso almacenado en `localStorage` sigue esta estructura JSON:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "titulo": "Documentación oficial de MDN",
  "url": "https://developer.mozilla.org",
  "tipo": "docs",
  "tema": "javascript",
  "nivel": "basico",
  "favorito": true,
  "fechaCreacion": "2026-11-27T14:50:00.000Z"
}
```

## Autor

[Tu nombre]
Proyecto del bootcamp [Nombre del bootcamp]
