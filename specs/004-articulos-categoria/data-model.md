# Data Model: Listado de Artículos por Categoría

**Feature**: 004-articulos-categoria
**Date**: 2026-01-09

## Entities

### Artículo

Representa un producto electrodoméstico en el sistema.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | number | ✓ | Identificador único del artículo |
| nombre | string | ✓ | Nombre del producto |
| descripcion | string | ✓ | Descripción detallada del producto |
| activo | boolean | ✓ | Indica si el artículo está activo (visible) |
| precio | string | ✓ | Precio minorista (formato string numérico) |
| precio_mayorista | string | ✓ | Precio mayorista (formato string numérico) |
| precio_compra | string | ✓ | Precio de compra (no se muestra en UI) |
| porcentaje_comision_vendedor | string | ○ | Comisión vendedor minorista (no se muestra) |
| porcentaje_comision_mayorista | string | ○ | Comisión vendedor mayorista (no se muestra) |
| stock | number | ✓ | Cantidad disponible en inventario |
| imagen | string | ○ | Nombre del archivo de imagen del artículo |

**Validation Rules**:
- `id`: Número positivo, único
- `nombre`: String no vacío
- `descripcion`: String (puede ser largo, se trunca en UI)
- `activo`: Boolean, solo se muestran artículos con `activo: true`
- `precio`, `precio_mayorista`: Strings numéricos (ej: "12500")
- `stock`: Número >= 0
- `imagen`: String, si es null/vacío se usa placeholder

**State Transitions**: N/A (solo lectura en esta feature)

---

### Categoría (referencia)

Se usa solo el ID para filtrar artículos.

| Field | Type | Description |
|-------|------|-------------|
| id | number | Identificador de categoría (obtenido de URL) |

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  URL: /categoria/:categoriaId/articulos                     │
│       │                                                     │
│       ▼                                                     │
│  ArticulosCategoria.js                                      │
│       │                                                     │
│       ├──► useParams() → categoriaId                        │
│       │                                                     │
│       ├──► localStorage.getItem('user_role') → userRole     │
│       │                                                     │
│       ├──► articulosService.getArticulosByCategoria(id)     │
│       │           │                                         │
│       │           ▼                                         │
│       │    GET /articulos/by-category-id/{categoryId}       │
│       │           │                                         │
│       │           ▼                                         │
│       │    Filter: activo === true                          │
│       │           │                                         │
│       │           ▼                                         │
│       └──► Render ArticuloCard[]                            │
│                   │                                         │
│                   ├── getPrecioByRole(userRole)             │
│                   ├── getStockIndicator(stock)              │
│                   └── truncateDescription(descripcion)      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## API Response Shape

**Endpoint**: `GET /articulos/by-category-id/{categoryId}`

**Response**: `Articulo[]`

```typescript
interface Articulo {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  precio: string;
  precio_mayorista: string;
  precio_compra: string;
  porcentaje_comision_vendedor: string;
  porcentaje_comision_mayorista: string;
  stock: number;
  imagen: string | null;
}

type ArticulosResponse = Articulo[];
```

## Frontend State

```typescript
interface ArticulosCategoriaState {
  articulos: Articulo[];
  isLoading: boolean;
  error: string | null;
  categoriaId: string | null;
}
```

**Initial State**:
```javascript
{
  articulos: [],
  isLoading: true,
  error: null,
  categoriaId: null
}
```

## Display Logic

### Precio por Rol

```javascript
const ROLES = {
  WHOLESALE_SELLER: 'Vendedor Mayorista'
};

const getPrecioDisplay = (articulo, userRole) => {
  if (userRole === ROLES.WHOLESALE_SELLER) {
    return articulo.precio_mayorista;
  }
  return articulo.precio;
};

const formatPrecio = (precio) => {
  const num = parseFloat(precio);
  return `$${num.toLocaleString('es-AR')}`;
};
```

### Indicador de Stock

```javascript
const getStockIndicator = (stock) => {
  if (stock === 0) {
    return { text: 'Sin stock', className: 'stock-none' };
  }
  if (stock <= 5) {
    return { text: 'Últimas unidades', className: 'stock-low' };
  }
  return { text: 'Disponible', className: 'stock-available' };
};
```

### Truncado de Descripción

```javascript
const truncateDescription = (text, maxLength = 120) => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength).trim() + '...';
};
```

## Image URL Construction

```javascript
const getImageUrl = (articulo) => {
  if (!articulo.imagen) {
    return '/placeholder-articulo.png';
  }
  return `${apiRest}/images/articulos/${articulo.imagen}`;
};
```
