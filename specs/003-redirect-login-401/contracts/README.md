# Contracts: Redirect to Login on API 401 Unauthorized

No new API contracts are introduced by this feature.

## Relevant Existing Contract

The feature depends on the backend returning HTTP 401 status
codes when the JWT token is expired, missing, or invalid.

### Expected Backend Behavior

- **HTTP 401 Unauthorized**: Token is expired, missing, or
  malformed. The frontend MUST redirect to login.
- **HTTP 403 Forbidden**: User is authenticated but lacks
  permission for the requested resource. The frontend MUST NOT
  redirect to login (handled separately by role guards).

No changes to backend contracts are required.
