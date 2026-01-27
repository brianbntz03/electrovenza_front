# Quickstart: Redirect to Login on API 401 Unauthorized

**Branch**: `003-redirect-login-401` | **Date**: 2026-01-26

## What This Feature Does

When a user's JWT token expires or becomes invalid, any API call
will return HTTP 401. Previously, the application would silently
fail (showing empty data or errors). Now, the application
automatically detects the 401, clears the user's session data,
and redirects them to the login page.

## How to Test

### Manual Testing

1. Log in to the application with any role.
2. Open browser DevTools → Application → Local Storage.
3. Delete the `jwt_token` entry (simulates token expiration).
4. Navigate to any page that makes an API call (e.g., product
   list, sales page, customer management).
5. **Expected**: The application redirects to the login page.
6. Verify that all localStorage keys (`jwt_token`, `user_role`,
   `user_name`, `user_id`, `vendedor_id`, `vendedor_nombre`)
   are cleared.
7. Log in again and verify normal operation resumes.

### Edge Case Testing

- **Multiple API calls**: Load a page that makes multiple API
  calls simultaneously (e.g., the sales page). With an expired
  token, verify only one redirect occurs (no flickering).
- **Login page**: On the login page, enter wrong credentials.
  Verify you see the error message (not a redirect loop).
- **Multiple tabs**: Open the app in two tabs. Expire the token
  in one tab's DevTools. Perform an action in each tab. Both
  should redirect to login independently.

## Architecture

```text
Component/Service
    │
    ▼
authenticatedFetch(url, options)    ← New centralized wrapper
    │
    ├── Calls native fetch(url, options)
    │       with Authorization header injected
    │
    ▼
Response received
    │
    ├── Status 401? ──► Clear localStorage ──► Redirect to login
    │
    └── Other status? ──► Return response to caller (unchanged)
```

## Files Changed

- **New**: `src/utils/authenticatedFetch.js` — Centralized fetch
  wrapper with 401 interception.
- **Modified**: All 60 files that make `fetch()` calls to
  `${apiRest}` — Updated to import and use the wrapper instead
  of native `fetch()`.
- **Removed**: Inline 401 handling from
  `articulo-presupuesto.js` and `articulo-presupuesto-Contado.js`
  (now handled centrally).
