# Implementation Plan: Redirect to Login on API 401 Unauthorized

**Branch**: `003-redirect-login-401` | **Date**: 2026-01-26 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-redirect-login-401/spec.md`

## Summary

When any frontend API call receives an HTTP 401 (Unauthorized) response, the
application must clear authentication state and redirect the user to the login
page. The approach is to create a centralized fetch wrapper (`authenticatedFetch`)
that all 60 files in the codebase use instead of calling `fetch()` directly. This
eliminates the current state where only 2 of 106 API call sites handle 401.

## Technical Context

**Language/Version**: JavaScript ES6+ (React 19.1.0)
**Primary Dependencies**: React 19.1.0, React Router DOM 7.0.2, native fetch API
**Storage**: localStorage (browser) for auth state; no backend storage changes
**Testing**: React Testing Library (via react-scripts)
**Target Platform**: Web browser (SPA)
**Project Type**: Single frontend project (Create React App)
**Performance Goals**: 401 redirect must occur within 1 second (SC-002)
**Constraints**: No new dependencies; must use existing fetch API pattern
**Scale/Scope**: 60 files, 106 fetch call sites to migrate

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with [.specify/memory/constitution.md]:

- [x] **Role-Based Authorization**: This feature applies equally to all three
  roles. A 401 redirect is role-agnostic — any user with an expired token gets
  redirected regardless of role.
- [x] **Dual Pricing**: Not applicable. This feature does not affect pricing logic.
- [x] **Client Portfolio Isolation**: Not applicable. This feature does not affect
  customer-seller relationships.
- [x] **Credit vs Cash Flow**: Not applicable. This feature does not affect
  sales transaction types.
- [x] **Stock Integrity**: Not applicable. This feature does not affect inventory.
- [x] **API 401 Redirect**: This IS the implementation of Principle VI. The
  centralized fetch wrapper ensures every API call is covered (FR-004, SC-001).
- [x] **Testing**: The wrapper function and 401 interception logic will be testable.
  Migration of existing calls can be verified by checking no raw `fetch(apiRest...)`
  calls remain.
- [x] **Simplicity**: The wrapper approach is the simplest solution that provides
  100% coverage. A single module replaces scattered per-component handling.
  No new dependencies are introduced.

## Project Structure

### Documentation (this feature)

```text
specs/003-redirect-login-401/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (no new API contracts)
│   └── README.md
├── checklists/
│   └── requirements.md  # Spec quality checklist
├── spec.md              # Feature specification
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── utils/
│   └── authenticatedFetch.js    # NEW: Centralized fetch wrapper
├── service/
│   ├── apiRest.js               # Existing: API base URL config
│   ├── articulosService.js      # MODIFIED: Use authenticatedFetch
│   ├── clientesService.js       # MODIFIED: Use authenticatedFetch
│   └── ventasService.js         # MODIFIED: Use authenticatedFetch
├── Components/
│   ├── articulo-presupuesto.js         # MODIFIED: Use wrapper, remove inline 401
│   ├── articulo-presupuesto-Contado.js # MODIFIED: Use wrapper, remove inline 401
│   └── [56 other component files]      # MODIFIED: Use authenticatedFetch
├── pages/
│   └── [3 page files with fetch calls] # MODIFIED: Use authenticatedFetch
├── FormularioLogin.js                  # NOT MODIFIED: Uses direct fetch (login exempt)
└── App.js                              # NOT MODIFIED: Auth state management unchanged
```

**Structure Decision**: Single frontend project. One new utility file
(`src/utils/authenticatedFetch.js`) plus migration of all existing fetch calls
across 59 files (60 minus FormularioLogin.js which is exempt).

## Implementation Approach

### New Module: `src/utils/authenticatedFetch.js`

**Responsibilities:**
1. Wrap the native `fetch()` call with Authorization header injection.
2. After every response, check for HTTP 401 status.
3. On 401: clear all 6 localStorage keys, redirect to login via
   `window.location.href`.
4. Prevent duplicate redirects using a module-level boolean flag.
5. Return the response object to the caller for all non-401 statuses.

**Key Design Decisions (from research.md):**
- Uses `window.location.href` for redirect (not React Router `navigate()`)
  because the wrapper is a plain JS module, not a React component. A full page
  reload also cleanly resets all React state.
- No login-endpoint exemption logic needed: `FormularioLogin.js` will continue
  using direct `fetch()` since it's the only file where a 401 means "bad
  credentials" rather than "expired session".
- Module-level `isRedirecting` flag prevents multiple 401 responses from
  triggering multiple redirects.

### Migration Strategy

For each of the 59 files (excluding FormularioLogin.js):
1. Add `import { authenticatedFetch } from '../utils/authenticatedFetch';`
   (adjust relative path per file location).
2. Replace `fetch(\`${apiRest}/...\`, { headers: { Authorization: ... } })` with
   `authenticatedFetch(\`${apiRest}/...\`, { ... })` — the wrapper injects the
   Authorization header automatically.
3. Remove any existing 401-specific handling (in the 2 files that have it).
4. Remove now-unnecessary `localStorage.getItem("jwt_token")` references in
   headers (the wrapper handles this).

### Files Exempt from Migration

- `src/FormularioLogin.js` — Login endpoint: a 401 here means invalid
  credentials, handled by existing error message logic.

## Complexity Tracking

No constitution violations. The approach is the simplest available:
- One new file (utility wrapper)
- Mechanical migration of existing calls (no logic changes)
- No new dependencies
- No architectural changes to existing component structure
