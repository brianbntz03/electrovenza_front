# Tasks: Redirect to Login on API 401 Unauthorized

**Input**: Design documents from `/specs/003-redirect-login-401/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Not explicitly requested in the feature specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story. US1 creates the centralized wrapper. US2 migrates all existing fetch calls to use the wrapper.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: No project initialization needed. The project already exists with all dependencies installed.

- [ ] T001 Verify project builds and runs correctly by running `npm start` from project root

**Checkpoint**: Project confirmed working before any changes.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No foundational infrastructure changes needed. The existing project structure, routing, and authentication flow remain unchanged.

**Checkpoint**: Foundation ready — user story implementation can begin.

---

## Phase 3: User Story 1 - Session Expired During Normal Use (Priority: P1) MVP

**Goal**: When any API call returns HTTP 401, clear all authentication data from localStorage and redirect the user to the login page. Prevent duplicate redirects when multiple API calls fail simultaneously.

**Independent Test**: Delete `jwt_token` from localStorage in DevTools, then navigate to any page that makes an API call. The application should redirect to the login page with all auth keys cleared.

### Implementation for User Story 1

- [ ] T002 [US1] Create the centralized fetch wrapper module at `src/utils/authenticatedFetch.js`. The function must: (1) accept the same arguments as native `fetch(url, options)`, (2) inject `Authorization: Bearer` header using `localStorage.getItem("jwt_token")`, (3) call native `fetch()`, (4) check if `response.status === 401`, (5) on 401: clear all 6 localStorage keys (`jwt_token`, `user_role`, `user_name`, `user_id`, `vendedor_id`, `vendedor_nombre`) and redirect via `window.location.href`, (6) use a module-level `isRedirecting` boolean flag to prevent duplicate redirects, (7) for non-401 responses: return the response object unchanged to the caller. Export the function as a named export.

- [ ] T003 [US1] Remove the inline 401 handling from `src/Components/articulo-presupuesto.js` (around lines 360-365 in the `cargarClientes` function). Replace the `fetch()` call with `authenticatedFetch()` import from `src/utils/authenticatedFetch.js`. Remove the `else if (response.status === 401)` branch and the manual localStorage clearing and `window.location.href` redirect. Keep the `response.ok` success handling and generic error handling intact.

- [ ] T004 [P] [US1] Remove the inline 401 handling from `src/Components/articulo-presupuesto-Contado.js` (around lines 504-509 in the `cargarClientes` function). Apply the same changes as T003: replace `fetch()` with `authenticatedFetch()`, remove the 401 branch, keep success/error handling.

**Checkpoint**: User Story 1 is fully functional. The wrapper intercepts 401 responses and redirects to login. The 2 files that previously had inline 401 handling now use the centralized wrapper. Manual testing per quickstart.md should pass.

---

## Phase 4: User Story 2 - Consistent Behavior Across All Application Sections (Priority: P2)

**Goal**: Migrate all remaining 57 files that make direct `fetch()` calls to `${apiRest}` endpoints so they use `authenticatedFetch()` instead. After this phase, 100% of API calls are covered by 401 interception (SC-001).

**Independent Test**: From at least 5 different application sections (product listing, wholesale sale, customer list, reports, user management), trigger an expired-token scenario and verify each redirects to login.

### Implementation for User Story 2

#### Service Layer (3 files)

- [ ] T005 [P] [US2] Migrate `src/service/articulosService.js` to use `authenticatedFetch` from `src/utils/authenticatedFetch.js`. Replace all `fetch()` calls with `authenticatedFetch()`. Remove manual `Authorization` header construction and `localStorage.getItem("jwt_token")` references from headers (the wrapper injects these automatically). Keep all other request options (method, body, Content-Type) unchanged.

- [ ] T006 [P] [US2] Migrate `src/service/clientesService.js` to use `authenticatedFetch` from `src/utils/authenticatedFetch.js`. Replace all `fetch()` calls with `authenticatedFetch()`. Remove manual `Authorization` header construction. Also fix the inconsistent `auth_token` key in `createWholesaleCustomer()` and `updateCustomer()` — the wrapper uses `jwt_token` consistently.

- [ ] T007 [P] [US2] Migrate `src/service/ventasService.js` to use `authenticatedFetch` from `src/utils/authenticatedFetch.js`. Replace all `fetch()` calls with `authenticatedFetch()`. Remove manual `Authorization` header construction.

#### Components - Sales & Budgets (remaining fetch calls in files already touched in US1)

- [ ] T008 [P] [US2] Migrate remaining `fetch()` calls in `src/Components/articulo-presupuesto.js` (vendor fetching ~line 86, article search ~line 259, vendor loading ~line 321, sale registration ~line 115, quotes loading ~line 523) to use `authenticatedFetch`. Remove manual Authorization headers from each call.

- [ ] T009 [P] [US2] Migrate remaining `fetch()` calls in `src/Components/articulo-presupuesto-Contado.js` (vendor fetching ~line 57, article search ~line 404, vendor loading ~line 466, sale registration ~line 86, quotes loading ~line 545) to use `authenticatedFetch`. Remove manual Authorization headers from each call.

#### Components - Listados (10 files)

- [ ] T010 [P] [US2] Migrate `src/Components/tablasListado/listado_categoria.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T011 [P] [US2] Migrate `src/Components/tablasListado/listadoSettingCuotasCredito.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T012 [P] [US2] Migrate `src/Components/tablasListado/listadoVendedores.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T013 [P] [US2] Migrate `src/Components/tablasListado/listadoSettingBandaPrecios.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T014 [P] [US2] Migrate `src/Components/tablasListado/listadoSettingCuotas.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T015 [P] [US2] Migrate `src/Components/tablasListado/listadoClientes.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T016 [P] [US2] Migrate `src/Components/tablasListado/ListadoVentasMayorista.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T017 [P] [US2] Migrate `src/Components/tablasListado/ListadoArticuloVendedor.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T018 [P] [US2] Migrate `src/Components/tablasListado/ListadoProducto.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T019 [P] [US2] Migrate `src/Components/tablasListado/ListadoTipoMovimientoCC.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T020 [P] [US2] Migrate `src/Components/tablasListado/ListadoVentas.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

#### Components - Modals (8 files)

- [ ] T021 [P] [US2] Migrate `src/Components/modals/EditarTipoMovimientoCCModal.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T022 [P] [US2] Migrate `src/Components/modals/EditarVendedorModal.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T023 [P] [US2] Migrate `src/Components/modals/EditarClienteModal.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T024 [P] [US2] Migrate `src/Components/modals/EditarCuotaCredito.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T025 [P] [US2] Migrate `src/Components/modals/EditarCuotaElectro.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T026 [P] [US2] Migrate `src/Components/modals/EditarProductoMoral.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T027 [P] [US2] Migrate `src/Components/modals/EditarBandaPreciosModal.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T028 [P] [US2] Migrate `src/Components/modals/EditarCategoriaModal.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

#### Components - Crear (10 files)

- [ ] T029 [P] [US2] Migrate `src/Components/Crear/CrearTipoMovimientoCC.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T030 [P] [US2] Migrate `src/Components/Crear/CrearVendedor.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T031 [P] [US2] Migrate `src/Components/Crear/CrearCuotaCredito.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T032 [P] [US2] Migrate `src/Components/Crear/CrearProducto.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T033 [P] [US2] Migrate `src/Components/Crear/CrearProveedor.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T034 [P] [US2] Migrate `src/Components/Crear/CrearCuota.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T035 [P] [US2] Migrate `src/Components/Crear/CrearClientesFiltrado.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T036 [P] [US2] Migrate `src/Components/Crear/CrearCompras.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T037 [P] [US2] Migrate `src/Components/Crear/CrearCategorias.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T038 [P] [US2] Migrate `src/Components/Crear/CrearClientes.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

#### Components - Credits & Payments (8 files)

- [ ] T039 [P] [US2] Migrate `src/Components/creditoApagar.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T040 [P] [US2] Migrate `src/Components/CuotaVencida.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T041 [P] [US2] Migrate `src/Components/CuotaAPagar.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T042 [P] [US2] Migrate `src/Components/CuotasVencidas.js` to use `authenticatedFetch`. Replace all `fetch()` calls (including the 2 calls that currently lack Authorization headers — the wrapper will add them automatically), remove manual Authorization headers where present.

- [ ] T043 [P] [US2] Migrate `src/Components/CreditosVencidas.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T044 [P] [US2] Migrate `src/Components/cuotasVencidasAll.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T045 [P] [US2] Migrate `src/Components/OtorgarCredito.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T046 [P] [US2] Migrate `src/Components/CreditoCuotasPendientes.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

#### Components - Commissions & Sales (5 files)

- [ ] T047 [P] [US2] Migrate `src/Components/comisionesPorCreditoPendientes.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T048 [P] [US2] Migrate `src/Components/comisionesPorVentaPendientes.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T049 [P] [US2] Migrate `src/Components/ComisionesPorVentaPendientesVendedor.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T050 [P] [US2] Migrate `src/Components/VentaCuotasPendientes.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T051 [P] [US2] Migrate `src/Components/ListadoVentas.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

#### Components - Other (7 files)

- [ ] T052 [P] [US2] Migrate `src/Components/todas-las-categorias.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T053 [P] [US2] Migrate `src/Components/tiny/BotonAnularCredito.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T054 [P] [US2] Migrate `src/Components/listadoClienteFiltradoVendedor.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T055 [P] [US2] Migrate `src/Components/listadoSettingCuotasCredito.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T056 [P] [US2] Migrate `src/Components/articulos.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T057 [P] [US2] Migrate `src/Components/Listadoproveedores.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T058 [P] [US2] Migrate `src/Components/ActualizacionMasiva.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T059 [P] [US2] Migrate `src/Components/ButtonSearch.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T060 [P] [US2] Migrate `src/Components/RegistrarMovimiento.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

#### Pages (3 files)

- [ ] T061 [P] [US2] Migrate `src/pages/print/PageCuotasCreditoImprimir.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T062 [P] [US2] Migrate `src/pages/print/PageCuotasImprimir.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T063 [P] [US2] Migrate `src/pages/productosLIstado.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

- [ ] T064 [P] [US2] Migrate `src/pages/articulosListados.js` to use `authenticatedFetch`. Replace all `fetch()` calls, remove manual Authorization headers.

#### Wholesale Pages (already using service layer but verify)

- [ ] T065 [P] [US2] Verify that `src/pages/VentaMayorista/components/ProductSelector.js`, `src/pages/VentaMayorista/components/CustomerSelector.js`, and `src/pages/VentaMayorista/VentaMayorista.js` use the service layer (which was migrated in T005-T007) and do not have any direct `fetch()` calls to `${apiRest}`. If any direct calls exist, migrate them to `authenticatedFetch`.

**Checkpoint**: All 59 files (excluding FormularioLogin.js) now use `authenticatedFetch`. 100% of API calls are covered by 401 interception (SC-001).

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Validation, cleanup, and build verification

- [ ] T066 Run a codebase-wide search for `fetch(\`${apiRest}` or `fetch(apiRest` in all `src/` files to verify no direct fetch calls to the API remain outside of `FormularioLogin.js` and the `authenticatedFetch.js` wrapper itself. Any remaining direct calls must be migrated.

- [ ] T067 Run `npm start` to verify the application compiles without errors after all migrations.

- [ ] T068 Run `npm run build` to verify the production build succeeds.

- [ ] T069 Perform manual smoke test per `quickstart.md`: (1) Log in, (2) delete `jwt_token` from DevTools localStorage, (3) navigate to any page, (4) verify redirect to login, (5) verify all 6 localStorage keys are cleared, (6) log in again and verify normal operation.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — verify project works first
- **Foundational (Phase 2)**: N/A — no foundational changes needed
- **User Story 1 (Phase 3)**: Depends on Phase 1 — creates the wrapper module
- **User Story 2 (Phase 4)**: Depends on Phase 3 (T002) — wrapper must exist before files can import it
- **Polish (Phase 5)**: Depends on all Phase 3 and Phase 4 tasks being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 1. Creates `authenticatedFetch.js` and migrates the 2 files with existing 401 handling.
- **User Story 2 (P2)**: Can start after T002 is complete. All 57 remaining migration tasks are independent and can run in parallel.

### Within Each User Story

- US1: T002 must complete before T003 and T004 (wrapper must exist). T003 and T004 can run in parallel.
- US2: All tasks (T005-T065) can run in parallel once T002 is done. They all touch different files with no interdependencies.

### Parallel Opportunities

- T003, T004 can run in parallel (US1)
- T005 through T065 can ALL run in parallel (US2) — each task modifies a different file

---

## Parallel Example: User Story 2

```bash
# All US2 tasks can launch simultaneously since each modifies a different file:
Task: "Migrate src/service/articulosService.js"
Task: "Migrate src/service/clientesService.js"
Task: "Migrate src/service/ventasService.js"
Task: "Migrate src/Components/tablasListado/listado_categoria.js"
# ... (all 57 remaining files in parallel)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Verify project builds (T001)
2. Complete Phase 3: Create wrapper + migrate 2 files with 401 handling (T002-T004)
3. **STOP and VALIDATE**: Test 401 redirect from sales pages manually
4. The wrapper is functional; existing 401 handling is replaced

### Incremental Delivery

1. US1 complete → Core 401 redirect works on 2 key pages
2. US2 services → Wholesale features covered (T005-T007)
3. US2 components → All remaining pages covered (T008-T065)
4. Polish → Full validation and build verification (T066-T069)

### File Count Summary

- **FormularioLogin.js**: Exempt (1 file)
- **authenticatedFetch.js**: New wrapper (1 file)
- **US1 migration**: 2 files (articulo-presupuesto.js, articulo-presupuesto-Contado.js)
- **US2 migration**: 57 files (services + components + pages)
- **Total files modified/created**: 60

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- FormularioLogin.js is deliberately excluded — a 401 on login means invalid credentials
- The `auth_token` inconsistency in clientesService.js is fixed as part of T006
- The missing Authorization headers in CuotasVencidas.js are fixed as part of T042
- Commit after each logical group (services, listados, modals, crear, etc.)
