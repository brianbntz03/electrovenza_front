# Research: Gestión de Tipo de Vendedor Implementation

**Feature**: Gestión de Tipo de Vendedor
**Date**: 2025-12-30
**Purpose**: Research and document technology decisions for implementing seller type management functionality

## Research Questions & Findings

### 1. Component Reuse Strategy for Seller Management

**Question**: How can we modify existing seller list and creation components to add seller type selection?

**Research Findings**:
- Examined existing `src/pages/PageListadoVendedores.js` and `src/Components/Crear/CrearVendedor.js`
- Current structure uses table display for seller list with edit functionality
- Creation form uses standard form component pattern

**Decision**: Extend existing components with seller type dropdown field:
- Add `<select>` field for "Tipo de Vendedor" in CrearVendedor component
- Add "Tipo" column to seller list table in PageListadoVendedores
- Add seller type dropdown in edit mode for existing sellers
- Use role constants from feature 001-vendedor-mayorista (`ROLES.RETAIL_SELLER`, `ROLES.WHOLESALE_SELLER`)

**Rationale**: Reusing existing components minimizes code changes and maintains consistency with current UI patterns. The seller type is simply an additional field in the user/seller data model.

**Alternatives Considered**:
- **Create new seller management pages**: Rejected as unnecessary duplication
- **Use separate forms for each seller type**: Rejected as over-engineering

---

### 2. Data Model Extension for Seller Type

**Question**: How should the seller type be stored and what are the default values for existing sellers?

**Research Findings**:
- Feature 001-vendedor-mayorista already introduced the `role` field in the user model
- Existing sellers likely have `role` field with value "admin" or `null`/empty
- The three roles are: "administrador", "vendedor_minorista", "vendedor_mayorista"

**Decision**: Extend user model validation and default values:
- User table `role` field already exists (from feature 001)
- Default value for `role` when creating new seller: "vendedor_minorista"
- Data migration script to set existing sellers with `null` role to "vendedor_minorista"
- Validation: role MUST be one of three allowed values

**Rationale**: Aligns with constitutional principle I (Role-Based Authorization) and reuses existing infrastructure from feature 001.

**Alternatives Considered**:
- **Separate seller_type field**: Rejected to avoid redundancy with existing `role` field
- **No default value**: Rejected as it would require manual assignment for all sellers

---

### 3. UI/UX Pattern for Seller Type Selection

**Question**: What UI pattern should be used for selecting seller type in forms?

**Research Findings**:
- Standard practice for limited options (2 choices) is dropdown or radio buttons
- Existing ElectroVenza UI uses dropdowns for category selection, payment methods, etc.

**Decision**: Use `<select>` dropdown for seller type selection:
```javascript
<select name="role" value={role} onChange={handleRoleChange}>
  <option value="vendedor_minorista">Vendedor Minorista</option>
  <option value="vendedor_mayorista">Vendedor Mayorista</option>
</select>
```

Display in list:
```javascript
{seller.role === 'vendedor_minorista' ? 'Vendedor Minorista' : 'Vendedor Mayorista'}
```

**Rationale**: Consistency with existing UI patterns. Dropdown is familiar to users and works well for 2-3 options.

**Alternatives Considered**:
- **Radio buttons**: Rejected as takes more vertical space
- **Toggle switch**: Rejected as less clear labeling for business users

---

### 4. Handling Active Sessions When Seller Type Changes

**Question**: How should the system handle sellers who are currently logged in when their type is changed?

**Research Findings**:
- localStorage stores `user_role` on login (from feature 001)
- Changing the seller type in the database doesn't automatically update active sessions
- Menu rendering in `Aside.js` reads from localStorage

**Decision**: Require re-login for type change to take effect:
- Admin can change seller type at any time
- Show warning message to admin: "El vendedor deberá cerrar sesión y volver a iniciar para que el cambio surta efecto"
- No automatic session invalidation (keeps implementation simple)
- Seller will see updated menu on next login when localStorage is refreshed with new `user_role`

**Rationale**: Simple implementation that avoids complex session management. Re-login is acceptable for low-frequency admin action.

**Alternatives Considered**:
- **Automatic session invalidation**: Rejected as requires backend session tracking
- **Real-time menu update**: Rejected as requires WebSocket or polling infrastructure

---

### 5. Validation Rules for Seller Type Changes

**Question**: Should there be restrictions on when a seller type can be changed (e.g., if they have active sales or assigned customers)?

**Research Findings**:
- Spec FR-008 marked for clarification
- Best practice in admin systems: allow full flexibility for administrators, provide warnings not blocks
- Business requirement: administrators need flexibility to correct mistakes and adapt to changing business needs

**Decision**: No validation restrictions - allow administrators to change seller type at any time:
- No checks for existing customers or sales
- Customers remain assigned to the seller (customer `tipo_cliente` doesn't change automatically)
- Sales history is preserved
- Show confirmation dialog: "¿Está seguro que desea cambiar el tipo de este vendedor? Los clientes y ventas asignados se mantendrán."

**Rationale**: Administrators need flexibility. Historical data integrity is maintained. Edge cases (e.g., mayorista seller with minorista customers) can be handled manually if they arise.

**Alternatives Considered**:
- **Block if seller has customers**: Rejected as too restrictive
- **Require customer reassignment**: Rejected as creates unnecessary workflow complexity

---

### 6. Customer Type Behavior When Seller Type Changes

**Question**: When a seller's type changes from minorista to mayorista (or vice versa), what happens to their assigned customers?

**Research Findings**:
- Spec FR-009 marked for clarification
- Constitutional Principle III: Client Portfolio Isolation
- Customers have `tipo_cliente` field ("minorista" or "mayorista") and `vendedor_asignado_id`

**Decision**: Customers maintain their original type - no automatic type change:
- Customer `tipo_cliente` remains unchanged when seller type changes
- Customer `vendedor_asignado_id` remains pointing to the same seller
- This creates temporary edge case: mayorista seller might have minorista customers (or vice versa)
- Admin responsibility to manually reassign customers if needed
- System allows this flexibility for transition periods

**Rationale**: Preserves data integrity. Avoids unintended mass customer type changes. Provides flexibility for business transitions.

**Alternatives Considered**:
- **Auto-change customer types**: Rejected as potentially destructive (e.g., accidental seller type change would reclassify all customers)
- **Block type change if customers exist**: Rejected as too restrictive

---

### 7. API Integration Pattern

**Question**: Should we create new API endpoints or extend existing ones for seller type management?

**Research Findings**:
- Existing endpoints likely include `GET /users`, `POST /users`, `PUT /users/:id`
- Seller type is just an additional field in the user/seller model
- RESTful pattern: use existing CRUD endpoints with additional field

**Decision**: Extend existing user/seller API endpoints:
- `POST /users` (create seller) - accept `role` field in request body
- `PUT /users/:id` (update seller) - accept `role` field in request body
- `GET /users` (list sellers) - return `role` field in response
- No new endpoints needed

Request/Response example:
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "role": "vendedor_mayorista"
}
```

**Rationale**: RESTful best practice. Minimal backend changes. Aligns with existing API patterns.

**Alternatives Considered**:
- **Separate `/sellers/type` endpoint**: Rejected as over-engineering
- **PATCH with only role field**: Possible but PUT is more standard in this codebase

---

## Technology Stack Summary

### Frontend Dependencies (Already Installed)
- React 19.1.0 - UI framework
- React Router DOM 7.0.2 - Routing
- SweetAlert2 11.6.13 - User notifications and confirmations
- FontAwesome 7.0.1 - Icons
- Constants from feature 001: `src/constants/roles.js`

### No New Dependencies Required
All functionality can be implemented with existing dependencies and components.

---

## Backend Dependencies

**Note**: This is a frontend-only project. Backend changes are assumed to be handled separately or already exist from feature 001-vendedor-mayorista.

### Required Backend Support
1. User/Seller model with `role` field supporting values: "administrador", "vendedor_minorista", "vendedor_mayorista"
2. Data migration to set default `role = "vendedor_minorista"` for existing sellers with `null` role
3. Validation on backend to ensure `role` is one of the three allowed values
4. Endpoints already exist: `GET/POST/PUT /users` or `/vendedores`

---

## Implementation Best Practices

### Code Organization
1. **Modify existing components**: `src/pages/PageListadoVendedores.js`, `src/Components/Crear/CrearVendedor.js`
2. **Reuse role constants**: Import from `src/constants/roles.js` (feature 001)
3. **No new pages needed**: Work within existing seller management pages

### UX Considerations
1. **Clear labeling**: "Tipo de Vendedor" field label, "Vendedor Minorista" / "Vendedor Mayorista" option labels
2. **Confirmation dialogs**: Warn admin before changing seller type
3. **Visual distinction**: Show seller type prominently in list view (e.g., badge or icon)
4. **Default selection**: Pre-select "Vendedor Minorista" when creating new seller

### Security Best Practices
1. **Admin-only access**: Only administrators can access `/gestion/vendedores/` and `/gestion/crearvendedores`
2. **Backend validation**: Server must validate that requesting user is admin before allowing seller type changes
3. **Audit logging**: Consider logging seller type changes for compliance

---

## Risk Mitigation

### Identified Risks

1. **Risk**: Seller changes type while logged in, sees incorrect menu until re-login
   - **Mitigation**: Display clear warning to admin about re-login requirement

2. **Risk**: Seller with mismatched customer types (e.g., mayorista seller with minorista customers)
   - **Mitigation**: Admin responsibility. Provide clear documentation. Consider future report to identify mismatches.

3. **Risk**: Accidental seller type change
   - **Mitigation**: Confirmation dialog before saving changes

---

## Decisions Summary

| Decision Point | Choice | Rationale |
|---------------|--------|-----------|
| Component Reuse | Extend existing seller list/create components | Minimizes code changes, maintains consistency |
| Data Model | Use existing `role` field from feature 001 | Avoids redundancy |
| UI Pattern | Dropdown (`<select>`) for type selection | Consistency with existing patterns |
| Active Session Handling | Require re-login | Simple implementation, acceptable UX |
| Type Change Validation | No restrictions - allow anytime | Admin flexibility |
| Customer Type on Change | Maintain original customer type | Data integrity, flexibility |
| API Pattern | Extend existing user endpoints | RESTful best practice |

---

## Next Steps

✅ Research complete
→ Proceed to Phase 1: Data Model and API Contracts design
