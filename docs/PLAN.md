# PLAN: Floating Poll Widget Implementation

## Objective
Transform the `ActivePoll` component from a static section on the homepage into a persistent, floating widget available globally. This improves accessibility and engagement without interrupting the editorial flow.

## Architectural Changes
1. **Relocation**: Move `ActivePoll` call from `HomeClient.tsx` to `app/layout.tsx` (wrapped in a Client Component if necessary).
2. **Component Refactor**:
   - Add a `isExpanded` state to `ActivePoll.tsx`.
   - Implement a "Minimized" view (Pill/Button) that shows the poll title or an action icon.
   - Implement "Floating" CSS logic (fixed position, bottom-right).
   - Use Framer Motion for smooth expansion/tabs.

## Proposed Changes

### [Component] ActivePoll
#### [MODIFY] [ActivePoll.tsx](file:///d:/Projetos-Pessoais/BlogArtigos/components/features/ActivePoll.tsx)
- Add floating container wrapper (`fixed bottom-8 right-8 z-[100]`).
- Create `MinimizedPoll` sub-component.
- Add transition logic between minimized and expanded states.
- Ensure responsive behavior (smaller on mobile).

### [Layout] Global
#### [MODIFY] [layout.tsx](file:///d:/Projetos-Pessoais/BlogArtigos/app/layout.tsx)
- Import and include `ActivePoll` globally so it appears on all pages.

### [Feature] Home Page
#### [MODIFY] [HomeClient.tsx](file:///d:/Projetos-Pessoais/BlogArtigos/components/features/HomeClient.tsx)
- [DELETE] Static `ActivePoll` section to avoid duplication.

## Verification Plan
### Manual Verification
- [ ] Verify widget persists across navigation (Home -> Article -> About).
- [ ] Verify expansion/collapse animations are smooth.
- [ ] Verify background color (customized from Admin) is correctly applied to the widget.
- [ ] Test mobile responsiveness (preventing overlap with important UI elements).
