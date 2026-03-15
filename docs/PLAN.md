# Advanced Personalization Implementation Plan

Enhance the blog's design system with typography controls, border geometry presets, and glassmorphism intensity adjustments.

## Phase 1: Foundation (Database & Architecture)
- **Agent:** `database-architect`
- **File:** `lib/db.ts`
- **Tasks:**
    - Extend `BlogTheme` interface with:
        - `headingFont`: 'sans' | 'serif'
        - `bodyFont`: 'sans' | 'serif'
        - `borderRadiusPreset`: 'none' | 'small' | 'medium' | 'large'
        - `glassIntensity`: number (0-100)
    - Update `getTheme` to include these defaults in the merge logic.

## Phase 2: Core Styling (Provider & CSS)
- **Agent:** `frontend-specialist`
- **Files:** `components/providers/ThemeProvider.tsx`, `app/globals.css`
- **Tasks:**
    - **ThemeProvider:** Map internal states to CSS variables:
        - `--font-heading`: 'Inter' (sans) or 'Playfair Display' (serif)
        - `--font-body`: 'Inter' (sans) or 'Playfair Display' (serif)
        - `--radius-factor`: 0rem (none), 0.5rem (small), 1rem (medium), 2rem (large)
        - `--glass-blur`: Calculated based on 0-100 intensity.
    - **Global CSS:** 
        - Apply `--font-heading` to `h1-h6`.
        - Apply `--font-body` to `body` and `p`.
        - Dynamize `--radius-xl` and `--radius-2xl` using calc with `--radius-factor`.
        - Update `.glass-header` with dynamic blur variable.

## Phase 3: Admin Experience (Tooling)
- **Agent:** `frontend-specialist`
- **File:** `components/admin/ThemeCustomizer.tsx`
- **Tasks:**
    - Add "Tipografia" section with selects for Heading/Body.
    - Add "Geometria" section with radius presets.
    - Add "Efeitos" section with a range slider for Header Glass Intensity.
    - Ensure all new fields use the established fallback/reset logic.

## Phase 4: Verification
- **Agent:** `performance-optimizer`
- **Tasks:**
    - Verify no layout shifts occur when switching fonts.
    - Audit accessibility contrast if fonts change drastically.
    - Ensure glassmorphism doesn't degrade performance on lower-end devices at high intensity.

## Verification Plan
### Manual Verification
- Toggle Sans/Serif and check sitewide changes.
- Switch between "None" and "Large" radius to confirm all containers/buttons react correctly.
- Adjust glass intensity from 0 to 100 on the header.
