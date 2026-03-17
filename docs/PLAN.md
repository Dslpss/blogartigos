# Security Resolution Plan: Admin Dashboard Exposure

Migrate from client-side only protection to server-side middleware and context-aware UI rendering to resolve critical accessibility issues.

## User Review Required

> [!IMPORTANT]
> **Next.js Middleware Adoption**: I propose shifting administrative route protection to `middleware.ts`. This will ensure that unauthorized users are redirected *before* the page even starts to render, preventing HTTP 200 responses for sensitive paths.

## Proposed Changes

### [Backend/Infra] Authentication & Routing
- **[NEW] middleware.ts**: Intercept all requests to `/admin/*`. Check for auth tokens/sessions. Redirect unauthorized users to `/admin/login` or `/`.
- **[MODIFY] auth-context.ts**: Optimize role detection for the new middleware flow.

### [Frontend] UI Components
- **[MODIFY] Navbar.tsx**: Wrap the "Hidden Admin Link" in a role check (`{isAdmin && ...}`) so it's not present in the HTML source for regular users.
- **[MODIFY] Footer.tsx**: Audit and secure all navigation links.

## Verification Plan

### Automated
- Run `python .agent/scripts/checklist.py .`

### Manual
- Attempt to navigate to `/admin/dashboard` in an Incognito window (should redirect).
- Inspect the page source of the Homepage (`/`) to ensure no admin URLs are leaked.
- Log in as a standard user and verify the admin link remains hidden.
