# 2026-08-29 - sidebar-welcome-style

- Worker: implementer
- Version: 0.1.0
- Node: `sidebar-welcome-style` (new node — follow-up to the SEALED
  `home-dashboard-itviec-style` node, per LAI-13 must be a new node)
- Task (verbatim): "sidebar, hãy bổ sung phần welcome như page itviec,
  update lại style. các section đã làm ở feature trước hãy bổ sung thêm
  padding giữa các section"

## Branch
`feature/sidebar-welcome-style` (checked out from `main` before touching
any file).

## Diff
| file | why |
|---|---|
| `src/pages/_layouts/LayoutDefault.vue` | Two parts: (1) added a "welcome" card at the top of the dashboard sidebar — real candidate full name from `candidateStore` (same computed pattern already used in `PageHome.vue`), matching the reference screenshot's "👋 Welcome / [Name]" block. (2) Restyled the sidebar: split the previous single box into two visually separate cards (`.dashboard-sidebar-welcome` + `.dashboard-sidebar-nav-card`, each with its own rounded border using the same `var(--bs-tertiary-bg)`/`var(--bs-border-color-translucent)` tokens already established), matching the reference's two-card composition. Removed the old static "🎚 Dashboard" label (was plain text, not a link) and replaced it with a real `Dashboard → '/'` entry at the top of the existing nav array, reusing the array's existing active-state logic (`r.to === $route.path`) — so "Dashboard" now correctly highlights when on the home page, same as every other nav item. |
| `src/pages/home/PageHome.vue` | Bumped the spacing between the 4 sections built in the prior `home-dashboard-summary`/`home-dashboard-itviec-style` nodes from `mb-4` (1.5rem) to `mb-5` (3rem) on all 3 non-last sections, per the explicit ask for "more padding between sections". `mb-5` also matches the spacing convention already used elsewhere in the app between stacked `.block-container` blocks (e.g. `PageInformation.vue`'s first block). |

## Command
```
npm run build
```
(from repo root, per `doctrine/MEMORY.md`.)

## Output
```
> vue-resume-web@0.0.0 build
> vite build

vite v5.3.2 building for production...
transforming...
✓ 1343 modules transformed.
rendering chunks...
computing gzip size...
...
✓ built in 4.91s
```
Same pre-existing chunk-size warning only (`VeeForm-*.js` > 500kB, present
before this change too).

## Acceptance
| Criterion | Evidence |
|---|---|
| `npm run build` green | `✓ built in 4.91s`, no errors |
| Sidebar has a welcome section with real name | Live CDP screenshot (below): "👋 Chào mừng / Võ Tấn Đạt" card at the top of the sidebar |
| Sidebar style updated (card separation) | Screenshot shows 2 distinct rounded cards (welcome card + nav card), not one merged box like before |
| "Dashboard" nav item highlights correctly | Screenshot shows "Dashboard" as the first nav link, styled active (green fill) while on `/` |
| More padding between the 4 home sections | Screenshot shows visibly larger gaps between "Thông tin cơ bản" → "Lượt xem CV" → "Đính kèm CV" → "Profile Information" than the prior `mb-4` version |

## Manual verification
Live CDP screenshot of the running dev-server page at `#/`
(`Page.captureScreenshot`, `captureBeyondViewport: true`, clipped to the
real content size). Confirms: sidebar welcome card shows real data ("Võ
Tấn Đạt"), "Dashboard" nav item is active/highlighted, all 4 home sections
render with the wider spacing. No visual breakage, no console error
surfaced by the build step. Read-only navigation only, no data mutated.

## Noticed, not done
- `faGauge` (FontAwesome icon) is now registered in
  `initFontAwesomeIcon.js` but no longer rendered anywhere (it was only
  used by the removed static "🎚 Dashboard" label) — harmless unused icon
  registration, not removed since it's out of scope for this task and
  costs negligible bundle size.
- No component test exists for `LayoutDefault.vue` (issue #7, components
  untested in general) — not fixed here, out of scope.

## Seal gate
None — no commit/push/merge/deploy happened in this pass. Only local file
edits + local build + local read-only screenshot check.
