# Implementation Plan: Catálogo de Categorías de Electrodomésticos

**Branch**: `catalogo_mayorista` (feature 003-catalogo-categorias) | **Date**: 2026-01-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-catalogo-categorias/spec.md`

## Summary

Implementar una página de catálogo que muestre las categorías de electrodomésticos como bloques visuales con imagen, nombre y descripción. Cada bloque es clickeable y navega a la página de artículos de esa categoría. La página usa el endpoint existente `/categoria` y sigue los patrones de componentes establecidos en el proyecto.

## Technical Context

**Language/Version**: JavaScript ES6+ (React 19.1.0)
**Primary Dependencies**: React Router DOM 7.0.2, FontAwesome 7.0.1
**Storage**: N/A (datos desde API REST)
**Testing**: React Testing Library (via react-scripts)
**Target Platform**: Web (navegadores modernos, responsive 320px-1920px)
**Project Type**: Web application (frontend React)
**Performance Goals**: Carga de categorías < 2 segundos
**Constraints**: Solo usuarios autenticados, solo categorías activas
**Scale/Scope**: ~10-50 categorías esperadas

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with [.specify/memory/constitution.md]:

- [x] **Role-Based Authorization**: Esta feature es accesible a todos los roles autenticados (lectura de catálogo). No hay restricción de rol específica.
- [x] **Dual Pricing**: No aplica - esta página solo muestra categorías, no precios.
- [x] **Client Portfolio Isolation**: No aplica - no involucra clientes.
- [x] **Credit vs Cash Flow**: No aplica - no involucra transacciones.
- [x] **Stock Integrity**: No aplica - no modifica inventario.
- [x] **Testing**: Se incluirán tests para el componente y sus estados (carga, error, vacío).
- [x] **Simplicity**: Solución simple: un componente de página + un componente de tarjeta reutilizable.

## Project Structure

### Documentation (this feature)

```text
specs/003-catalogo-categorias/
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
│   └── CatalogoCategorias/
│       ├── CatalogoCategorias.js      # Página principal
│       └── components/
│           └── CategoryCard.js         # Componente de tarjeta de categoría
├── service/
│   └── categoriasService.js           # Servicio para API de categorías (nuevo)
└── Components/
    └── Content.js                      # Agregar ruta nueva
```

**Structure Decision**: Seguir el patrón existente de `/pages/VentaMayorista/` con componentes co-ubicados. Crear servicio dedicado similar a `articulosService.js`.

## Complexity Tracking

> No hay violaciones de Constitution. La implementación es directa.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
