# Data Model: Redirect to Login on API 401 Unauthorized

**Branch**: `003-redirect-login-401` | **Date**: 2026-01-26

## Overview

This feature introduces no new data entities. It operates on the
existing authentication state stored in the browser's localStorage.

## Affected State

### localStorage Authentication Keys

| Key               | Type   | Set By            | Cleared On 401 |
|-------------------|--------|-------------------|----------------|
| `jwt_token`       | String | FormularioLogin   | Yes            |
| `user_role`       | String | FormularioLogin   | Yes            |
| `user_name`       | String | FormularioLogin   | Yes            |
| `user_id`         | String | FormularioLogin   | Yes            |
| `vendedor_id`     | String | FormularioLogin   | Yes            |
| `vendedor_nombre` | String | FormularioLogin   | Yes            |

### Module-Level State (Fetch Wrapper)

| Variable         | Type    | Purpose                              |
|------------------|---------|--------------------------------------|
| `isRedirecting`  | Boolean | Prevents multiple simultaneous 401   |
|                  |         | redirects from triggering navigation |
|                  |         | more than once.                      |

## State Transitions

```text
[Authenticated]
    │
    ▼ (API call returns 401)
[Clear localStorage] ──► [isRedirecting = true]
    │
    ▼
[Redirect to login page]
    │
    ▼
[Login form displayed] ──► [User re-authenticates]
    │
    ▼
[Authenticated again]
```

## No New API Endpoints

This feature does not introduce any new backend API endpoints.
It operates entirely on the frontend by wrapping the existing
`fetch()` calls with a centralized response interceptor.
