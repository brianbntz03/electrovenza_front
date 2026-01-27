<!--
Sync Impact Report:
- Version change: v1.0.0 → v1.1.0
- Modified principles: None renamed
- Added sections:
  * Principle VI: API 401 Unauthorized Redirect
- Removed sections: None
- Templates requiring updates:
  ✅ .specify/templates/plan-template.md (Constitution Check updated
     with new 401 redirect principle)
  ✅ .specify/templates/spec-template.md (reviewed, no changes needed)
  ✅ .specify/templates/tasks-template.md (reviewed, no changes needed)
  ✅ .specify/templates/checklist-template.md (reviewed, no changes needed)
  ⚠ Commands templates not present (will be created when needed)
- Follow-up TODOs: None
-->

# ElectroVenza Front End Constitution

## Core Principles

### I. Role-Based Authorization First

Every feature MUST respect the three-role hierarchy of the ElectroVenza system:

- **Administrador**: Full system access including user management, system configuration, commission settlement, account management, and account movements
- **Vendedor Minorista**: Retail sales (cash and credit), credit assignment with installment payments, access to own retail customer portfolio, retail pricing
- **Vendedor Mayorista**: Wholesale sales (cash only), no credit granting capability, access to own wholesale customer portfolio, wholesale pricing

**Non-negotiable rules**:
- UI components MUST check user role before rendering restricted features
- API calls MUST validate role permissions on the backend
- Routing MUST prevent unauthorized access to role-specific pages
- Each role's capabilities MUST NOT overlap inappropriately (e.g., wholesale sellers cannot grant credits)

**Rationale**: The business model depends entirely on strict separation of retail vs wholesale operations and proper commission/account tracking per seller.

### II. Dual Pricing Architecture

The system MUST maintain and enforce two distinct pricing tiers:

- **Precio Minorista**: Retail price for Vendedor Minorista sales
- **Precio Mayorista**: Wholesale price for Vendedor Mayorista sales

**Non-negotiable rules**:
- Product data models MUST include both price types
- UI MUST display the correct price based on logged-in user role
- Sales transactions MUST record which price tier was used
- Price calculations for reports MUST use the transaction-recorded price tier

**Rationale**: Accurate profit calculation and commission settlement depend on correct price tier application at the point of sale.

### III. Client Portfolio Isolation

Each seller (Minorista or Mayorista) MUST have an isolated customer portfolio:

**Non-negotiable rules**:
- Vendedor Minorista can only view/manage their own retail clients
- Vendedor Mayorista can only view/manage their own wholesale clients
- Cross-seller customer access is prohibited (except for Administrador)
- Customer assignment to seller MUST be immutable after first sale (or require admin approval to change)

**Rationale**: Sales commission accuracy and seller accountability require strict customer-to-seller relationships.

### IV. Credit vs Cash Flow Separation

The system MUST clearly separate cash sales from credit sales:

**Non-negotiable rules**:
- Credit sales are ONLY available to Vendedor Minorista
- Credit sales MUST define installment terms (number of payments, amounts, dates)
- Cash sales MUST be immediately recorded as completed
- Wholesale sales (Vendedor Mayorista) are ALWAYS cash-only
- Payment tracking for credits MUST maintain full audit trail

**Rationale**: Financial integrity depends on correct recording of payment terms, outstanding balances, and commission eligibility.

### V. Stock and Inventory Integrity

Product inventory MUST be accurate and consistent:

**Non-negotiable rules**:
- Stock levels MUST decrement atomically on confirmed sale
- Product CRUD operations MUST validate stock before allowing sales
- Image management MUST be tied to product lifecycle
- Category changes MUST not orphan products
- Out-of-stock products MUST prevent new sales (or warn explicitly)

**Rationale**: Business operations fail if inventory is inaccurate; customer trust depends on product availability accuracy.

### VI. API 401 Unauthorized Redirect

When any frontend API call receives an HTTP 401 (Unauthorized) response, the application MUST redirect the user to the login screen:

**Non-negotiable rules**:
- Every `fetch` call to `${apiRest}` endpoints MUST handle 401 status codes
- On receiving a 401 response, the frontend MUST clear all authentication state from localStorage (`jwt_token`, `user_role`, `user_id`, and related keys)
- After clearing auth state, the frontend MUST redirect the user to the login view
- 401 handling MUST be centralized (e.g., a shared fetch wrapper or interceptor) rather than duplicated in each component or service file
- No API call is exempt from 401 handling; partial implementations scattered across individual components are non-compliant

**Rationale**: Expired or invalidated JWT tokens leave the user in a broken state where API calls silently fail. Centralized 401 interception ensures consistent session expiry behavior, prevents data loss from unhandled auth failures, and provides a clear UX path back to authentication.

## Role-Based Access Control

### Access Matrix

| Feature                          | Administrador | Vendedor Minorista | Vendedor Mayorista |
|----------------------------------|---------------|--------------------|--------------------|
| User Management                  | ✅            | ❌                 | ❌                 |
| System Configuration             | ✅            | ❌                 | ❌                 |
| Commission Settlement            | ✅            | ❌                 | ❌                 |
| Seller Account Management        | ✅            | View Own           | View Own           |
| Account Movements                | ✅            | View Own           | View Own           |
| Retail Sales (Cash)              | ✅            | ✅                 | ❌                 |
| Retail Sales (Credit)            | ✅            | ✅                 | ❌                 |
| Wholesale Sales (Cash)           | ✅            | ❌                 | ✅                 |
| Customer Portfolio (Retail)      | ✅ (All)      | ✅ (Own)           | ❌                 |
| Customer Portfolio (Wholesale)   | ✅ (All)      | ❌                 | ✅ (Own)           |
| Product Management               | ✅            | View Only          | View Only          |
| Category Management              | ✅            | View Only          | View Only          |
| Sales Reports                    | ✅ (All)      | ✅ (Own)           | ✅ (Own)           |
| Profit Reports                   | ✅            | ❌                 | ❌                 |

### Implementation Requirements

- Frontend routing MUST use role-based guards
- UI elements MUST conditionally render based on user role
- Backend API MUST enforce permissions independently of frontend (defense in depth)
- Audit logs MUST track role-based actions for compliance

## Development Workflow

### Technology Stack

- **Framework**: React 19.1.0
- **Routing**: React Router DOM 7.0.2
- **UI Libraries**: FontAwesome, SweetAlert2
- **Charts**: Chart.js + react-chartjs-2
- **Date Handling**: date-fns
- **Authentication**: JWT (jwt-decode)
- **Testing**: React Testing Library (via react-scripts)
- **Build Tool**: Create React App (react-scripts)

### Code Organization

- Components MUST be organized by feature/domain, not by technical type
- Shared components MUST be truly reusable (used in 3+ places)
- Role-specific UI logic MUST be co-located with the feature, not scattered
- API integration MUST use consistent patterns (service layer recommended)

### Testing Requirements

- Role-based access controls MUST have test coverage
- Price calculation logic MUST have test coverage
- Critical user journeys (sales, credit assignment, payment recording) MUST have integration tests
- Edge cases (out-of-stock, invalid credit terms, unauthorized access) MUST be tested

### Simplicity Over Complexity

- Start with the simplest solution that works
- Avoid premature abstraction (wait for 3+ use cases before creating shared utilities)
- Prefer explicit, readable code over clever one-liners
- Remove unused code immediately (no commented-out blocks)

## Governance

### Amendment Procedure

1. Proposed changes MUST be documented with rationale
2. Changes MUST include impact analysis on existing features
3. Breaking changes REQUIRE migration plan and user communication
4. Constitution version MUST be updated following semantic versioning:
   - **MAJOR**: Role model changes, pricing model changes, incompatible authorization changes
   - **MINOR**: New principles added, expanded guidance, new mandatory sections
   - **PATCH**: Clarifications, typo fixes, non-semantic improvements

### Compliance Review

- All feature specifications MUST reference relevant constitutional principles
- All implementation plans MUST include "Constitution Check" section
- Code reviews MUST verify role-based access control implementation
- PRs introducing complexity MUST justify the need vs simpler alternatives

### Documentation Requirements

- API contracts MUST document required roles for each endpoint
- Component documentation MUST indicate role-based rendering logic
- Setup guides MUST explain role creation and assignment
- User documentation MUST clearly explain role capabilities

### Versioning Policy

All dates in ISO 8601 format (YYYY-MM-DD).

**Version**: 1.1.0 | **Ratified**: 2025-12-29 | **Last Amended**: 2026-01-26
