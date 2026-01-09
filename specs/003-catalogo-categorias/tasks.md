# Tasks: Catálogo de Categorías de Electrodomésticos

**Input**: Design documents from `/specs/003-catalogo-categorias/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: No se solicitaron tests explícitamente en la especificación.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Based on existing project structure in plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and service layer

- [x] T001 [P] Create category service in src/service/categoriasService.js
- [ ] T002 [P] Create placeholder image at public/placeholder-categoria.png
- [x] T003 Create page folder structure at src/pages/CatalogoCategorias/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core component structure that MUST be complete before user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create base page component structure in src/pages/CatalogoCategorias/CatalogoCategorias.js
- [x] T005 Create base CSS file in src/pages/CatalogoCategorias/CatalogoCategorias.css
- [x] T006 Create components folder at src/pages/CatalogoCategorias/components/

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Explorar Categorías Disponibles (Priority: P1) 🎯 MVP

**Goal**: Como usuario del sistema, quiero ver todas las categorías de electrodomésticos disponibles presentadas de forma visual y atractiva con imagen, nombre y descripción.

**Independent Test**: Acceder a la página de categorías y verificar que se muestran todos los bloques con imagen, nombre y descripción de cada categoría activa.

### Implementation for User Story 1

- [x] T007 [US1] Implement getCategorias() function in src/service/categoriasService.js
- [x] T008 [US1] Implement getCategoriasActivas() function in src/service/categoriasService.js
- [x] T009 [P] [US1] Create CategoryCard component in src/pages/CatalogoCategorias/components/CategoryCard.js
- [x] T010 [P] [US1] Create CategoryCard styles in src/pages/CatalogoCategorias/components/CategoryCard.css
- [x] T011 [US1] Implement fetch and render logic in src/pages/CatalogoCategorias/CatalogoCategorias.js
- [x] T012 [US1] Implement loading state with spinner in src/pages/CatalogoCategorias/CatalogoCategorias.js
- [x] T013 [US1] Implement error state with retry button in src/pages/CatalogoCategorias/CatalogoCategorias.js
- [x] T014 [US1] Implement empty state message in src/pages/CatalogoCategorias/CatalogoCategorias.js
- [x] T015 [US1] Implement image URL construction with fallback to placeholder in src/pages/CatalogoCategorias/components/CategoryCard.js
- [x] T016 [US1] Add route for /catalogo-categorias in src/Components/Content.js

**Checkpoint**: At this point, User Story 1 should be fully functional - users can view all active categories with images

---

## Phase 4: User Story 2 - Navegar a Artículos de una Categoría (Priority: P2)

**Goal**: Como usuario, quiero poder hacer clic en una categoría para ver los artículos que pertenecen a ella.

**Independent Test**: Hacer clic en cualquier bloque de categoría y verificar que el sistema navega a la página correspondiente.

### Implementation for User Story 2

- [x] T017 [US2] Add useNavigate hook and navigation handler in src/pages/CatalogoCategorias/CatalogoCategorias.js
- [x] T018 [US2] Add onClick prop to CategoryCard in src/pages/CatalogoCategorias/components/CategoryCard.js
- [x] T019 [US2] Add hover styles for clickable cards in src/pages/CatalogoCategorias/components/CategoryCard.css
- [x] T020 [US2] Add cursor:pointer and visual feedback on hover in src/pages/CatalogoCategorias/components/CategoryCard.css

**Checkpoint**: At this point, users can click any category and navigate (destination page is feature 004)

---

## Phase 5: User Story 3 - Visualización Responsive de Categorías (Priority: P3)

**Goal**: Como usuario, quiero que la colección de bloques de categorías se adapte correctamente a diferentes tamaños de pantalla.

**Independent Test**: Redimensionar la ventana del navegador y verificar que los bloques se reorganizan apropiadamente.

### Implementation for User Story 3

- [x] T021 [US3] Implement CSS Grid layout with auto-fill in src/pages/CatalogoCategorias/CatalogoCategorias.css
- [x] T022 [US3] Add media queries for tablet (768-991px) in src/pages/CatalogoCategorias/CatalogoCategorias.css
- [x] T023 [US3] Add media queries for mobile (<768px) in src/pages/CatalogoCategorias/CatalogoCategorias.css
- [x] T024 [US3] Ensure card images scale properly on different screen sizes in src/pages/CatalogoCategorias/components/CategoryCard.css
- [x] T025 [US3] Ensure description truncation works on all screen sizes in src/pages/CatalogoCategorias/components/CategoryCard.css

**Checkpoint**: At this point, the category catalog is fully responsive across all devices

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T026 [P] Verify all edge cases work (no categories, long descriptions, missing images)
- [x] T027 [P] Add page title/header to CatalogoCategorias component
- [ ] T028 Run quickstart.md validation checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P2)**: Can start after US1 (needs cards to exist for navigation)
- **User Story 3 (P3)**: Can start after US1 (needs content to make responsive)

### Within Each User Story

- Service functions before components
- Components before page integration
- Core implementation before polish

### Parallel Opportunities

- T001, T002 can run in parallel
- T009, T010 can run in parallel (different files)
- T026, T027 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch service implementation first:
Task: T007 "Implement getCategorias() function in src/service/categoriasService.js"
Task: T008 "Implement getCategoriasActivas() function in src/service/categoriasService.js"

# Then launch component tasks in parallel:
Task: T009 "Create CategoryCard component"
Task: T010 "Create CategoryCard styles"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test that categories display correctly
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test viewing categories → Deploy/Demo (MVP!)
3. Add User Story 2 → Test navigation → Deploy/Demo
4. Add User Story 3 → Test responsive → Deploy/Demo

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Feature 004 (articulos-categoria) provides the navigation destination for US2
