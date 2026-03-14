# Plan: Comunica Brasil Blog

Create a premium news and articles blog "Comunica Brasil" with a modern, high-performance architecture.

## Overview
A full-stack blog platform separating "News" (fast-paced) and "Articles" (long-form). The design focuses on "Technical Luxury" with sharp geometries and bold typography.

## Project Type: WEB

## Tech Stack
- **Framework**: Next.js 15 (App Router) - For SSR/SEO and performance.
- **Styling**: Tailwind CSS v4 - For modern utility-first CSS.
- **Data**: Firebase/Firestore (MCP) - For real-time updates and easy content management.
- **Animations**: Framer Motion - For staggered reveals and micro-interactions.
- **Fonts**: Playfair Display (Headers), Inter (Body).

## Design Commitment: "Technical Journalism"
- **Geometry**: Sharp edges (0px-2px) to evoke modern, paper-like professionalism.
- **Palette**: Deep Navy (#001F3F), High-Contrast White (#F8F9FA), Accent "Signal Orange" (#FF851B).
- **Layout**: Experimental Staggered Grid (breaking the grid to differentiate news fragments).
- **Motion**: Vertical narrative reveal on scroll; hover scale/glow for cards.

## File Structure
```
/
├── app/
│   ├── (blog)/
│   │   ├── layout.tsx
│   │   ├── page.tsx (Home - Slider + Latest)
│   │   ├── news/
│   │   │   └── [slug]/page.tsx
│   │   ├── articles/
│   │   │   └── [slug]/page.tsx
│   ├── contact/
│   │   └── page.tsx
├── components/
│   ├── ui/ (Menu, Button, Card)
│   ├── features/ (Slider, NewsGrid, ArticleList)
├── lib/
│   └── firebase.ts
├── styles/
│   └── globals.css
```

---

## 🎨 DESIGN COMMITMENT: TECHNICAL JOURNALISM

- **Topological Choice**: **ASYMMETRIC TENSION (60/40)** for the news feed, breaking the standard 3-column grid.
- **Risk Factor**: Sharp zero-pixel corners and overlapping text elements that might feel "edgy" compared to standard G1-style portals.
- **Readability Conflict**: Using High-Contrast Serif for headers which requires careful spacing to avoid clutter.
- **Cliché Liquidation**: Explicitly killed Bento Grids and Mesh Gradients.

---

## Task Breakdown
1. [ ] **Setup**: Initialize Next.js 15 + Tailwind v4 + Framer Motion.
   - Agent: `project-planner` | Skill: `app-builder`
2. [ ] **Theming**: Configure `globals.css` with Design Commitment tokens.
   - Agent: `frontend-specialist` | Skill: `frontend-design`
3. [ ] **Navigation**: Implement the Premium Side/Mobile Menu.
   - Agent: `frontend-specialist` | Skill: `frontend-design`
4. [ ] **Hero**: Create the "Premium Slider" for featured news.
   - Agent: `frontend-specialist` | Skill: `frontend-design`
5. [ ] **Data Layer**: Integrate Firestore for dynamic content.
   - Agent: `backend-specialist` | Skill: `firebase`

## Phase X: Verification Plan
- [ ] Run all verification scripts (`verify_all.py`).
- [ ] Manual Check: Verify no purple is used.
- [ ] Build Test: `npm run build` must pass.
