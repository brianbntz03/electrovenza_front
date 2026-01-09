# Research: Listado de Artículos por Categoría

**Feature**: 004-articulos-categoria
**Date**: 2026-01-09

## Research Tasks Completed

### 1. Estructura de Datos de Artículo

**Decisión**: Usar la estructura del endpoint `/articulos/by-category-id/{categoryId}`

**Estructura de respuesta**:
```json
[
  {
    "id": 24,
    "nombre": "Balanza de Cocina SF 40",
    "descripcion": "Balanza Digital De Cocina 1 Gr- 10 Kg Precision...",
    "activo": true,
    "precio": "12500",
    "precio_mayorista": "7398",
    "precio_compra": "6217",
    "porcentaje_comision_vendedor": "10.00",
    "porcentaje_comision_mayorista": "3.00",
    "stock": 4,
    "imagen": "articulo_24.jpeg"
  }
]
```

**Rationale**: El endpoint provee todos los campos necesarios para la visualización.

**Campos a mostrar en tarjeta**:
- `imagen` - Foto del producto
- `nombre` - Título
- `descripcion` - Truncada a ~100 caracteres
- `precio` o `precio_mayorista` - Según rol del usuario
- `stock` - Indicador de disponibilidad

---

### 2. Lógica de Precio por Rol

**Decisión**: Determinar precio a mostrar según rol almacenado en localStorage

**Implementación**:
```javascript
const getPrecioDisplay = (articulo) => {
  const userRole = localStorage.getItem('user_role');
  if (userRole === 'Vendedor Mayorista') {
    return articulo.precio_mayorista;
  }
  return articulo.precio;
};
```

**Rationale**: Cumple con Constitution Principle II (Dual Pricing). El rol se obtiene de localStorage (patrón existente en `App.js`).

**Alternativas consideradas**:
- Obtener rol desde Context → Podría ser mejor arquitectónicamente pero requiere refactoring
- Pasar rol como prop → Viable, pero componente sería menos autónomo

---

### 3. Indicador de Stock

**Decisión**: Mostrar badge visual según nivel de stock

| Stock | Display |
|-------|---------|
| 0 | "Sin stock" (badge rojo) |
| 1-5 | "Últimas unidades" (badge amarillo) |
| >5 | "Disponible" (badge verde) |

**Rationale**: Proporciona información útil al usuario sin revelar cantidad exacta.

**Alternativas consideradas**:
- Mostrar número exacto → Rechazado: puede confundir al usuario final
- Solo disponible/no disponible → Aceptable pero menos informativo

---

### 4. Patrón de Componentes

**Decisión**: Crear carpeta `src/pages/ArticulosCategoria/` con componentes co-ubicados

**Estructura**:
```
src/pages/ArticulosCategoria/
├── ArticulosCategoria.js
├── ArticulosCategoria.css
└── components/
    ├── ArticuloCard.js
    └── ArticuloCard.css
```

**Rationale**: Consistente con feature 003 y patrón de VentaMayorista.

---

### 5. Obtención del ID de Categoría

**Decisión**: Usar `useParams` de React Router

**Implementación**:
```javascript
import { useParams } from 'react-router-dom';

const { categoriaId } = useParams();
```

**Ruta**: `/categoria/:categoriaId/articulos`

**Rationale**: Patrón estándar de React Router para rutas dinámicas.

---

### 6. Truncado de Descripción

**Decisión**: Truncar a 120 caracteres con elipsis

**Implementación**:
```javascript
const truncateDescription = (text, maxLength = 120) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};
```

**Rationale**: Balance entre información y consistencia visual.

---

### 7. Layout Responsive

**Decisión**: CSS Grid con breakpoints específicos

| Viewport | Columns |
|----------|---------|
| >1200px | 4 |
| 992-1199px | 3 |
| 768-991px | 2 |
| <768px | 1 |

**Rationale**: Similar a layouts de e-commerce populares (MercadoLibre, Amazon).

---

### 8. Estados de UI

**Decisión**: Manejar 5 estados: loading, error, empty, invalid-category, success

| Estado | Trigger | Display |
|--------|---------|---------|
| loading | Fetch en progreso | Spinner |
| error | API retorna error | Mensaje + botón reintentar |
| empty | Array vacío con categoría válida | "No hay artículos en esta categoría" |
| invalid-category | 404 o categoría no existe | "Categoría no encontrada" |
| success | Datos cargados | Grid de ArticuloCards |

---

### 9. Navegación de Retorno

**Decisión**: Botón "← Volver a categorías" + breadcrumb simple

**Implementación**:
```javascript
<button onClick={() => navigate('/catalogo-categorias')}>
  ← Volver a Categorías
</button>
```

**Rationale**: Simple y directo. Breadcrumb completo sería over-engineering para este caso.

---

### 10. Manejo de Imágenes

**Decisión**: Mismo patrón que categorías

**URL**: `${apiRest}/images/articulos/${articulo.imagen}`

**Placeholder**: `/placeholder-articulo.png`

---

## Decisiones de Diseño Finales

| Aspecto | Decisión |
|---------|----------|
| Estructura de carpetas | `src/pages/ArticulosCategoria/` con componentes co-ubicados |
| Servicio API | Extender `articulosService.js` |
| Precio display | Según rol (mayorista vs minorista) |
| Indicador stock | Badge con 3 niveles (sin stock, últimas unidades, disponible) |
| Descripción | Truncada a 120 caracteres |
| Layout | CSS Grid responsive 4-3-2-1 columnas |
| Navegación | Link "Volver a Categorías" |
| Ruta | `/categoria/:categoriaId/articulos` |
