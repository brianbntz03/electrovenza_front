# Tasks: Listado de Artículos por Categoría

**Input**: Design documents from `/specs/004-articulos-categoria/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: No se solicitaron tests explícitamente en la especificación.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Based on existing project structure in plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and service layer extension

- [x] T001 [P] Extend articulosService with getArticulosByCategoria() in src/service/articulosService.js
- [x] T002 [P] Extend articulosService with getArticulosActivosByCategoria() in src/service/articulosService.js
- [ ] T003 [P] Create placeholder image at public/placeholder-articulo.png
- [x] T004 Create page folder structure at src/pages/ArticulosCategoria/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core component structure that MUST be complete before user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create base page component structure in src/pages/ArticulosCategoria/ArticulosCategoria.js
- [x] T006 Create base CSS file in src/pages/ArticulosCategoria/ArticulosCategoria.css
- [x] T007 Create components folder at src/pages/ArticulosCategoria/components/
- [x] T008 Add route for /categoria/:categoriaId/articulos in src/Components/Content.js

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Visualizar Artículos de una Categoría (Priority: P1) 🎯 MVP

**Goal**: Como usuario del sistema, quiero ver todos los artículos disponibles de una categoría específica presentados en un formato visual de tarjetas.

**Independent Test**: Acceder a la página con un ID de categoría válido y verificar que se muestran las tarjetas de artículos con imagen, nombre, descripción, precio y stock.

### Implementation for User Story 1

- [x] T009 [US1] Implement useParams to get categoriaId in src/pages/ArticulosCategoria/ArticulosCategoria.js
- [x] T010 [US1] Implement fetch and state management in src/pages/ArticulosCategoria/ArticulosCategoria.js
- [x] T011 [P] [US1] Create ArticuloCard component in src/pages/ArticulosCategoria/components/ArticuloCard.js
- [x] T012 [P] [US1] Create ArticuloCard styles in src/pages/ArticulosCategoria/components/ArticuloCard.css
- [x] T013 [US1] Implement truncateDescription helper in src/pages/ArticulosCategoria/components/ArticuloCard.js
- [x] T014 [US1] Implement image URL construction with fallback in src/pages/ArticulosCategoria/components/ArticuloCard.js
- [x] T015 [US1] Implement loading state with spinner in src/pages/ArticulosCategoria/ArticulosCategoria.js
- [x] T016 [US1] Implement error state with retry button in src/pages/ArticulosCategoria/ArticulosCategoria.js
- [x] T017 [US1] Implement empty state message in src/pages/ArticulosCategoria/ArticulosCategoria.js
- [x] T018 [US1] Implement invalid category error handling in src/pages/ArticulosCategoria/ArticulosCategoria.js
- [x] T019 [US1] Render ArticuloCard grid in src/pages/ArticulosCategoria/ArticulosCategoria.js

**Checkpoint**: At this point, User Story 1 should be functional - users can view article cards with basic info

---

## Phase 4: User Story 2 - Ver Precio Según Rol de Usuario (Priority: P1) 🎯 MVP

**Goal**: Como usuario del sistema, quiero ver el precio que corresponde a mi tipo de usuario (minorista o mayorista).

**Independent Test**: Iniciar sesión con diferentes roles y verificar que el precio mostrado corresponde al tipo de usuario.

### Implementation for User Story 2

- [x] T020 [US2] Get user role from localStorage in src/pages/ArticulosCategoria/ArticulosCategoria.js
- [x] T021 [US2] Import isWholesaleSeller from constants/roles.js in src/pages/ArticulosCategoria/ArticulosCategoria.js
- [x] T022 [US2] Add showWholesalePrice prop to ArticuloCard in src/pages/ArticulosCategoria/ArticulosCategoria.js
- [x] T023 [US2] Implement getPrecioDisplay logic in src/pages/ArticulosCategoria/components/ArticuloCard.js
- [x] T024 [US2] Implement formatPrecio helper (locale es-AR) in src/pages/ArticulosCategoria/components/ArticuloCard.js
- [x] T025 [US2] Add precio-label for "Precio Mayorista" indicator in src/pages/ArticulosCategoria/components/ArticuloCard.js
- [x] T026 [US2] Style precio display in src/pages/ArticulosCategoria/components/ArticuloCard.css

**Checkpoint**: At this point, users see correct price based on their role (wholesale vs retail)

---

## Phase 5: User Story 3 - Identificar Disponibilidad de Stock (Priority: P2)

**Goal**: Como usuario, quiero ver claramente si un artículo tiene stock disponible.

**Independent Test**: Verificar que los artículos muestran un indicador visual de disponibilidad basado en su cantidad en stock.

### Implementation for User Story 3

- [x] T027 [US3] Implement getStockIndicator helper in src/pages/ArticulosCategoria/components/ArticuloCard.js
- [x] T028 [US3] Add stock badge HTML structure in src/pages/ArticulosCategoria/components/ArticuloCard.js
- [x] T029 [US3] Style stock-available badge (green) in src/pages/ArticulosCategoria/components/ArticuloCard.css
- [x] T030 [US3] Style stock-low badge (yellow/orange) in src/pages/ArticulosCategoria/components/ArticuloCard.css
- [x] T031 [US3] Style stock-none badge (red) in src/pages/ArticulosCategoria/components/ArticuloCard.css
- [x] T032 [US3] Position badge overlay on image in src/pages/ArticulosCategoria/components/ArticuloCard.css

**Checkpoint**: At this point, users can clearly see stock availability status

---

## Phase 6: User Story 4 - Visualización Responsive del Catálogo (Priority: P3)

**Goal**: Como usuario, quiero que las tarjetas de artículos se adapten a diferentes tamaños de pantalla.

**Independent Test**: Redimensionar la ventana o acceder desde diferentes dispositivos.

### Implementation for User Story 4

- [x] T033 [US4] Implement CSS Grid layout with auto-fill in src/pages/ArticulosCategoria/ArticulosCategoria.css
- [x] T034 [US4] Add media query for desktop (>1200px, 4 columns) in src/pages/ArticulosCategoria/ArticulosCategoria.css
- [x] T035 [US4] Add media query for tablet (768-1199px, 2-3 columns) in src/pages/ArticulosCategoria/ArticulosCategoria.css
- [x] T036 [US4] Add media query for mobile (<768px, 1 column) in src/pages/ArticulosCategoria/ArticulosCategoria.css
- [x] T037 [US4] Ensure card images scale properly in src/pages/ArticulosCategoria/components/ArticuloCard.css
- [x] T038 [US4] Ensure text truncation works on all sizes in src/pages/ArticulosCategoria/components/ArticuloCard.css

**Checkpoint**: At this point, the article catalog is fully responsive

---

## Phase 7: User Story 5 - Navegar de Vuelta a Categorías (Priority: P3)

**Goal**: Como usuario, quiero poder volver fácilmente a la lista de categorías.

**Independent Test**: Verificar la presencia de un enlace o botón para volver a categorías.

### Implementation for User Story 5

- [x] T039 [US5] Add useNavigate hook in src/pages/ArticulosCategoria/ArticulosCategoria.js
- [x] T040 [US5] Create handleBackClick function in src/pages/ArticulosCategoria/ArticulosCategoria.js
- [x] T041 [US5] Add "Volver a Categorías" button in header section in src/pages/ArticulosCategoria/ArticulosCategoria.js
- [x] T042 [US5] Style back button in src/pages/ArticulosCategoria/ArticulosCategoria.css
- [x] T043 [US5] Add back button to error and empty states in src/pages/ArticulosCategoria/ArticulosCategoria.js

**Checkpoint**: At this point, users can navigate back to categories from anywhere on the page

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T044 [P] Verify all edge cases work (empty category, invalid ID, long descriptions, missing images)
- [x] T045 [P] Add page title/header showing category name (if available)
- [x] T046 [P] Add hover effect on ArticuloCard for better UX in src/pages/ArticulosCategoria/components/ArticuloCard.css
- [ ] T047 Run quickstart.md validation checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Depends on US1 (needs ArticuloCard to exist)
- **User Story 3 (P2)**: Depends on US1 (needs ArticuloCard to exist)
- **User Story 4 (P3)**: Depends on US1 (needs content to make responsive)
- **User Story 5 (P3)**: Can start after Foundational - Independent

### Within Each User Story

- Helpers before component integration
- Core implementation before styling
- Logic before visual polish

### Parallel Opportunities

- T001, T002, T003 can run in parallel
- T011, T012 can run in parallel (component + styles)
- T029, T030, T031 can run in parallel (different CSS classes)
- T034, T035, T036 can run in parallel (different media queries)
- T044, T045, T046 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch service extension first:
Task: T001 "Extend articulosService with getArticulosByCategoria()"
Task: T002 "Extend articulosService with getArticulosActivosByCategoria()"

# Then launch component tasks in parallel:
Task: T011 "Create ArticuloCard component"
Task: T012 "Create ArticuloCard styles"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (basic display)
4. Complete Phase 4: User Story 2 (correct pricing)
5. **STOP and VALIDATE**: Test that articles display with correct prices
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test viewing articles → Deploy/Demo (basic)
3. Add User Story 2 → Test role-based pricing → Deploy/Demo (MVP!)
4. Add User Story 3 → Test stock indicators → Deploy/Demo
5. Add User Story 4 → Test responsive → Deploy/Demo
6. Add User Story 5 → Test navigation → Deploy/Demo (Complete)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Feature 003 (catalogo-categorias) provides the navigation source for this page
- Precio display follows Constitution Principle II (Dual Pricing Architecture)
