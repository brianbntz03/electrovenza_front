# Research: Redirect to Login on API 401 Unauthorized

**Branch**: `003-redirect-login-401` | **Date**: 2026-01-26

## R1: Current API Call Architecture

### Decision
The codebase uses native `fetch()` API directly in 60 files
(106 total fetch calls to `${apiRest}`). There is no centralized
HTTP client or request wrapper.

### Findings
- **Service layer**: 3 service files exist
  (`articulosService.js`, `clientesService.js`, `ventasService.js`)
  but they only cover wholesale features.
- **Inline fetch**: The majority of API calls (57 component files)
  use inline `fetch()` directly.
- **Auth header pattern**: Most calls use
  `Authorization: Bearer ${localStorage.getItem("jwt_token")}`.
- **Inconsistency**: `clientesService.js` uses `auth_token` in
  `createWholesaleCustomer()` and `updateCustomer()`, while
  everywhere else uses `jwt_token`.
- **Missing auth**: `CuotasVencidas.js` has 2 fetch calls without
  any Authorization header.

### Rationale for Wrapper Approach
Given 60 files and 106 call sites, modifying each individually is
impractical and error-prone. A centralized fetch wrapper that
intercepts all responses is the only viable approach to achieve
SC-001 (100% coverage).

### Alternatives Considered
1. **Modify each file individually** — Rejected: 106 call sites,
   high risk of missing some, maintenance nightmare.
2. **Service Worker interceptor** — Rejected: Over-engineered for
   this use case, adds complexity to debugging.
3. **Axios with interceptors** — Rejected: Would require adding a
   new dependency and rewriting all 106 fetch calls to use axios.
4. **Centralized fetch wrapper function** — **Selected**: Create a
   single wrapper around `fetch()` that all files import. Existing
   calls are migrated to use the wrapper. The wrapper checks for
   401 on every response.

## R2: Current 401 Handling

### Decision
Only 2 files have explicit 401 handling; both use the same pattern.

### Findings
- `articulo-presupuesto.js` (line 360-365): Checks
  `response.status === 401`, clears `jwt_token`, `user_role`,
  `user_id` from localStorage, redirects via
  `window.location.href = "/login"`.
- `articulo-presupuesto-Contado.js` (line 504-509): Identical
  pattern.
- Both use `window.location.href` (full page reload) instead of
  React Router `navigate()`.
- Both only clear 3 of 6 localStorage keys (missing `user_name`,
  `vendedor_id`, `vendedor_nombre`).

### Rationale
The existing pattern is partially correct but incomplete. The
centralized wrapper will:
- Clear ALL 6 localStorage keys on 401.
- Use `window.location.href` for redirect (simpler than threading
  React Router's `navigate()` through a utility function, and a
  full reload cleanly resets all React state).

## R3: Login Endpoint Exemption

### Decision
The login endpoint (`/auth/login`) must be exempt from 401
redirect to avoid redirect loops.

### Findings
- `FormularioLogin.js` (line 29) calls
  `fetch(\`${apiRest}/auth/login\`, ...)`.
- A 401 from this endpoint means "invalid credentials", not
  "expired session".
- The login component already handles this case with an error
  flash message (line 63).

### Approach
The wrapper function will accept an options parameter to skip 401
interception. The login call will pass this flag. Alternatively,
since the login form is only shown when `isAuthenticated === false`
(i.e., localStorage is already clear), a 401 redirect from login
would simply reload the same page — harmless but unnecessary.
The simpler approach: always intercept 401, but since
`FormularioLogin` only renders when not authenticated, the redirect
to login is a no-op (user is already there).

### Decision
Use the simpler approach: the wrapper always intercepts 401. On
the login page, the user is already unauthenticated, so the
redirect simply reloads the login page. No special exemption
logic needed. This aligns with the Simplicity principle.

## R4: Multiple Simultaneous 401 Responses

### Decision
Use a module-level flag to prevent multiple redirects.

### Findings
- Pages like `articulo-presupuesto.js` make 3-4 API calls on
  mount (vendors, articles, clients, quotes).
- If all return 401 simultaneously, each would trigger the
  redirect logic.
- `window.location.href = "/login"` is idempotent — setting it
  multiple times in the same event loop tick results in a single
  navigation. However, the localStorage clearing and any
  intermediate side effects would still fire multiple times.

### Approach
A simple boolean flag (`let isRedirecting = false`) in the
wrapper module prevents duplicate processing. First 401 sets the
flag and triggers redirect; subsequent 401s are no-ops.

## R5: Navigation Method

### Decision
Use `window.location.href` for the 401 redirect.

### Alternatives Considered
1. **React Router `navigate()`** — Rejected: The wrapper is a
   plain JS module, not a React component. Threading `navigate()`
   from the Router context into a utility function adds complexity
   (would need a NavigationContext provider or similar pattern).
2. **`window.location.href = "/login"`** — **Selected**: Simple,
   works from any context, causes a full page reload which cleanly
   resets all React state (beneficial after an auth failure). The
   app already uses basename `/gestion`, so the redirect needs to
   account for this.

### Path Consideration
- `index.js` sets `<BrowserRouter basename="/gestion">`.
- Current 401 handlers use `window.location.href = "/login"`.
- The app renders `FormularioLogin` when `isAuthenticated` is
  false (at the root route `/`).
- Redirecting to `/gestion/` (or simply `/`) after clearing the
  token will show the login form since `isAuthenticated` becomes
  false without a valid token.
- **Final approach**: `window.location.href = "/"` to go to the
  app root, which renders the login form since auth state is
  cleared. Or use the current pattern `/login` if a login route
  exists.

## R6: localStorage Keys to Clear

### Decision
Clear all 6 authentication-related localStorage keys on 401.

### Complete Key List (from FormularioLogin.js lines 49-56)
1. `jwt_token` — JWT authentication token
2. `user_role` — User role for authorization
3. `user_name` — Username for display
4. `user_id` — User ID
5. `vendedor_id` — Seller ID
6. `vendedor_nombre` — Seller name

### Note
The existing 401 handlers only clear 3 keys (`jwt_token`,
`user_role`, `user_id`). The centralized wrapper will clear all 6
to ensure no stale data remains (per SC-003).
