# Implementation Plan: Vendedor Mayorista Role

**Branch**: `001-vendedor-mayorista` | **Date**: 2025-12-29 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-vendedor-mayorista/spec.md`

## Summary

This plan implements a new "Vendedor Mayorista" (wholesale seller) role in the ElectroVenza system. The feature enables wholesale sellers to make cash-only sales at wholesale pricing to their own portfolio of wholesale customers. The implementation reuses existing retail sales components with modifications to remove credit/installment functionality and enforce wholesale pricing. Key deliverables include role-based menu rendering, a new `/venta-mayorista` route, wholesale customer management, and backend integration for wholesale-specific transactions.

**Technical Approach**: Extend existing React components (Aside menu, Content router) with role-based conditional rendering. Create new wholesale sales page by adapting existing `PagePresupuestar` component to use wholesale pricing and remove credit features. Leverage existing JWT authentication to add wholesale seller role support. Reuse customer management components with filtering by customer type and seller assignment.

## Technical Context

**Language/Version**: JavaScript ES6+ (React 19.1.0)
**Primary Dependencies**: React 19.1.0, React Router DOM 7.0.2, jwt-decode 4.0.0, SweetAlert2 11.6.13, FontAwesome 7.0.1, date-fns 4.1.0
**Storage**: Backend REST API (assumed PostgreSQL or similar on backend)
**Testing**: React Testing Library (via react-scripts 5.0.1), Jest
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari - as per browserslist in package.json)
**Project Type**: Web application (frontend only - SPA with Create React App)
**Performance Goals**: Page load < 2s, role-based menu rendering < 100ms, sales transaction completion < 3 minutes
**Constraints**: Frontend-only changes (backend endpoints assumed to exist or be created separately), must maintain backward compatibility with existing retail seller and admin functionality
**Scale/Scope**: ~5-10 new/modified React components, 3 new routes, role-based access control across ~15 existing menu items

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with [.specify/memory/constitution.md]:

- [x] **Role-Based Authorization**: YES - This feature implements the third role (Vendedor Mayorista) in the three-role hierarchy with appropriate permissions
- [x] **Dual Pricing**: YES - Feature enforces wholesale pricing (precio_mayorista) for all wholesale sales, distinct from retail pricing
- [x] **Client Portfolio Isolation**: YES - Each wholesale seller manages only their own wholesale customer portfolio
- [x] **Credit vs Cash Flow**: YES - Wholesale sales are strictly cash-only (no credit capability)
- [x] **Stock Integrity**: YES - Wholesale sales decrement stock same as retail sales, with validation before completion
- [x] **Testing**: YES - Plan includes integration tests for role-based access and wholesale pricing enforcement
- [x] **Simplicity**: YES - Reuses existing components (menu system, sales flow, customer management) with minimal modifications

**Constitution Check Result**: ✅ PASS - All constitutional principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/001-vendedor-mayorista/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification (completed)
├── research.md          # Phase 0 output (this command)
├── data-model.md        # Phase 1 output (this command)
├── quickstart.md        # Phase 1 output (this command)
├── contracts/           # Phase 1 output (this command)
│   ├── api-auth.yaml    # Authentication endpoints
│   ├── api-sales.yaml   # Wholesale sales endpoints
│   └── api-customers.yaml # Customer management endpoints
├── checklists/
│   └── requirements.md  # Quality checklist (completed)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

This is a web application frontend built with Create React App:

```text
src/
├── Components/
│   ├── Aside.js                          # [MODIFY] Add wholesale seller menu rendering
│   ├── Content.js                        # [MODIFY] Add wholesale sales route
│   ├── tablasListado/
│   │   └── listadoClientes.js            # [MODIFY] Add customer type filtering
│   └── tiny/
│       └── FlashMessage.js               # [REUSE] For user feedback
├── pages/
│   └── VentaMayorista/                   # [NEW] Wholesale sales pages
│       ├── VentaMayorista.js             # Main wholesale sales page
│       └── components/                   # Supporting components
│           ├── ProductSelector.js        # Product selection with wholesale pricing
│           ├── CustomerSelector.js       # Wholesale customer selection
│           └── SalesSummary.js           # Sale total and completion
├── service/
│   ├── authService.js                    # [MODIFY] Add wholesale role handling
│   ├── ventasService.js                  # [MODIFY] Add wholesale sales endpoints
│   └── clientesService.js                # [MODIFY] Add wholesale customer endpoints
├── constants/
│   └── roles.js                          # [NEW] Role constants
└── utils/
    └── roleGuards.js                     # [NEW] Role-based route protection

tests/
├── integration/
│   ├── wholesaleSalesFlow.test.js        # [NEW] End-to-end wholesale sale flow
│   ├── roleBasedAccess.test.js           # [NEW] Role-based menu and route tests
│   └── customerPortfolioIsolation.test.js # [NEW] Customer isolation tests
└── unit/
    ├── components/
    │   └── Aside.test.js                 # [MODIFY] Add wholesale menu tests
    └── utils/
        └── roleGuards.test.js            # [NEW] Role guard utility tests
```

**Structure Decision**: This is a **web application frontend** using the existing Create React App structure. All source code resides in `src/` with components organized by feature. New wholesale-specific components go in `src/pages/VentaMayorista/`. Modifications to existing components (Aside, Content) add conditional rendering based on user role. The structure maintains separation of concerns with services for API integration, utilities for shared logic, and components for UI.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations** - Constitution Check passed all criteria. No complexity tracking needed.

---

## Phase 0: Research & Technology Decisions

See [research.md](research.md) for detailed research findings.

### Key Decisions

1. **Component Reuse Strategy**: Adapt existing `PagePresupuestar` (retail sales) component by creating a new `VentaMayorista` component that reuses product selection logic but removes credit/installment UI
2. **Role Storage**: Leverage existing localStorage-based role storage (`user_role`) used in Aside.js
3. **Routing Protection**: Implement route guards using React Router's `Navigate` component with role checks
4. **Price Display**: Pass `priceField="precio_mayorista"` prop to reused product display components
5. **Customer Type**: Add `tipo_cliente` field (values: "minorista", "mayorista") and `vendedor_id` to customer data model

---

## Phase 1: Design Artifacts

### Data Model

See [data-model.md](data-model.md) for complete entity definitions and relationships.

**Key Entities**:
- User extension with `role` field (values: "administrador", "vendedor_minorista", "vendedor_mayorista")
- Customer extension with `tipo_cliente` and `vendedor_asignado_id`
- Sale entity with `tipo_venta` field (values: "minorista_contado", "minorista_credito", "mayorista")

### API Contracts

See [contracts/](contracts/) directory for complete OpenAPI specifications.

**Key Endpoints**:
- `GET /articulos` - Returns products (filter by wholesale price availability for wholesale sellers)
- `GET /clientes?tipo=mayorista&vendedor_id={id}` - Returns wholesale customers for specific seller
- `POST /ventas-mayorista` - Creates new wholesale sale
- `POST /clientes` - Creates new customer (with tipo_cliente and vendedor_asignado_id)

### Development Guide

See [quickstart.md](quickstart.md) for developer setup and workflow.

---

## Implementation Phases Overview

Implementation will proceed in priority order following the user stories:

**Phase 2**: Foundation & Infrastructure (User Story 3 - P1)
- Role constants and utilities
- Menu system modifications for wholesale seller role
- Route guards and protection
- Placeholder for Cuenta Corriente

**Phase 3**: Wholesale Sales (User Story 1 - P1)
- Wholesale sales page components
- Product selection with wholesale pricing
- Sales transaction completion
- Stock validation

**Phase 4**: Customer Management (User Story 2 - P2)
- Customer type filtering
- Wholesale customer CRUD operations
- Customer-seller assignment
- Portfolio isolation

**Phase 5**: Testing & Polish
- Integration tests for critical flows
- Role-based access tests
- Edge case handling
- Documentation updates

---

## Next Steps

This plan is now complete. To proceed with implementation:

1. Run `/speckit.tasks` to generate detailed task breakdown
2. Review generated `tasks.md` for implementation order
3. Begin implementation starting with Phase 2 (Foundation & Infrastructure)
4. Follow constitution compliance throughout development
5. Write tests for each user story as implemented

**Dependencies**:
- Backend must provide or extend endpoints: `/articulos`, `/clientes`, `/ventas-mayorista`
- Backend must support `precio_mayorista` field on products
- Backend must support `tipo_cliente` and `vendedor_asignado_id` fields on customers
- Backend must support `role` field with value "vendedor_mayorista" on users
