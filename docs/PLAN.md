# PLAN: Fix Post-Deployment Auth & Assets

The application is deployed on Railway but facing Auth issues (Domain not authorized) and a missing favicon.

## User Actions Required (CRITICAL)
- [ ] **Firebase Console:** Go to `Authentication -> Settings -> Authorized domains` and add `blogartigos-production.up.railway.app`.
- [ ] **Railway Dashboard:** Double check that all 8 environment variables from `.env.example` are accurately added.

## Proposed Changes

### 1. `security-auditor` (Auth Check)
- Verify if the Firebase initialization in `lib/firebase.ts` handles environment variables correctly.
- Check if `NEXT_PUBLIC_SUPER_ADMIN_EMAIL` is detected correctly in production.

### 2. `frontend-specialist` (Favicon & Theme Fix)
- Create `public/` directory (missing).
- Generate a premium `favicon.ico` using the new color palette:
  - **Primary:** Institutional Blue
  - **Accent:** Sustainability Green
  - **Highlights:** Light Yellow
- Refactor `globals.css` to implement this institutional identity across the site.
- Ensure the premium glassmorphism and animations remain but with the new color tones.

### 3. `devops-engineer` (Deployment Check)
- Verify `next.config.js` and build process.
- Ensure the new `public/` folder is correctly picked up by Railway.

## Verification
- [ ] Successful login on the Railway production URL.
- [ ] Favicon appearing in the browser tab.
- [ ] Site visual matching the new institutional identity.
