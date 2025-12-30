# Research: Vendedor Mayorista Role Implementation

**Feature**: Vendedor Mayorista Role
**Date**: 2025-12-29
**Purpose**: Research and document technology decisions for implementing wholesale seller functionality

## Research Questions & Findings

### 1. Component Reuse Strategy

**Question**: How can we reuse existing retail sales components for wholesale sales while removing credit/installment functionality?

**Research Findings**:
- Examined existing `src/Presupuestos/presupuestossss.js` and `presupuestossssAlContado.js`
- Current structure has separate components for credit vs cash sales
- Components use conditional rendering based on payment type

**Decision**: Create new `VentaMayorista` component that:
- Imports shared product selection logic from existing components
- Hard-codes payment type to "contado" (cash)
- Removes all credit/installment UI elements (cuotas, financiación)
- Passes `priceField="precio_mayorista"` to product display components
- Maintains same overall UX flow (browse → select → complete)

**Rationale**: Reusing existing tested logic reduces bugs and development time. Wholesale sales are simpler (no credit), so removing complexity is straightforward.

**Alternatives Considered**:
- **Modify existing PagePresupuestar with props**: Rejected because would add complexity to existing component
- **Complete rewrite**: Rejected because duplicates existing tested logic unnecessarily

---

### 2. Role-Based Menu Rendering

**Question**: How should the menu system handle the new wholesale seller role?

**Research Findings**:
- Current `src/Components/Aside.js` uses `localStorage.getItem("user_role")` for role detection
- Existing pattern: `renderVendedorMenu()` function for retail seller menu
- Role stored as string in localStorage after JWT authentication

**Decision**: Add `renderVendedorMayoristaMenu()` function in Aside.js that returns:
- "Ventas Mayorista" menu item linking to `/venta-mayorista`
- "Clientes" menu item linking to `/clientes-mayorista`
- "Cuenta Corriente" menu item (placeholder)

Update main render to check `userRole === "vendedor_mayorista"` and call new function.

**Rationale**: Follows existing pattern for role-based menu rendering. Minimal changes to existing code. Clear separation of concerns.

**Alternatives Considered**:
- **Single render function with complex conditionals**: Rejected due to reduced readability
- **Separate menu component**: Rejected as over-engineering for this use case

---

### 3. Route Protection & Guards

**Question**: How should we prevent unauthorized access to wholesale seller routes?

**Research Findings**:
- React Router DOM 7.0.2 installed (latest version)
- No existing route guards found in codebase
- Current approach relies on menu visibility only (security risk)

**Decision**: Create `src/utils/roleGuards.js` with:
- `RequireRole` wrapper component that checks localStorage role
- Returns `<Navigate to="/unauthorized" />` if role doesn't match
- Wrap wholesale routes in Content.js with `<RequireRole allowedRoles={["vendedor_mayorista", "administrador"]}>`

**Rationale**: Defense in depth - even if user manually navigates to URL, they're redirected. Administrators can access all features for support/troubleshooting.

**Alternatives Considered**:
- **Backend-only auth**: Rejected because frontend should fail fast
- **No guards (menu hiding only)**: Rejected as security vulnerability

---

### 4. Pricing Display Strategy

**Question**: How can product components display wholesale vs retail prices based on user role?

**Research Findings**:
- Products likely have fields `precio` (retail) and `precio_mayorista` (wholesale) in backend
- Product display components currently hard-code price field access

**Decision**:
- Add optional `priceField` prop to product display components (default: "precio")
- Wholesale components pass `priceField="precio_mayorista"`
- Display components use `product[priceField]` to access price

For new components, pass role-based price field directly:
```javascript
const priceField = userRole === "vendedor_mayorista" ? "precio_mayorista" : "precio";
```

**Rationale**: Minimal changes to existing components. Clear, explicit control over which price is displayed.

**Alternatives Considered**:
- **Automatic role detection in components**: Rejected because makes components less reusable
- **Separate wholesale product components**: Rejected as code duplication

---

### 5. Customer Type & Assignment

**Question**: How should we distinguish wholesale customers from retail customers in the data model?

**Research Findings**:
- Customer management exists in `src/Components/tablasListado/listadoClientes.js`
- Backend customer model needs extension (assumed based on requirements)

**Decision**: Extend customer data model with:
- `tipo_cliente`: Enum/String field with values "minorista" or "mayorista"
- `vendedor_asignado_id`: Foreign key to user table (seller who owns this customer)
- `created_by_role`: Track which role created the customer (for audit)

Frontend filtering:
- When wholesale seller accesses `/clientes-mayorista`, fetch with query: `?tipo=mayorista&vendedor_id={currentUserId}`
- Customer creation form auto-sets `tipo_cliente` based on logged-in user's role
- Customer selection in sales only shows customers matching seller's type and ID

**Rationale**: Simple data model extension. Clear ownership. Easy to query and filter.

**Alternatives Considered**:
- **Separate customer tables**: Rejected as over-engineering
- **Many-to-many seller-customer relationship**: Rejected as violates portfolio isolation principle

---

### 6. API Integration Patterns

**Question**: Should we create new service files or extend existing ones?

**Research Findings**:
- Existing service pattern in `src/service/` directory
- Services handle API calls with fetch/axios
- Pattern: one service file per domain (auth, ventas, clientes)

**Decision**:
- **Extend** `src/service/authService.js` to handle "vendedor_mayorista" role in JWT decode
- **Extend** `src/service/ventasService.js` to add `createVentaMayorista()` function
- **Extend** `src/service/clientesService.js` to add customer type filtering

No new service files needed - all functionality fits existing domains.

**Rationale**: Maintains existing architecture. Wholesale operations are variations of existing operations, not new domains.

**Alternatives Considered**:
- **New wholesaleService.js**: Rejected as unnecessary file proliferation
- **Inline API calls in components**: Rejected as violates separation of concerns

---

### 7. Testing Strategy

**Question**: What testing approach provides adequate coverage without excessive test writing?

**Research Findings**:
- React Testing Library available via react-scripts
- Jest configured via Create React App
- No existing integration tests found in codebase

**Decision**: Write three types of tests:
1. **Integration tests** (priority):
   - `wholesaleSalesFlow.test.js`: Login → select products → complete sale
   - `roleBasedAccess.test.js`: Verify menu items and route guards work
   - `customerPortfolioIsolation.test.js`: Verify sellers only see own customers

2. **Unit tests** (secondary):
   - `roleGuards.test.js`: Test role checking logic
   - `Aside.test.js`: Test menu rendering for different roles

3. **Manual testing** (for UI/UX):
   - Price display correctness
   - Form validation
   - Error handling

**Rationale**: Integration tests provide most value for validating constitutional principles (role isolation, pricing, portfolio separation). Unit tests for critical utilities.

**Alternatives Considered**:
- **E2E tests with Cypress/Playwright**: Rejected as out of scope for frontend-only project
- **Comprehensive unit test coverage**: Rejected as too time-consuming for limited value

---

### 8. Stock Validation

**Question**: How should wholesale sales validate and decrement stock?

**Research Findings**:
- Stock validation likely exists in retail sales flow
- Backend probably handles stock decrements atomically

**Decision**: Reuse exact same stock validation as retail sales:
- Frontend checks `product.stock_available` before adding to cart
- Frontend displays warning if stock insufficient
- Backend handles atomic stock decrement in `POST /ventas-mayorista`
- Frontend refreshes product list after successful sale

**Rationale**: Stock integrity principle applies equally to retail and wholesale. No need for different logic.

**Alternatives Considered**:
- **Different stock validation for wholesale**: Rejected as unnecessary complexity
- **Frontend-only stock tracking**: Rejected as unreliable (race conditions)

---

## Technology Stack Summary

### Frontend Dependencies (Already Installed)
- React 19.1.0 - UI framework
- React Router DOM 7.0.2 - Routing and navigation
- jwt-decode 4.0.0 - JWT token parsing for role extraction
- SweetAlert2 11.6.13 - User notifications and confirmations
- FontAwesome 7.0.1 - Icons
- date-fns 4.1.0 - Date formatting (if needed for sale timestamps)
- React Testing Library - Component testing

### No New Dependencies Required
All functionality can be implemented with existing dependencies.

---

## Backend Dependencies

**Note**: This is a frontend-only project. Backend changes are assumed to be handled separately.

### Required Backend Support
1. User model with `role` field supporting value "vendedor_mayorista"
2. Product model with `precio_mayorista` field (decimal/float)
3. Customer model with `tipo_cliente` and `vendedor_asignado_id` fields
4. Sale/Venta model with `tipo_venta` field supporting value "mayorista"
5. Endpoints:
   - `GET /articulos` (existing, may need filtering)
   - `GET /clientes?tipo=mayorista&vendedor_id={id}` (existing with query params)
   - `POST /ventas-mayorista` (new or extend existing /ventas)
   - `POST /clientes` (existing, accepts tipo_cliente in body)

---

## Implementation Best Practices

### Code Organization
1. **Feature-based folders**: Keep wholesale-specific components in `src/pages/VentaMayorista/`
2. **Shared utilities**: Put role guards and constants in `src/utils/` and `src/constants/`
3. **Component composition**: Reuse existing components via props, not duplication

### Performance Considerations
1. **Lazy loading**: Use React.lazy() for wholesale pages (loaded only when needed)
2. **Memoization**: Use React.memo() for product list components (prevent unnecessary re-renders)
3. **API caching**: Consider caching customer list in localStorage (updated on changes)

### Security Best Practices
1. **Defense in depth**: Role checks in both menu rendering AND route guards
2. **No sensitive data in localStorage**: Store only role string, not full user object
3. **API validation**: Frontend checks are UX convenience; backend must enforce all rules

### Code Style
1. **Match existing patterns**: Follow naming conventions from Aside.js and Content.js
2. **Spanish naming**: Keep Spanish names for domain concepts (venta, cliente, mayorista)
3. **Comments in Spanish**: Match existing codebase convention

---

## Risk Mitigation

### Identified Risks

1. **Risk**: Backend endpoints don't support required filtering
   - **Mitigation**: Document exact query param requirements; test with mock data first

2. **Risk**: Existing product components too tightly coupled to retail pricing
   - **Mitigation**: Add props incrementally; maintain backward compatibility

3. **Risk**: Role stored in localStorage can be manipulated by user
   - **Mitigation**: Backend must re-validate role on every API call; frontend role is UX only

4. **Risk**: Component reuse introduces bugs in existing retail flow
   - **Mitigation**: Write regression tests for retail flow; use feature flags if available

---

## Open Questions for Backend Team

1. Does `precio_mayorista` field already exist on products table?
2. What is the exact structure of the JWT token? (Need to confirm role field name)
3. Should `/ventas-mayorista` be a separate endpoint or use existing `/ventas` with a type parameter?
4. How are customer IDs generated? (Auto-increment, UUID, etc.)
5. Are there any rate limits or pagination requirements for customer/product lists?

---

## Next Steps

✅ Research complete
→ Proceed to Phase 1: Data Model and API Contracts design
