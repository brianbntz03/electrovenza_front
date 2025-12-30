---

description: "Task list for Vendedor Mayorista role implementation"
---

# Tasks: Vendedor Mayorista Role

**Input**: Design documents from `/specs/001-vendedor-mayorista/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are NOT explicitly requested in the feature specification, so test tasks are OPTIONAL and marked for manual testing only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app frontend**: `src/`, `tests/` at repository root
- This is a React SPA built with Create React App
- Paths shown below use actual project structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Verify backend endpoints are available or documented for integration
- [ ] T002 Verify package.json has all required dependencies (React 19.1.0, React Router DOM 7.0.2, jwt-decode, SweetAlert2, FontAwesome, date-fns)
- [ ] T003 [P] Create src/constants/ directory if it doesn't exist
- [ ] T004 [P] Create src/utils/ directory if it doesn't exist
- [ ] T005 [P] Create src/pages/VentaMayorista/ directory structure

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Create role constants file in src/constants/roles.js with ROLES object and helper functions (hasRole, isWholesaleSeller, isRetailSeller, isAdmin)
- [ ] T007 Create route guard component in src/utils/roleGuards.js with RequireRole HOC for protecting routes based on user role
- [ ] T008 Create unauthorized page component in src/pages/UnauthorizedPage.js to display when user lacks permissions
- [ ] T009 Add route for unauthorized page in src/Components/Content.js at path="/unauthorized"

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 3 - Role-Based Menu Access (Priority: P1) 🎯 MVP Foundation

**Goal**: Wholesale sellers can log in and see a customized menu with wholesale-specific options (Ventas Mayorista, Clientes, Cuenta Corriente)

**Independent Test**: Create a test user with role="vendedor_mayorista" in backend, login with those credentials, verify menu shows only 3 items (Ventas Mayorista, Clientes, Cuenta Corriente), verify retail/admin options are hidden

### Implementation for User Story 3

- [ ] T010 [P] [US3] Create placeholder page for Cuenta Corriente in src/pages/CuentaCorrienteMayorista.js with "Coming soon" message
- [ ] T011 [US3] Modify src/Components/Aside.js to add renderVendedorMayoristaMenu() function with 3 menu items (Ventas Mayorista, Clientes, Cuenta Corriente)
- [ ] T012 [US3] Update main render in src/Components/Aside.js to conditionally show wholesale menu when userRole === "vendedor_mayorista"
- [ ] T013 [US3] Add route for /cuenta-corriente-mayorista in src/Components/Content.js wrapped with RequireRole guard
- [ ] T014 [US3] Manually test: Set localStorage user_role to "vendedor_mayorista" and verify menu renders correctly
- [ ] T015 [US3] Manually test: Verify wholesale seller cannot access /buscar-articulos-presupuesto (should redirect to unauthorized)
- [ ] T016 [US3] Manually test: Verify retail seller cannot access /venta-mayorista (should redirect to unauthorized)

**Checkpoint**: At this point, User Story 3 should be fully functional - wholesale sellers see correct menu and routes are protected

---

## Phase 4: User Story 1 - Wholesale Cash Sales (Priority: P1) 🎯 MVP Core

**Goal**: Wholesale sellers can complete cash-only sales to wholesale customers using wholesale pricing

**Independent Test**: Login as wholesale seller, navigate to Ventas Mayorista, select a wholesale customer from dropdown, add 3 products showing wholesale prices, complete sale with cash payment method, verify sale appears in history with correct wholesale pricing and stock is decremented

### Implementation for User Story 1

- [ ] T017 [P] [US1] Create ProductSelector component in src/pages/VentaMayorista/components/ProductSelector.js to fetch and display products with precio_mayorista
- [ ] T018 [P] [US1] Create CustomerSelector component in src/pages/VentaMayorista/components/CustomerSelector.js to fetch and display wholesale customers for current seller
- [ ] T019 [P] [US1] Create SalesSummary component in src/pages/VentaMayorista/components/SalesSummary.js to display cart items with quantities, prices, and total
- [ ] T020 [US1] Create main VentaMayorista page in src/pages/VentaMayorista/VentaMayorista.js integrating all sub-components
- [ ] T021 [US1] Implement customer selection dropdown in VentaMayorista.js that fetches GET /clientes?tipo=mayorista&vendedor_id={userId}
- [ ] T022 [US1] Implement product selection that displays precio_mayorista field and adds items to cart state
- [ ] T023 [US1] Implement cart management (add product, remove product, update quantity) in VentaMayorista.js
- [ ] T024 [US1] Implement payment method selection (efectivo, transferencia, cheque) in VentaMayorista.js
- [ ] T025 [US1] Implement sale completion that calls POST /ventas-mayorista with customer_id, metodo_pago, and items array
- [ ] T026 [US1] Add stock validation before completing sale (check cantidad <= stock_disponible for each item)
- [ ] T027 [US1] Add success/error messaging using SweetAlert2 after sale completion
- [ ] T028 [US1] Extend src/service/ventasService.js to add createVentaMayorista() function for POST /ventas-mayorista
- [ ] T029 [US1] Extend src/service/clientesService.js to add getWholesaleCustomers(vendedorId) function
- [ ] T030 [US1] Add route for /venta-mayorista in src/Components/Content.js wrapped with RequireRole guard allowing WHOLESALE_SELLER and ADMIN
- [ ] T031 [US1] Manually test: Complete full sale flow from product selection to sale completion
- [ ] T032 [US1] Manually test: Verify wholesale prices are displayed (not retail prices)
- [ ] T033 [US1] Manually test: Verify credit/installment options are not visible or accessible
- [ ] T034 [US1] Manually test: Verify stock decrements after successful sale
- [ ] T035 [US1] Manually test: Verify sale appears in sales history with correct data

**Checkpoint**: At this point, User Story 1 should be fully functional - wholesale sellers can make complete sales transactions

---

## Phase 5: User Story 2 - Wholesale Customer Portfolio Management (Priority: P2)

**Goal**: Wholesale sellers can view, create, and edit their own wholesale customers

**Independent Test**: Login as wholesale seller, navigate to Clientes, verify only own wholesale customers are shown, add new customer, verify customer appears in list and in sales customer dropdown, verify cannot see customers from other sellers

### Implementation for User Story 2

- [ ] T036 [P] [US2] Create ClientesMayorista page in src/pages/ClientesMayorista/ClientesMayorista.js
- [ ] T037 [US2] Implement customer list view that fetches GET /clientes?tipo=mayorista&vendedor_id={userId}
- [ ] T038 [US2] Implement customer creation form that auto-sets tipo_cliente="mayorista" and vendedor_asignado_id={currentUserId}
- [ ] T039 [US2] Implement customer edit functionality (can edit nombre, dni_cuit, telefono, direccion, email, notas but NOT tipo_cliente or vendedor_asignado_id)
- [ ] T040 [US2] Add form validation for required fields (nombre) and email format
- [ ] T041 [US2] Extend src/service/clientesService.js to add createWholesaleCustomer() function for POST /clientes
- [ ] T042 [US2] Extend src/service/clientesService.js to add updateCustomer() function for PUT /clientes/{id}
- [ ] T043 [US2] Add route for /clientes-mayorista in src/Components/Content.js wrapped with RequireRole guard
- [ ] T044 [US2] Manually test: Verify customer list shows only own wholesale customers
- [ ] T045 [US2] Manually test: Create new customer and verify it appears in sales customer dropdown
- [ ] T046 [US2] Manually test: Verify cannot see retail customers in the list
- [ ] T047 [US2] Manually test: With two wholesale sellers, verify seller A cannot see seller B's customers

**Checkpoint**: All P1 and P2 user stories should now be independently functional

---

## Phase 6: User Story 4 - Account Statement Placeholder (Priority: P3)

**Goal**: Cuenta Corriente menu item is visible and navigates to placeholder page

**Independent Test**: Login as wholesale seller, click "Cuenta Corriente" menu item, verify navigation to placeholder page with "Coming soon" message

### Implementation for User Story 4

- [ ] T048 [US4] Verify placeholder page created in T010 displays appropriate "Coming soon" message with icon
- [ ] T049 [US4] Verify route created in T013 correctly navigates to placeholder page
- [ ] T050 [US4] Manually test: Click Cuenta Corriente menu item and verify placeholder page displays

**Checkpoint**: All user stories (P1, P2, P3) should now be complete

---

## Phase 7: Edge Cases & Error Handling

**Purpose**: Handle edge cases identified in spec.md

- [ ] T051 [P] Add validation in VentaMayorista.js to handle case when seller has no customers (show message: "Debe crear un cliente antes de realizar una venta")
- [ ] T052 [P] Add filtering in ProductSelector to exclude products where precio_mayorista is null or undefined
- [ ] T053 [P] Add error handling in VentaMayorista.js for insufficient stock with clear user message
- [ ] T054 [P] Verify route guards redirect wholesale sellers attempting to access retail routes to /unauthorized
- [ ] T055 [P] Add validation to ensure only wholesale customers appear in sales customer dropdown

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T056 [P] Add loading states to all async operations (customer fetch, product fetch, sale submission)
- [ ] T057 [P] Add consistent error messaging across all components using SweetAlert2
- [ ] T058 [P] Verify all file paths in import statements are correct and components render without errors
- [ ] T059 [P] Test on different browsers (Chrome, Firefox, Safari) per browserslist in package.json
- [ ] T060 [P] Verify responsive design works on mobile (sidebar closes on mobile as per existing closeMobileSidebar() function)
- [ ] T061 Update CLAUDE.md or project documentation with wholesale seller feature information
- [ ] T062 Run npm start and verify no console errors during development
- [ ] T063 Run npm build and verify production build succeeds

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 3 (Phase 3)**: Depends on Foundational (Phase 2) - P1 priority, prerequisite for accessing other features
- **User Story 1 (Phase 4)**: Depends on Foundational (Phase 2) AND User Story 3 (menu access) - P1 priority, core functionality
- **User Story 2 (Phase 5)**: Depends on Foundational (Phase 2) AND User Story 3 (menu access) - P2 priority, independent of US1
- **User Story 4 (Phase 6)**: Depends on Foundational (Phase 2) AND User Story 3 (menu structure) - P3 priority, placeholder only
- **Edge Cases (Phase 7)**: Depends on relevant user stories being complete
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 3 (P1) - Role-Based Menu Access**: FOUNDATIONAL - Must complete FIRST as it provides navigation to other features
  - Depends on: Phase 2 (roleGuards, constants)
  - Blocks: US1, US2, US4 (cannot navigate to features without menu)

- **User Story 1 (P1) - Wholesale Cash Sales**: CORE FUNCTIONALITY
  - Depends on: Phase 2, US3 (needs menu to navigate)
  - Independent of: US2 (can hardcode test customer for initial testing)
  - Suggested: Implement after US3, can run parallel with US2 if desired

- **User Story 2 (P2) - Customer Portfolio Management**: SUPPORTING FUNCTIONALITY
  - Depends on: Phase 2, US3 (needs menu to navigate)
  - Independent of: US1 (though US1 benefits from having customers)
  - Can run in parallel with: US1 (different files, different features)

- **User Story 4 (P3) - Account Statement Placeholder**: LOWEST PRIORITY
  - Depends on: Phase 2, US3 (uses menu structure)
  - Independent of: US1, US2
  - Minimal implementation (already done in Phase 3)

### Within Each User Story

**User Story 3**:
- T010 [P] (placeholder page) can run parallel with T011-T012 (menu modifications)
- T011-T012 (menu changes) must run sequentially (same file)
- T013 (route) can run parallel with menu changes
- T014-T016 (testing) must run after implementation complete

**User Story 1**:
- T017, T018, T019 [P] (three sub-components) can run in parallel
- T020 (main page) depends on T017-T019 completing
- T021-T027 (page logic) run sequentially (same file)
- T028, T029 [P] (service extensions) can run in parallel with each other and with component work
- T030 (route) can run parallel with component/service work
- T031-T035 (testing) must run after implementation complete

**User Story 2**:
- T036-T040 (page and form logic) run sequentially (same file)
- T041, T042 [P] (service functions) can run in parallel with each other
- T043 (route) can run parallel with page/service work
- T044-T047 (testing) must run after implementation complete

### Parallel Opportunities

- **Foundational Phase**: All tasks T006-T008 [P] can run in parallel (different files)
- **US3 Setup**: T010 [P] parallel with T011-T012
- **US1 Components**: T017, T018, T019 [P] can run in parallel
- **US1 Services**: T028, T029 [P] can run in parallel
- **US2 Services**: T041, T042 [P] can run in parallel
- **Edge Cases**: Most tasks T051-T055 [P] can run in parallel
- **Polish**: Most tasks T056-T060 [P] can run in parallel
- **US1 and US2**: Can be worked on in parallel by different developers after US3 is complete

---

## Parallel Example: User Story 1 Components

```bash
# Launch all sub-components for User Story 1 together:
Task T017: "Create ProductSelector component in src/pages/VentaMayorista/components/ProductSelector.js"
Task T018: "Create CustomerSelector component in src/pages/VentaMayorista/components/CustomerSelector.js"
Task T019: "Create SalesSummary component in src/pages/VentaMayorista/components/SalesSummary.js"

# These can all be written in parallel since they're different files with no dependencies
```

---

## Implementation Strategy

### MVP First (User Story 3 + User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T009) - CRITICAL - blocks all stories
3. Complete Phase 3: User Story 3 (T010-T016) - Menu access is prerequisite
4. Complete Phase 4: User Story 1 (T017-T035) - Core sales functionality
5. **STOP and VALIDATE**: Test User Story 1 independently
6. Deploy/demo if ready

**MVP Deliverable**: Wholesale sellers can log in, see correct menu, and complete cash sales using wholesale pricing. This is a functional increment delivering business value.

### Incremental Delivery

1. Complete Setup + Foundational (T001-T009) → Foundation ready
2. Add User Story 3 (T010-T016) → Test independently → Deploy/Demo (Menu access working!)
3. Add User Story 1 (T017-T035) → Test independently → Deploy/Demo (MVP with sales!)
4. Add User Story 2 (T036-T047) → Test independently → Deploy/Demo (Customer management!)
5. Add User Story 4 (T048-T050) → Test independently → Deploy/Demo (Complete feature set!)
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T009)
2. Team completes User Story 3 together (T010-T016) - Required for navigation
3. Once US3 is done:
   - Developer A: User Story 1 (T017-T035)
   - Developer B: User Story 2 (T036-T047)
   - Developer C: User Story 4 (T048-T050) + Edge Cases (T051-T055)
4. Stories complete and integrate independently
5. All developers: Polish together (T056-T063)

---

## Testing Strategy

**Manual Testing** (No automated tests requested in spec):

All manual testing tasks are embedded in user story phases:
- US3: T014-T016 (menu and route access)
- US1: T031-T035 (sales flow, pricing, stock)
- US2: T044-T047 (customer isolation)
- US4: T050 (placeholder navigation)

**Testing Focus Areas**:
1. **Role-Based Access**: Verify wholesale sellers see only wholesale menu and cannot access retail/admin routes
2. **Pricing**: Verify wholesale prices (not retail) are displayed and used in transactions
3. **Customer Isolation**: Verify sellers only see their own customers
4. **Stock Integrity**: Verify stock decrements correctly after sales
5. **Edge Cases**: Verify graceful handling of no customers, missing wholesale prices, insufficient stock

**Constitutional Compliance Validation**:
- ✅ Role-Based Authorization: Tasks T011-T016, T030, T043 enforce role checks
- ✅ Dual Pricing: Tasks T017, T022, T032 enforce wholesale pricing
- ✅ Client Portfolio Isolation: Tasks T021, T037, T044-T047 enforce portfolio separation
- ✅ Credit vs Cash Flow: Tasks T024-T025, T033 enforce cash-only sales
- ✅ Stock Integrity: Tasks T026, T034 enforce stock validation

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability (US1, US2, US3, US4)
- Each user story should be independently completable and testable
- Manual testing embedded within each user story phase
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Task Summary

**Total Tasks**: 63
**Setup Phase**: 5 tasks (T001-T005)
**Foundational Phase**: 4 tasks (T006-T009) - BLOCKING
**User Story 3 (P1)**: 7 tasks (T010-T016) - Menu access
**User Story 1 (P1)**: 19 tasks (T017-T035) - Core sales functionality
**User Story 2 (P2)**: 12 tasks (T036-T047) - Customer management
**User Story 4 (P3)**: 3 tasks (T048-T050) - Placeholder
**Edge Cases**: 5 tasks (T051-T055)
**Polish**: 8 tasks (T056-T063)

**Parallel Opportunities**: 23 tasks marked [P] can run in parallel
**Independent User Stories**: US1 and US2 can run in parallel after US3 completes

**Suggested MVP Scope**: Phases 1-4 (T001-T035) = 35 tasks for minimum viable product
**Full Feature Scope**: All 63 tasks for complete feature implementation
