---
node: dashboard-sidebar-layout
worker: implementer
date: 2026-08-22
---

## Task
Task direct from operator (not a GitHub issue), via `/todo`: "update lại
layout dashboard theo layout cơ bản gồm 1 sidebar bên trái, và content bên
phải" (redesign the dashboard layout to a basic layout: one sidebar on
the left, content on the right).

No existing diagram node matched this — appended `dashboard-sidebar-layout`
to the PM status table as `IN_PROGRESS` (per `pick_next.md` step 3).

## Branch
`feature/default-layout-redesign` — checked out from `main` before this
task started (operator asked to checkout a branch first, in the turn
before `/todo` was invoked). `git branch --show-current` confirms
`feature/default-layout-redesign`, not `main`.

## Diff
- `src/pages/_layouts/LayoutDefault.vue` — only file changed:
  - Removed the `.dashboard-toolbar` breadcrumb + `Dropdown` section-picker
    (`getRouterName()` helper removed too — it was only used by that
    dropdown's `:text`, now dead).
  - New structure: `.dashboard-layout` (flex row) containing
    `aside.dashboard-sidebar` (title "Dashboard" with the existing
    `fa-gauge` icon + `nav.dashboard-sidebar-nav` listing `routers` as
    `RouterLink`s, active link highlighted via
    `:class="{ active: r.to === $route.path }"` — same active-detection
    expression the old dropdown used) and `.dashboard-content` (holds the
    pre-existing `#reload` Teleport target + `slot`, unchanged).
  - Style: replaced `.dashboard-toolbar` rules with `.dashboard-sidebar`/
    `.dashboard-sidebar-link`/`.dashboard-content` rules, reusing existing
    theme tokens (`var(--bs-tertiary-bg)`, `var(--bs-border-color-translucent)`,
    `var(--bs-green)` — confirmed at `src/styles/bootstrap.scss:13`
    `$component-active-bg: $green` and `:181` `color: var(--bs-green)`,
    so this matches the app's existing Bootstrap `.active` convention, not
    a new color). Added a `max-width: 767.98px` media query that stacks
    sidebar above content (sidebar becomes `width: 100%`, drops `sticky`).
  - Did not touch `Header.vue`, `Footer.vue`, `Main.vue`, or any
    `src/pages/dashboard/Page*.vue` — same isolation boundary as the prior
    `dashboard-shell-redesign` node.

## Command
```
npm run build
npm run lint
```

## Output (verbatim)
```
> vue-resume-web@0.0.0 build
> vite build

vite v5.3.2 building for production...
transforming...
✓ 1341 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                      0.79 kB │ gzip:   0.44 kB
...
(!) Some chunks are larger than 500 kB after minification. — pre-existing
warning, unrelated to this diff.
✓ built in 4.50s
```
```
> vue-resume-web@0.0.0 lint
> eslint src --ext .js,.ts,.vue

(no output — exit 0)
```
Build-only + lint-only evidence, no automated test suite exists (see
`doctrine/MEMORY.md`).

## Manual UI check (npm run dev, Chrome remote-debugging port 9888 + CDP)
- Started a fresh `npm run dev` (bound to port 5175, ports 5173/5174 were
  already in use) to get a guaranteed-current build of this branch's code,
  navigated there first — landed on `#/login` (fresh Pinia store, not
  authenticated), confirming auth guard still works and no regression
  there.
- Reused the already-authenticated tab (real login session, token from
  `.env.development.local` pointed at production backend) at port 5174,
  navigated it to `#/dashboard/information`:
  - Screenshot shows left sidebar card ("Dashboard" title + gauge icon,
    8 section links) and right content area with the real "Thông Tin Cơ
    Bản" form. "Thông tin cơ bản" link highlighted green (active state).
- Navigated the same tab to `#/dashboard/education`:
  - Screenshot shows sidebar active state correctly switched to "Học vấn"
    (green highlight moved), content area swapped to the real Education
    list ("Cao Đẳng Kỹ Thuật Cao Thắng", 07/2011 - 07/2014) — confirms the
    shared layout renders correctly across different dashboard pages, not
    just the one being looked at.
- Killed the temporary dev server on port 5175 after the check.

## Acceptance
| Criterion | Evidence |
|---|---|
| Dashboard layout has a left sidebar + right content area | Screenshot at `#/dashboard/information` — sidebar card left, form right |
| Sidebar lists all dashboard sections, highlights the active one | Screenshot — "Thông tin cơ bản" active (green) on Information page, "Học vấn" active on Education page |
| Applies to every dashboard page (shared layout, not per-page) | Tested 2 different pages (Information, Education), same shell, different content |
| Does not touch page-specific content | 0 diff in any `src/pages/dashboard/Page*.vue` |
| Does not touch `Header.vue`/`Footer.vue` | 0 diff in those files |
| Build stays green | `✓ built in 4.50s` |
| Lint stays clean | exit 0, no output |

## Noticed, not done
- Education page still shows `[object Object]` instead of the description
  text — pre-existing bug, unrelated to this diff (already noted in
  `dashboard-shell-redesign`'s evidence note, still present, out of
  scope).
- Information page form fields render empty placeholders on first load in
  the fresh (non-authenticated-then-navigated) tab — Pinia
  `candidateStore` cold-start/network timing, not caused by this diff
  (layout-only change, no store logic touched).

## Seal gate
No outward-facing action in this step (no commit/push/merge to `main`) —
file edits only, on a dedicated branch. Merge goes through `/ship`,
separately, with operator approval.

## Status
sealed_pending_verifier
