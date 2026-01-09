# Data Model: Catálogo de Categorías

**Feature**: 003-catalogo-categorias
**Date**: 2026-01-09

## Entities

### Categoría

Representa una agrupación de artículos electrodomésticos en el sistema.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | number | ✓ | Identificador único de la categoría |
| nombre | string | ✓ | Nombre de la categoría (título principal) |
| descripcion | string | ✓ | Descripción de la categoría |
| activo | boolean | ✓ | Indica si la categoría está activa (visible) |
| imagen | string | ○ | Nombre del archivo de imagen de la categoría |

**Validation Rules**:
- `id`: Número positivo, único
- `nombre`: String no vacío
- `descripcion`: String (puede estar vacío)
- `activo`: Boolean, solo se muestran categorías con `activo: true`
- `imagen`: String, si es null/vacío se usa imagen placeholder

**State Transitions**: N/A (solo lectura en esta feature)

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CatalogoCategorias.js                                      │
│       │                                                     │
│       ├──► categoriasService.getCategorias()                │
│       │           │                                         │
│       │           ▼                                         │
│       │    GET /categoria                                   │
│       │           │                                         │
│       │           ▼                                         │
│       │    Filter: activo === true                          │
│       │           │                                         │
│       │           ▼                                         │
│       └──► Render CategoryCard[] ──► onClick ──► navigate   │
│                                       to /categoria/:id/    │
│                                          articulos          │
└─────────────────────────────────────────────────────────────┘
```

## API Response Shape

**Endpoint**: `GET /categoria`

**Response**: `Categoria[]`

```typescript
interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  imagen: string | null;
}

type CategoriasResponse = Categoria[];
```

## Frontend State

```typescript
interface CatalogoCategoriasState {
  categorias: Categoria[];
  isLoading: boolean;
  error: string | null;
}
```

**Initial State**:
```javascript
{
  categorias: [],
  isLoading: true,
  error: null
}
```

## Image URL Construction

```javascript
const getImageUrl = (categoria) => {
  if (!categoria.imagen) {
    return '/placeholder-categoria.png';
  }
  return `${apiRest}/images/categorias/${categoria.imagen}`;
};
```
