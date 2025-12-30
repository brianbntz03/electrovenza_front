# Feature Specification: Vendedor Mayorista Role

**Feature Branch**: `001-vendedor-mayorista`
**Created**: 2025-12-29
**Status**: Draft
**Input**: User description: "a los roles existentes (vendedor y administrador) se agrega un nuevo rol, el 'vendedor mayorista' que tendrá las siguientes funcionalidades..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Wholesale Cash Sales (Priority: P1)

A wholesale seller logs into the system and completes a cash sale to one of their wholesale customers using wholesale pricing. The seller browses products, adds them to a sale quote, and registers the completed cash transaction.

**Why this priority**: This is the core functionality that defines the wholesale seller role. Without the ability to make wholesale sales, the role has no primary purpose. This story delivers immediate business value by enabling a new revenue channel.

**Independent Test**: Can be fully tested by logging in as a wholesale seller, selecting a wholesale customer, adding products to a sale at wholesale prices, and completing the cash transaction. Success means the sale is recorded with correct wholesale pricing and appears in the seller's sales history.

**Acceptance Scenarios**:

1. **Given** a wholesale seller is logged in, **When** they navigate to "Ventas Mayorista", **Then** they see a product selection interface similar to the retail budget screen
2. **Given** products are displayed, **When** the wholesale seller views product prices, **Then** all prices shown are wholesale prices (precio_mayorista)
3. **Given** products are added to the sale, **When** the wholesale seller completes the transaction, **Then** the sale is registered as cash-only with no installment options
4. **Given** a wholesale sale is completed, **When** the seller views their sales history, **Then** the new sale appears with correct wholesale pricing and cash payment status
5. **Given** a wholesale seller is viewing the sales interface, **When** they try to access credit or installment options, **Then** these options are not available or visible

---

### User Story 2 - Wholesale Customer Portfolio Management (Priority: P2)

A wholesale seller manages their portfolio of wholesale customers, including viewing customer details, adding new wholesale customers, and editing existing customer information. Each seller can only access their own customers.

**Why this priority**: Customer management is essential but secondary to the ability to make sales. Sellers need to associate sales with specific customers for tracking and reporting purposes. This becomes critical once sales are being made.

**Independent Test**: Can be fully tested by logging in as a wholesale seller, viewing the customer list (which shows only their assigned wholesale customers), adding a new wholesale customer, and verifying the customer appears in subsequent sales customer selection.

**Acceptance Scenarios**:

1. **Given** a wholesale seller is logged in, **When** they navigate to "Clientes", **Then** they see only their own wholesale customers
2. **Given** a wholesale seller is viewing their customer list, **When** they add a new customer, **Then** the customer is created as a wholesale customer type and assigned to this seller
3. **Given** a wholesale seller is creating a sale, **When** they select a customer, **Then** only their own wholesale customers appear in the selection
4. **Given** multiple wholesale sellers exist, **When** seller A views their customers, **Then** they cannot see seller B's customers

---

### User Story 3 - Role-Based Menu Access (Priority: P1)

A user with the wholesale seller role logs into the system and sees a customized menu with only the options relevant to their role: wholesale sales, customers, and account statement.

**Why this priority**: This is foundational infrastructure that must be in place for the wholesale seller role to function. Without proper menu access, users cannot reach the wholesale sales features. This is co-priority with P1 because it's a prerequisite for accessing wholesale sales.

**Independent Test**: Can be fully tested by creating a user with the wholesale seller role, logging in with those credentials, and verifying that the menu displays only "Ventas Mayorista", "Clientes", and "Cuenta Corriente" options (with Cuenta Corriente being placeholder-only initially).

**Acceptance Scenarios**:

1. **Given** a user with wholesale seller role credentials, **When** they log in, **Then** the system authenticates them and identifies their role as wholesale seller
2. **Given** a wholesale seller is authenticated, **When** the main menu loads, **Then** it displays only: "Ventas Mayorista", "Clientes", and "Cuenta Corriente"
3. **Given** a wholesale seller is logged in, **When** they attempt to access retail seller features (like credit sales), **Then** those options are not visible in the menu
4. **Given** a wholesale seller is logged in, **When** they attempt to access administrator features, **Then** those options are not visible and direct URL access is prevented

---

### User Story 4 - Account Statement Menu Item (Priority: P3)

A wholesale seller can see a "Cuenta Corriente" menu item that will eventually provide access to their account statement and commission information.

**Why this priority**: This is a placeholder for future functionality. It provides visual consistency with the retail seller menu structure but delivers no immediate functional value. Including it now prepares the UI for future development.

**Independent Test**: Can be fully tested by logging in as a wholesale seller and verifying that "Cuenta Corriente" appears in the menu. For this initial version, clicking it may show a "Coming soon" message or navigate to a placeholder page.

**Acceptance Scenarios**:

1. **Given** a wholesale seller is logged in, **When** they view the main menu, **Then** "Cuenta Corriente" appears as a menu option
2. **Given** a wholesale seller clicks "Cuenta Corriente", **When** the navigation occurs, **Then** the user sees a placeholder or "Coming soon" message indicating future functionality

---

### Edge Cases

- What happens when a wholesale seller has no customers assigned yet? (They should be able to create their first customer before making sales)
- What happens when a product has no wholesale price defined? (System should prevent adding the product to wholesale sales or display a clear error)
- What happens when a wholesale seller attempts to access retail seller routes directly via URL manipulation? (System should redirect to dashboard or show access denied)
- What happens when stock is insufficient for a wholesale sale? (Same validation as retail sales - prevent or warn before completing transaction)
- What happens when a wholesale seller tries to select a retail customer for a wholesale sale? (Only wholesale customers should appear in the selection)
- What happens if the wholesale pricing is higher than retail pricing due to data error? (System should allow the sale but may flag for admin review)

## Requirements *(mandatory)*

### Functional Requirements

#### Authentication & Authorization

- **FR-001**: System MUST support a new user role called "Vendedor Mayorista" (wholesale seller)
- **FR-002**: System MUST authenticate wholesale seller users and maintain their session with role information
- **FR-003**: System MUST display a role-specific menu for wholesale sellers showing only: Ventas Mayorista, Clientes, and Cuenta Corriente
- **FR-004**: System MUST prevent wholesale sellers from accessing retail seller features (credit sales, retail customer management, retail pricing)
- **FR-005**: System MUST prevent wholesale sellers from accessing administrator features (user management, system configuration, commission settlement)

#### Wholesale Sales

- **FR-006**: System MUST provide a "Ventas Mayorista" interface for creating and completing wholesale sales
- **FR-007**: System MUST display wholesale prices (precio_mayorista) for all products when accessed by wholesale sellers
- **FR-008**: System MUST allow wholesale sellers to add products to a sale quote
- **FR-009**: System MUST calculate sale totals using wholesale pricing
- **FR-010**: System MUST register all wholesale sales as cash-only transactions (no credit or installment options)
- **FR-011**: System MUST associate each wholesale sale with a wholesale customer from the seller's portfolio
- **FR-012**: System MUST record which wholesale seller made each sale for commission and reporting purposes
- **FR-013**: System MUST decrement product stock when a wholesale sale is completed
- **FR-014**: System MUST validate stock availability before completing a wholesale sale

#### Customer Management

- **FR-015**: System MUST allow wholesale sellers to view their portfolio of wholesale customers
- **FR-016**: System MUST allow wholesale sellers to create new wholesale customers
- **FR-017**: System MUST allow wholesale sellers to edit their existing wholesale customers
- **FR-018**: System MUST designate customers as wholesale type when created by wholesale sellers
- **FR-019**: System MUST isolate customer portfolios so wholesale sellers can only see their own customers
- **FR-020**: System MUST prevent wholesale sellers from viewing or accessing retail customers
- **FR-021**: System MUST assign new wholesale customers to the wholesale seller who created them

#### Account Statement (Placeholder)

- **FR-022**: System MUST display a "Cuenta Corriente" menu item for wholesale sellers
- **FR-023**: System MUST provide a placeholder page or "Coming soon" message for the account statement feature

### Key Entities

- **Vendedor Mayorista (Wholesale Seller)**: A user role with permissions to create wholesale sales using wholesale pricing, manage their own wholesale customer portfolio, and view their account statement. Cannot grant credit or access retail pricing.

- **Cliente Mayorista (Wholesale Customer)**: A customer designated as wholesale type, associated with a specific wholesale seller. Can only be selected for wholesale sales and appears only in the seller's own customer portfolio.

- **Venta Mayorista (Wholesale Sale)**: A cash-only sale transaction using wholesale pricing. Contains: associated wholesale customer, wholesale seller who made the sale, list of products sold with wholesale prices, total amount, transaction date, and payment status (always cash/completed).

- **Precio Mayorista (Wholesale Price)**: The wholesale price attribute of each product. Used exclusively for sales made by wholesale sellers. Must be present for products to be sold via wholesale channel.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Wholesale sellers can complete a full sales transaction (product selection to final sale registration) in under 3 minutes for a typical order of 5 items
- **SC-002**: 100% of wholesale sales are recorded with wholesale pricing (no accidental use of retail pricing)
- **SC-003**: 100% of wholesale sales are recorded as cash transactions (no credit options available)
- **SC-004**: Wholesale sellers can only view and select from their own customer portfolio (0% cross-seller customer access)
- **SC-005**: Wholesale seller menu displays only authorized options (Ventas Mayorista, Clientes, Cuenta Corriente) with no access to retail or admin features
- **SC-006**: All wholesale sales correctly decrement product stock in real-time
- **SC-007**: 95% of wholesale sellers successfully complete their first sale without assistance after a 5-minute orientation
- **SC-008**: Zero security incidents related to wholesale sellers accessing unauthorized features or data

## Assumptions *(optional)*

### Business Logic Assumptions

1. **Customer Assignment**: Wholesale customers are permanently assigned to the wholesale seller who created them (no reassignment without admin intervention)
2. **Pricing Availability**: All products available for wholesale sale have wholesale prices defined in the system
3. **Payment Terms**: All wholesale sales must be completed as cash transactions at point of sale (no payment terms or invoicing for future implementation via Cuenta Corriente)
4. **Commission Calculation**: Wholesale sales generate seller commissions (calculation details to be handled in future Cuenta Corriente implementation)

### Technical Assumptions

1. **Authentication System**: Existing JWT-based authentication can support the new wholesale seller role with minimal modification
2. **Backend Endpoints**: Backend already provides `/articulos`, `/clientes`, and `/ventas-mayorista` endpoints (or can be extended to do so)
3. **Product Data Model**: Products already include a `precio_mayorista` field in the database
4. **Customer Data Model**: Customer entity can be extended with a customer type field (retail vs wholesale) and seller assignment

### UI/UX Assumptions

1. **Menu System**: Existing menu/navigation component supports role-based rendering
2. **Sales Flow Reuse**: The wholesale sales interface can reuse components from the existing `/buscar-articulos-presupuesto` retail flow with modifications to remove credit/installment features
3. **Customer Management Reuse**: Wholesale customer management can reuse existing customer management components with filtering by seller and customer type

## Out of Scope *(optional)*

The following are explicitly NOT included in this feature:

1. **Account Statement Implementation**: The "Cuenta Corriente" menu item is a placeholder only. Actual account statement features (viewing commissions, account movements, balances) are not implemented in this phase.
2. **Credit Sales for Wholesale**: Wholesale sellers cannot grant credit or create installment payment plans. All sales must be cash.
3. **Commission Settlement**: While wholesale sales are recorded with seller information for future commission calculation, the actual commission settlement process is not part of this feature.
4. **Wholesale Customer Migration**: Any migration of existing customers to wholesale type or reassignment of customers between sellers is not included.
5. **Wholesale-Specific Reports**: General sales reports may include wholesale sales data, but wholesale-specific reporting features are not part of this phase.
6. **Bulk Sales or Special Orders**: The wholesale sales interface supports standard product selection only. Special workflows for bulk orders or custom pricing are not included.
7. **Multi-User Role Assignment**: Users are assigned a single role. A user cannot be both a retail seller and wholesale seller simultaneously.

## Constitutional Compliance *(optional)*

This feature aligns with the ElectroVenza Constitution:

- **Principle I - Role-Based Authorization First**: Implements strict role-based access for the new wholesale seller role with appropriate permission isolation
- **Principle II - Dual Pricing Architecture**: Enforces use of wholesale pricing (precio_mayorista) for all wholesale sales
- **Principle III - Client Portfolio Isolation**: Ensures each wholesale seller manages only their own wholesale customer portfolio
- **Principle IV - Credit vs Cash Flow Separation**: Implements cash-only sales for wholesale sellers (no credit capability)
- **Principle V - Stock and Inventory Integrity**: Maintains stock decrements on wholesale sale completion with validation before sale
