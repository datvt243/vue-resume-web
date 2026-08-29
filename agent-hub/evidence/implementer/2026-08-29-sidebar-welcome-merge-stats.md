# 2026-08-29 - sidebar-welcome-merge-stats

- Worker: implementer
- Version: 0.1.0
- Node: `sidebar-welcome-merge-stats` (new node — follow-up to the SEALED
  `sidebar-cv-status-stats` node, per LAI-13 must be a new node; same
  still-unshipped branch)
- Task (verbatim): "hãy gộp chung với section Welcome, để text 'Tìm việc:
  On/Off' là được" (simplify: merge the 2 separate stat-row cards from the
  prior node into the welcome card, plain text instead of a badge)

## Branch
`feature/sidebar-welcome-style` (still uncommitted, continuing directly).

## Diff
| file | why |
|---|---|
| `src/pages/_layouts/LayoutDefault.vue` | Removed the separate `.dashboard-sidebar-stats` card (2 bordered rows) added in the prior node. Folded both values into the welcome card as plain text lines instead: `Tìm việc: On`/`Off` (exact wording requested, value colored green/dim via a plain text `<span>`, no badge/pill component) and `Lượt xem CV: 0`. Removed the now-unused `.dashboard-sidebar-stats`/`.dashboard-sidebar-stat-row`/`.dashboard-sidebar-stat-value` CSS, added a small `.dashboard-sidebar-welcome-stat` rule for the 2 new text lines. Data sources unchanged (`isOpenToWork`, `cvViewCount`, same as the prior node). |

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
✓ built in 5.32s
```
Same pre-existing chunk-size warning only.

## Acceptance
| Criterion | Evidence |
|---|---|
| `npm run build` green | `✓ built in 5.32s`, no errors |
| Stats merged into the welcome card, not a separate card | Live CDP check (below): `document.querySelector('.dashboard-sidebar-welcome').innerText` returns all 4 lines together, no separate `.dashboard-sidebar-stats` element exists anymore |
| Exact text format "Tìm việc: On/Off" | Confirmed in the same innerText dump: `"Tìm việc: Off"` (current test data has `openToWork: false`) |

## Manual verification
Live CDP check via client-side hash navigation (`window.location.hash =
'#/'`, no full reload — per the lesson logged in the prior node's
evidence about `App.vue`'s reload-redirect behavior):
```
welcome card text: "👋 Chào mừng\n\nVõ Tấn Đạt\n\nTìm việc: Off\n\nLượt xem CV: 0"
```
Also captured a full-page screenshot confirming the visual result: one
consolidated card, no leftover separate stat-row boxes. No visual
breakage, no console error surfaced by the build step. Read-only
navigation only, no data mutated.

## Noticed, not done
Nothing new — same open items as the prior 2 sidebar nodes (no component
test for `LayoutDefault.vue`, issue #7).

## Seal gate
None — no commit/push/merge/deploy happened in this pass. Only local file
edit + local build + local read-only screenshot check.
