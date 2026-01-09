# Research: Catálogo de Categorías

**Feature**: 003-catalogo-categorias
**Date**: 2026-01-09

## Research Tasks Completed

### 1. Estructura de Datos de Categoría

**Decisión**: Usar la estructura existente del endpoint `/categoria`

**Estructura de respuesta**:
```json
[
  {
    "id": 1,
    "nombre": "Cuidado personal",
    "descripcion": "cortadora de pelo, planchita, secador, cremas, etc",
    "activo": true,
    "imagen": "categoria_1.jpeg"
  }
]
```

**Rationale**: El endpoint ya existe y provee todos los campos necesarios (id, nombre, descripcion, activo, imagen).

**Alternativas consideradas**: Ninguna - usar endpoint existente es lo más simple.

---

### 2. Patrón de Componentes

**Decisión**: Seguir el patrón de `/pages/VentaMayorista/` con componentes co-ubicados

**Estructura**:
```
src/pages/CatalogoCategorias/
├── CatalogoCategorias.js
└── components/
    └── CategoryCard.js
```

**Rationale**: Consistente con el patrón existente en el proyecto para features nuevas. Facilita mantenimiento y localización de código relacionado.

**Alternativas consideradas**:
- Componente único monolítico → Rechazado: menos mantenible, difícil de testear
- Componentes en carpeta global `/Components/` → Rechazado: CategoryCard es específico de esta feature

---

### 3. Manejo de Imágenes

**Decisión**: Construir URL de imagen usando variable de entorno `REACT_APP_API_URL`

**Formato de URL**: `${apiRest}/images/categorias/${categoria.imagen}`

**Rationale**: Sigue el patrón existente para imágenes de artículos. Si `imagen` es null/vacío, usar placeholder.

**Placeholder**: `/placeholder-categoria.png` (imagen estática en `/public/`)

**Alternativas consideradas**:
- Hardcodear URL base → Rechazado: no portable entre ambientes
- Usar campo `imagen` como URL completa → Rechazado: el backend retorna solo nombre de archivo

---

### 4. Navegación a Artículos

**Decisión**: Usar React Router `useNavigate` para navegar a `/categoria/{id}/articulos`

**Rationale**: Patrón estándar en el proyecto. La ruta nueva se integrará con feature 004.

**Formato de ruta**: `/categoria/:categoriaId/articulos`

**Alternativas consideradas**:
- Query parameters (`/articulos?categoria=1`) → Rechazado: URLs menos semánticas
- Link directo con `<Link>` → Aceptable pero `useNavigate` ofrece más control

---

### 5. Layout Responsive

**Decisión**: CSS Grid con `auto-fill` y `minmax`

**Breakpoints**:
- Desktop (>992px): 4 columnas
- Tablet (768-991px): 3 columnas
- Mobile (<768px): 1-2 columnas

**Rationale**: CSS Grid es soportado por todos los navegadores modernos y ofrece layout fluido sin JavaScript adicional.

**Alternativas consideradas**:
- Flexbox → Aceptable pero Grid es más apropiado para layouts de grilla
- Bootstrap Grid → Rechazado: agregar dependencia innecesaria cuando CSS nativo es suficiente

---

### 6. Estados de UI

**Decisión**: Manejar 4 estados: loading, error, empty, success

| Estado | Componente |
|--------|------------|
| Loading | Spinner centrado con mensaje "Cargando categorías..." |
| Error | Mensaje de error con botón "Reintentar" |
| Empty | Mensaje "No hay categorías disponibles" |
| Success | Grid de CategoryCards |

**Rationale**: Cobertura completa de casos de uso mejora UX y facilita testing.

---

### 7. Servicio de API

**Decisión**: Crear `src/service/categoriasService.js` siguiendo patrón de `articulosService.js`

**Funciones**:
```javascript
export const getCategorias = async () => { ... }
export const getCategoriasActivas = async () => { ... }
```

**Rationale**: Encapsula lógica de API, facilita testing y mantiene consistencia con el proyecto.

---

## Decisiones de Diseño Finales

| Aspecto | Decisión |
|---------|----------|
| Estructura de carpetas | `src/pages/CatalogoCategorias/` con componentes co-ubicados |
| Servicio API | Nuevo `categoriasService.js` |
| Manejo de imágenes | URL construida + placeholder |
| Layout | CSS Grid responsive |
| Navegación | React Router `useNavigate` |
| Estados UI | Loading, Error, Empty, Success |
| Ruta | `/catalogo-categorias` |
