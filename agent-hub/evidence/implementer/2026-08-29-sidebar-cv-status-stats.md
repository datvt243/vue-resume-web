# 2026-08-29 - sidebar-cv-status-stats

- Worker: implementer
- Version: 0.1.0
- Node: `sidebar-cv-status-stats` (new node — follow-up to the SEALED
  `sidebar-welcome-style` node, per LAI-13 must be a new node; landed on
  the same still-unshipped branch since nothing has been committed/merged
  yet for that node either)
- Task (verbatim): "bổ sung lượt view và tình trạng open-to-work"
  (continuation of the itviec-reference sidebar work — operator is asking
  for the 2 mini stat rows itviec shows below its welcome card: "CV Views
  by Recruiters" and a status indicator)

## Branch
`feature/sidebar-welcome-style` (already checked out from `main`, still
fully uncommitted — no `/ship` has run for this branch yet, so continuing
directly on it rather than branching again).

## Diff
| file | why |
|---|---|
| `src/pages/_layouts/LayoutDefault.vue` | Added 2 mini stat rows in the sidebar, between the welcome card and the nav card, matching the reference's "Make Your CV Visible" / "CV Views by Recruiters" row composition: (1) "Trạng thái tìm việc" (open-to-work status) — real data, same `candidate.getGeneralInformation?.openToWork` boolean already used in `PageHome.vue`, rendered as the same green/gray badge pattern already established there (kept read-only, NOT a functional toggle — turning it into a live-editable control would need a real PATCH call, real scope expansion beyond "add the view+status display", consistent with the same call made in the prior `home-dashboard-itviec-style` node); (2) "Lượt xem CV" (CV view count) — same `cvViewCount = 0` placeholder already used in `PageHome.vue`, disclosed the same way (no view-counting API exists yet). |

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
✓ built in 5.21s
```
Same pre-existing chunk-size warning only (`VeeForm-*.js` > 500kB, present
before this change too).

## Acceptance
| Criterion | Evidence |
|---|---|
| `npm run build` green | `✓ built in 5.21s`, no errors |
| Sidebar shows open-to-work status | Live CDP screenshot (below): "Trạng thái tìm việc" row with badge "Không tìm" (matches current test data, `openToWork: false`) |
| Sidebar shows CV view count | Screenshot: "Lượt xem CV" row showing "0" |
| Both rows use real/disclosed data, no new fabrication | Open-to-work reuses the exact same store getter as `PageHome.vue`'s badge; view count reuses the exact same hardcoded placeholder, same disclosure convention |

## Manual verification
Live CDP screenshot of the running dev-server page at `#/`
(`Page.captureScreenshot`, `captureBeyondViewport: true`). One correction
during this check: a first attempt used a full `window.location.reload()`
which bounced the page to `/dashboard/general-information` — this is
**pre-existing behavior in `App.vue`'s `onMounted`** (it always redirects
an authenticated user to `localStorage['current-page']` on a full mount,
regardless of the current hash — unrelated to this diff, not a bug
introduced here), not a real issue. Re-tested with a plain hash
navigation (`window.location.hash = '#/'`, no full reload) instead, which
correctly stays on the home page and confirms both new sidebar rows
render with the expected real data. No visual breakage, no console error
surfaced by the build step. Read-only navigation only, no data mutated.

## Noticed, not done
- Confirmed but not fixed (pre-existing, out of scope): `App.vue`'s
  post-login/reload redirect to `current-page` means a full browser
  refresh while on `/` will bounce the user to their last dashboard
  sub-page instead of staying on the new home dashboard. Not something
  this task touched or was asked to touch — logged for awareness only.
- No component test exists for `LayoutDefault.vue` (issue #7) — not fixed
  here, out of scope.

## Seal gate
None — no commit/push/merge/deploy happened in this pass. Only local file
edit + local build + local read-only screenshot check.
