# Project Orchestration Plan: Admin & Backend Implementation

**Context:**
- **User Request:** "vamos criar um backend e uma pagina de admin com rota protegida... nessa pagina de admin o admin vai poder trocar nome do blog add noticias artigos e alterações em geral"
- **Project Type:** Full Stack Next.js App
- **Stack Decision:** Firebase (Auth, Firestore) for rapid development and scalability.

## Agents Involved
1. **project-planner**: Architectural setup and task breakdown.
2. **security-auditor**: Authentication logic and route protection.
3. **backend-specialist**: Firebase/Firestore integration and API helpers.
4. **frontend-specialist**: Dashboard UI, forms, and settings management.

## Phase 1: Foundation (Planning & Setup)
- [ ] Initialize `docs/PLAN.md` (Current).
- [ ] Configure Firebase Client SDK in `lib/firebase.ts`.
- [ ] Define Firestore Schema for `articles` and `settings`.

## Phase 2: Security & Identity
- [ ] Implement `useAuth` hook for session management.
- [ ] Create `AdminGuard` component for route protection.
- [ ] Implement `/admin/login` page with "High-End" aesthetic.

## Phase 3: Dashboard & Content Management
- [ ] Create `/admin/dashboard` with site settings (e.g., Blog Name).
- [ ] Implement Article CRUD (Create, Read, Update, Delete).
- [ ] Connect frontend components (`HomeClient`, `Navbar`) to fetch data from Firestore instead of mock data.

## Phase 4: Verification
- [ ] Run `security_scan.py`.
- [ ] Functional testing of all admin features.
- [ ] Visual regression check on mobile.
