# Tasks: Gestión de Tipo de Vendedor

**Input**: Design documents from `/specs/002-gestion-tipo-vendedor/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: This feature uses manual testing as specified in quickstart.md. No automated test tasks are included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root
- This is a React SPA - all code in `src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify prerequisites are in place before feature implementation

- [ ] T001 Verify feature branch 002-gestion-tipo-vendedor is checked out
- [ ] T002 Verify src/constants/roles.js exists with ROLES constants from feature 001-vendedor-mayorista
- [ ] T003 Verify backend API supports role field in User/Seller model (GET/POST/PUT /users endpoints)

**Checkpoint**: Prerequisites verified - ready to proceed with user stories

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: This feature has NO foundational phase - all work is in user stories

All necessary infrastructure already exists from feature 001-vendedor-mayorista:
- ✅ ROLES constants in src/constants/roles.js
- ✅ Role-based authentication and menu system
- ✅ Existing seller management pages (PageListadoVendedores.js, CrearVendedor.js)

**Checkpoint**: Foundation already complete - user story implementation can begin immediately

---

## Phase 3: User Story 3 - Visualizar Tipo de Vendedor en Listado (Priority: P3) 🎯 MVP

**Goal**: Add "Tipo" column to seller list table to display seller type (Minorista/Mayorista)

**Why this is MVP**: This is the simplest story (view-only, no form changes) and provides immediate value by letting admins see seller types at a glance. Implementing this first validates the integration works before adding edit functionality.

**Independent Test**: Navigate to `/gestion/vendedores/`, verify the table includes a "Tipo" column showing "Vendedor Minorista" or "Vendedor Mayorista" for each seller with appropriate badge styling.

### Implementation for User Story 3

- [ ] T004 [US3] Read existing PageListadoVendedores.js to understand current table structure in src/pages/PageListadoVendedores.js
- [ ] T005 [US3] Add "Tipo" column header to seller list table in src/pages/PageListadoVendedores.js
- [ ] T006 [US3] Add seller type display cell with badge styling (badge-info for mayorista, badge-success for minorista) in src/pages/PageListadoVendedores.js
- [ ] T007 [US3] Verify role field is included in API response when fetching sellers list in src/pages/PageListadoVendedores.js

**Checkpoint**: At this point, User Story 3 should display seller types correctly in the list view

---

## Phase 4: User Story 1 - Editar Tipo de Vendedor Existente (Priority: P1)

**Goal**: Allow administrators to edit seller type via edit form with confirmation dialog

**Why next**: This is the highest priority (P1) because it enables admins to update existing sellers from minorista to mayorista, unlocking the wholesale functionality from feature 001.

**Independent Test**: Navigate to `/gestion/vendedores/`, click "Editar" for a seller, change seller type from "Vendedor Minorista" to "Vendedor Mayorista", save with confirmation, verify change persists in list, confirm seller sees mayorista menu after re-login.

### Implementation for User Story 1

- [ ] T008 [US1] Read existing seller edit component to identify edit form structure (may be in PageListadoVendedores.js or separate component)
- [ ] T009 [US1] Import ROLES constants from src/constants/roles.js in the edit component
- [ ] T010 [US1] Add state management for role field in edit form component
- [ ] T011 [US1] Add "Tipo de Vendedor" dropdown field to edit form with options for Vendedor Minorista and Vendedor Mayorista
- [ ] T012 [US1] Add helper text below dropdown: "El vendedor deberá cerrar sesión y volver a iniciar para que el cambio surta efecto"
- [ ] T013 [US1] Implement confirmation dialog using SweetAlert2 before saving role changes showing old and new seller type
- [ ] T014 [US1] Update PUT request to include role field in request body when saving seller changes
- [ ] T015 [US1] Verify success message displays after successful seller type update

**Checkpoint**: At this point, User Story 1 should allow editing seller type with confirmation dialog

---

## Phase 5: User Story 2 - Crear Vendedor con Tipo Específico (Priority: P2)

**Goal**: Allow administrators to select seller type when creating new seller with default value "Vendedor Minorista"

**Why last**: This is P2 priority because the same result can be achieved by creating the seller and then editing their type (US1). However, it significantly improves efficiency for admin workflows.

**Independent Test**: Navigate to `/gestion/crearvendedores`, fill form selecting "Vendedor Mayorista" as type, create seller, verify seller appears in list with correct type, confirm new seller sees mayorista menu when they log in.

### Implementation for User Story 2

- [ ] T016 [US2] Read existing CrearVendedor component in src/Components/Crear/CrearVendedor.js to understand current form structure
- [ ] T017 [US2] Import ROLES constants from src/constants/roles.js in src/Components/Crear/CrearVendedor.js
- [ ] T018 [US2] Add role field to form state with default value "vendedor_minorista" in src/Components/Crear/CrearVendedor.js
- [ ] T019 [US2] Add "Tipo de Vendedor" dropdown field to create form with options for Vendedor Minorista (default) and Vendedor Mayorista in src/Components/Crear/CrearVendedor.js
- [ ] T020 [US2] Add helper text below dropdown: "Seleccione el tipo de vendedor. Por defecto: Vendedor Minorista" in src/Components/Crear/CrearVendedor.js
- [ ] T021 [US2] Update POST request to include role field in request body when creating seller in src/Components/Crear/CrearVendedor.js
- [ ] T022 [US2] Update success message to include seller type in confirmation (e.g., "Se creó el vendedor como Vendedor Mayorista") in src/Components/Crear/CrearVendedor.js

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validation, testing, and final verification

- [ ] T023 [P] Run manual testing checklist from specs/002-gestion-tipo-vendedor/quickstart.md
- [ ] T024 [P] Verify all three user stories work correctly with real backend API
- [ ] T025 Test edge case: Create seller without selecting type defaults to "Vendedor Minorista"
- [ ] T026 Test edge case: Change seller type back and forth multiple times works without errors
- [ ] T027 Test edge case: Verify only administrators can access seller management pages
- [ ] T028 Test role change impact: Verify seller menu updates after role change and re-login
- [ ] T029 [P] Run npm run build to ensure no new build errors or warnings introduced
- [ ] T030 Update CLAUDE.md if needed with feature documentation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: No foundational phase - all infrastructure exists from feature 001
- **User Stories (Phase 3-5)**: Can proceed in any order, but recommended order is US3 → US1 → US2
  - US3 (P3) recommended FIRST for MVP - simplest implementation, validates integration
  - US1 (P1) second - highest priority functionality
  - US2 (P2) last - nice-to-have efficiency improvement
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 3 (P3)**: Can start after Setup - No dependencies - VIEW ONLY - Recommended MVP
- **User Story 1 (P1)**: Can start after Setup - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Setup - No dependencies on other stories

**All user stories are independently testable and can be implemented in parallel by different developers**

### Within Each User Story

- Read existing code before modifying
- Component changes before API integration
- Validation and error handling after core implementation
- Manual testing after implementation complete

### Parallel Opportunities

**Phase 1 (Setup)**: All verification tasks T001-T003 can run in parallel

**User Stories**: Once Setup completes, all three user stories can be implemented in parallel:
- Developer A: User Story 3 (T004-T007)
- Developer B: User Story 1 (T008-T015)
- Developer C: User Story 2 (T016-T022)

**Phase 6 (Polish)**: Tasks T023, T024, T029, T030 can run in parallel

---

## Parallel Example: All User Stories

```bash
# After Phase 1 Setup completes, launch all user stories in parallel:

# User Story 3 (simplest, recommended MVP):
Task: "Add Tipo column to seller list table in src/pages/PageListadoVendedores.js"

# User Story 1 (highest priority):
Task: "Add role dropdown to edit form with confirmation dialog"

# User Story 2 (efficiency improvement):
Task: "Add role dropdown to create form in src/Components/Crear/CrearVendedor.js"
```

---

## Implementation Strategy

### MVP First (User Story 3 Only) - RECOMMENDED

1. Complete Phase 1: Setup (verify prerequisites)
2. Complete Phase 3: User Story 3 (display seller type in list)
3. **STOP and VALIDATE**: Navigate to /gestion/vendedores/ and verify "Tipo" column displays correctly
4. Deploy/demo if ready - admins can now SEE seller types

**Rationale**: US3 is the simplest (view-only) and provides immediate value with minimal risk. Validates that role field integration works correctly before adding edit functionality.

### Incremental Delivery (Recommended Order)

1. Complete Setup (Phase 1) → Prerequisites verified
2. Add User Story 3 (Phase 3) → Test independently → Deploy/Demo (MVP! Admins can see types)
3. Add User Story 1 (Phase 4) → Test independently → Deploy/Demo (Admins can edit types)
4. Add User Story 2 (Phase 5) → Test independently → Deploy/Demo (Admins can set type at creation)
5. Complete Polish (Phase 6) → Final validation → Production ready

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup together (5 minutes)
2. Once Setup is done, work in parallel:
   - Developer A: User Story 3 (T004-T007) - Estimated 30 minutes
   - Developer B: User Story 1 (T008-T015) - Estimated 2 hours
   - Developer C: User Story 2 (T016-T022) - Estimated 1.5 hours
3. Stories complete and integrate independently (no conflicts - different code sections)
4. Team completes Polish together (T023-T030)

**Total time with 3 developers**: ~3 hours (vs ~4 hours sequential)

---

## Notes

- [P] tasks = different files or independent verification tasks, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- This feature modifies ONLY 2 files: src/pages/PageListadoVendedores.js and src/Components/Crear/CrearVendedor.js
- No new files created - reuses existing ROLES constants from feature 001
- Manual testing checklist in quickstart.md must be completed before considering feature done
- Commit after each user story phase for clean rollback points
- Verify each user story independently before moving to next
- Avoid: adding new abstractions, creating unnecessary utility functions, over-engineering the solution

---

## File Modification Summary

**Files to MODIFY** (2 total):
1. `src/pages/PageListadoVendedores.js` - Add "Tipo" column (US3), add role dropdown to edit form (US1)
2. `src/Components/Crear/CrearVendedor.js` - Add role dropdown to create form (US2)

**Files to READ** (for context):
1. `src/constants/roles.js` - Import ROLES constants (already exists from feature 001)

**Files created**: NONE - This feature only extends existing components

**Backend changes**: NONE in frontend - Backend API already supports role field from feature 001
