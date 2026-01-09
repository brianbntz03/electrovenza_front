# Implementation Plan: Listado de Artículos por Categoría

**Branch**: `catalogo_mayorista` (feature 004-articulos-categoria) | **Date**: 2026-01-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-articulos-categoria/spec.md`

## Summary

Implementar una página que muestre los artículos de una categoría específica en formato de tarjetas estilo e-commerce. El ID de categoría se recibe desde la URL. Cada tarjeta muestra imagen, nombre, descripción truncada, precio según rol del usuario, e indicador de stock. La página usa el endpoint `/articulos/by-category-id/{categoryId}`.

## Technical Context

**Language/Version**: JavaScript ES6+ (React 19.1.0)
**Primary Dependencies**: React Router DOM 7.0.2, FontAwesome 7.0.1
**Storage**: N/A (datos desde API REST)
**Testing**: React Testing Library (via react-scripts)
**Target Platform**: Web (navegadores modernos, responsive 320px-1920px)
**Project Type**: Web application (frontend React)
**Performance Goals**: Carga de artículos < 3 segundos
**Constraints**: Solo usuarios autenticados, solo artículos activos, precio según rol
**Scale/Scope**: ~10-100 artículos por categoría

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with [.specify/memory/constitution.md]:

- [x] **Role-Based Authorization**: Todos los roles pueden ver el catálogo. El precio mostrado varía según rol (mayorista vs minorista).
- [x] **Dual Pricing**: ✓ CUMPLE - Se muestra `precio_mayorista` para vendedor mayorista, `precio` para otros roles.
- [x] **Client Portfolio Isolation**: No aplica - no involucra clientes.
- [x] **Credit vs Cash Flow**: No aplica - no involucra transacciones.
- [x] **Stock Integrity**: ✓ CUMPLE - Se muestra indicador de disponibilidad basado en stock.
- [x] **Testing**: Se incluirán tests para el componente, manejo de rol, y estados de UI.
- [x] **Simplicity**: Solución simple: componente de página + componente de tarjeta reutilizable.

## Project Structure

### Documentation (this feature)

```text
specs/004-articulos-categoria/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── pages/
│   └── ArticulosCategoria/
│       ├── ArticulosCategoria.js      # Página principal
│       └── components/
│           └── ArticuloCard.js        # Componente de tarjeta de artículo
├── service/
│   └── articulosService.js            # Agregar función para obtener por categoría
└── Components/
    └── Content.js                      # Agregar ruta nueva
```

**Structure Decision**: Seguir el patrón de `/pages/CatalogoCategorias/` con componentes co-ubicados. Extender `articulosService.js` existente.

## Complexity Tracking

> No hay violaciones de Constitution. La implementación sigue principios establecidos.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
