# Implementation Plan: Gestión de Tipo de Vendedor

**Branch**: `002-gestion-tipo-vendedor` | **Date**: 2025-12-30 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-gestion-tipo-vendedor/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature enables administrators to manage seller types (vendedor_minorista or vendedor_mayorista) for all users in the system. The primary requirements are:

1. **Edit seller type** for existing sellers via `/gestion/vendedores/` (Priority P1)
2. **Select seller type** when creating new sellers via `/gestion/crearvendedores` (Priority P2)
3. **Display seller type** in the seller list table (Priority P3)

**Technical Approach**: Extend existing seller management components (PageListadoVendedores.js, CrearVendedor.js) to support role field selection. Reuse existing ROLES constants from feature 001-vendedor-mayorista. Backend changes are minimal (API already supports role field). Sellers must re-login after role changes for the new menu to take effect. Default role for new/existing sellers is "vendedor_minorista".

## Technical Context

**Language/Version**: JavaScript ES6+ / React 19.1.0
**Primary Dependencies**: React Router DOM 7.0.2, SweetAlert2 11.6.13, FontAwesome 7.0.1, jwt-decode 4.0.0, date-fns 4.1.0
**Storage**: Backend API (external, not managed by this frontend)
**Testing**: React Testing Library (via react-scripts from Create React App)
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge - modern versions)
**Project Type**: Single-page web application (SPA)
**Performance Goals**: Instant UI updates (<100ms), smooth form interactions
**Constraints**: Must work with existing backend API, must not break role-based access control from feature 001
**Scale/Scope**: Small business application (~10-50 sellers, administrator manages all sellers)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with [../../.specify/memory/constitution.md](../../.specify/memory/constitution.md):

- [x] **Role-Based Authorization**: ✅ YES - This feature is CORE to role-based authorization. It allows administrators to assign roles (vendedor_minorista or vendedor_mayorista) to sellers, which directly enables the three-role hierarchy. Only administrators can access seller management pages.
- [x] **Dual Pricing**: ✅ N/A - This feature doesn't handle pricing directly, but it enables sellers to be assigned the correct role so they see the correct prices (retail vs wholesale) when they log in.
- [x] **Client Portfolio Isolation**: ✅ N/A - This feature doesn't manage customer portfolios, but it assigns the seller type that determines which portfolio they access (retail or wholesale customers).
- [x] **Credit vs Cash Flow**: ✅ N/A - This feature doesn't handle transactions, but it assigns the seller type that determines credit capabilities (only vendedor_minorista can grant credit).
- [x] **Stock Integrity**: ✅ N/A - This feature doesn't interact with inventory management.
- [x] **Testing**: ✅ YES - The quickstart.md includes comprehensive manual testing checklist. Role-based access controls must be verified (only administrators can edit seller types). Edge cases include verifying seller menu updates after role change and re-login.
- [x] **Simplicity**: ✅ YES - Simplest possible approach: reuse existing components (PageListadoVendedores, CrearVendedor), reuse existing ROLES constants, add dropdown fields to existing forms. No new abstractions, no new routes, no new services. Extend, don't rebuild.

## Project Structure

### Documentation (this feature)

```text
specs/002-gestion-tipo-vendedor/
├── plan.md                        # This file (/speckit.plan command output)
├── spec.md                        # Feature specification
├── research.md                    # Phase 0 output - technical unknowns resolved
├── data-model.md                  # Phase 1 output - User/Vendedor entity extension
├── quickstart.md                  # Phase 1 output - developer implementation guide
├── contracts/
│   └── api-sellers.yaml          # Phase 1 output - OpenAPI 3.0.3 API contract
├── checklists/
│   └── requirements.md           # Quality checklist
└── tasks.md                       # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── Components/
│   ├── Aside.js                           # Main navigation menu (already has role-based rendering)
│   ├── Content.js                         # Route definitions (already has role guards)
│   ├── Crear/
│   │   └── CrearVendedor.js              # 🔧 MODIFY - Add role dropdown to create seller form
│   └── [other components...]
├── constants/
│   └── roles.js                           # ✅ EXISTS - Role constants (from feature 001)
├── pages/
│   ├── PageListadoVendedores.js          # 🔧 MODIFY - Add "Tipo" column to seller list table
│   └── [other pages...]
├── service/
│   └── [API service files...]
├── utils/
│   └── roleGuards.js                      # ✅ EXISTS - RequireRole HOC (from feature 001)
└── [other directories...]

tests/
└── [test files if created]
```

**Structure Decision**: Single-page web application structure. This feature modifies only 2 existing files:
- `src/pages/PageListadoVendedores.js` - Add seller type column to table
- `src/Components/Crear/CrearVendedor.js` - Add seller type dropdown to form

No new files are created. Reuses existing constants from feature 001 (`src/constants/roles.js`).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. This feature passes all constitutional checks and adheres to the simplicity principle.
