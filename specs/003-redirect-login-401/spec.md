# Feature Specification: Redirect to Login on API 401 Unauthorized

**Feature Branch**: `003-redirect-login-401`
**Created**: 2026-01-26
**Status**: Draft
**Input**: User description: "cuando el front end llama a la api y recibe como respuesta un status code 401 (unauthorized), debe redireccionar al usuario a la pagina de /login"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Session Expired During Normal Use (Priority: P1)

A logged-in user (any role: Administrador, Vendedor Minorista, or Vendedor Mayorista) is actively using the application. Their JWT token expires or is invalidated by the backend. The next time any page or action triggers an API call, the system detects the 401 response and immediately redirects the user to the login page so they can re-authenticate.

**Why this priority**: This is the core requirement. Without centralized 401 handling, users encounter silent failures where the UI breaks or shows empty data with no indication of what went wrong. This story delivers the primary value of the feature.

**Independent Test**: Can be fully tested by letting a user's token expire and then performing any API-dependent action (e.g., loading a product list). The system should redirect to /login instead of showing an error or blank page.

**Acceptance Scenarios**:

1. **Given** a logged-in user whose JWT token has expired, **When** the application makes any API call that returns HTTP 401, **Then** the user is redirected to the login page.
2. **Given** a logged-in user whose JWT token has expired, **When** the 401 response is received, **Then** all stored authentication data (token, role, user information) is cleared before redirecting.
3. **Given** a logged-in user whose JWT token has expired, **When** multiple API calls on the same page return 401 simultaneously, **Then** the redirect to login occurs only once (no duplicate redirects or flickering).

---

### User Story 2 - Consistent Behavior Across All Application Sections (Priority: P2)

The 401 redirect behavior works identically regardless of which section of the application the user is in. Whether the user is on retail sales, wholesale sales, customer management, product listings, reports, or any other page, the same redirect behavior applies.

**Why this priority**: The current codebase has 401 handling in only 2 of 86+ files making API calls. This story ensures the solution is centralized and covers every API call uniformly, eliminating the inconsistency.

**Independent Test**: Can be tested by triggering expired-token scenarios from at least 5 different application sections (e.g., product listing, wholesale sale, customer list, reports, user management) and verifying each one redirects to login.

**Acceptance Scenarios**:

1. **Given** an expired token, **When** the user loads the wholesale sales page which calls the API, **Then** the user is redirected to login.
2. **Given** an expired token, **When** the user loads the customer management page which calls the API, **Then** the user is redirected to login.
3. **Given** an expired token, **When** the user is on any page and submits a form that calls the API, **Then** the user is redirected to login (the form submission does not proceed with stale credentials).

---

### Edge Cases

- What happens if the login page itself is the current page and a 401 is received? The system MUST NOT enter a redirect loop. The login API call (authentication request) should be exempt from the 401 redirect since a 401 on login means invalid credentials, not an expired session.
- What happens if the user has multiple browser tabs open and the token expires? Each tab should independently redirect to login upon its next API call.
- What happens if the user is in the middle of filling out a sale form and the token expires? The redirect occurs on the next API call; unsaved form data in local state is lost. This is acceptable since the session is no longer valid.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST intercept all API responses from backend endpoints and check for HTTP status code 401.
- **FR-002**: On receiving a 401 response, the system MUST remove all authentication-related data from local storage (token, user role, user ID, and any other session-related keys).
- **FR-003**: After clearing authentication data, the system MUST redirect the user to the `/login` route.
- **FR-004**: The 401 interception MUST be centralized so that every API call in the application is covered without requiring per-component or per-service handling.
- **FR-005**: The login endpoint itself (authentication request) MUST be exempt from the 401 redirect to avoid redirect loops when login credentials are incorrect.
- **FR-006**: When multiple simultaneous API calls return 401, the system MUST redirect only once, preventing duplicate navigation attempts.

### Assumptions

- The backend returns HTTP 401 specifically when the JWT token is expired, missing, or invalid. Other authorization failures (e.g., insufficient role permissions) return a different status code (such as 403 Forbidden).
- The login page route is `/login` (or the root `/` where the login form renders when unauthenticated).
- No "remember me" or automatic token refresh mechanism is in scope for this feature. The user must re-enter credentials after a 401 redirect.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of API calls in the application are covered by the 401 interception mechanism, with zero API calls bypassing it.
- **SC-002**: When a 401 response occurs, the user sees the login page within 1 second, with no intermediate error screens or blank pages.
- **SC-003**: After a 401 redirect, no stale authentication data remains in the browser's local storage.
- **SC-004**: The login page functions normally after a 401 redirect, allowing the user to authenticate and resume using the application.
