# 2026-09-02 — issue-55-cv-preview-print

- Worker: implementer
- Version: 0.1.0
- Node: `issue-55-cv-preview-print` (new node)
- Task (verbatim): "#55" (operator, via `/todo`) — [issue #55](https://github.com/datvt243/resume-vuejs-website/issues/55),
  "Xuất CV ra PDF / trang in"

## Branch
`feature/cv-preview-print` from `staging`. (Note: this branch also carries
forward 2 pre-existing uncommitted changes from earlier in this session —
`agent-hub/evidence/implementer/2026-09-02-issue-8-jwt-localstorage-recheck.md`
and its matching diagram row — that were made directly on `staging`
working tree before this task started, a `BranchBeforeCode` miss caught
and corrected mid-session by branching before writing any `src/` code.
Same precedent as commit `1c8a5c0`, which bundled a blocked #8 recheck
note into that session's real feature branch.)

## Diff
| File | Why |
|---|---|
| `src/pages/dashboard/PagePreview.vue` (new) | The "Trang Xem trước CV" the issue asks for — reads `candidateStore` + `useCandidate` for all 7 sections (general info, education, experience, project, award, certificate, reference), renders a print-friendly resume layout, "Xuất PDF / In" button calls `window.print()` |
| `src/routers/index.ts` | New child route `dashboard/preview` → `PagePreview.vue`, same `requiresAuth` pattern as every other dashboard route |
| `src/pages/_layouts/LayoutDefault.vue` | One new sidebar nav link ("Xem trước / Xuất PDF") so the page is reachable, same pattern as the other 8 nav entries |

## Scope decision: CSS `@media print`, not a PDF library
Issue's own "Phạm vi đề xuất" offers 2 options: `@media print` OR a
client-side lib (`html2pdf`/`jsPDF`). Picked `@media print` +
`window.print()` — zero new dependencies (`html2pdf`/`jsPDF` not in
`package.json`, confirmed via `grep`), uses the browser's native
"Save as PDF" in the print dialog which covers the issue's literal ask
("ra file PDF **hoặc** trang in được định dạng đẹp"). Rejected pulling in
`html2pdf.js` as unrequested scope (SmallestDiff) — CSS handles the
"formatted nicely" requirement equally well for a text-heavy résumé
layout with no canvas/image rendering needs.

Print isolation: a `cv-print-mode` class is added to `<body>` only while
`PagePreview.vue` is mounted (removed `onUnmounted`) — the print CSS
(non-scoped `<style>` block, needed since it targets `header`/`footer`
outside this component's own template) is gated behind that class so
printing from any OTHER page is unaffected.

## Command
```
npm run build
```

## Output
```
✓ 1348 modules transformed.
...
dist/assets/PagePreview-lOlB9hmt.css                1.52 kB │ gzip:   0.53 kB
...
dist/assets/PagePreview-anIerARE.js                 7.32 kB │ gzip:   2.37 kB
...
(!) Some chunks are larger than 500 kB after minification. Consider:
...
✓ built in 4.97s
```
Same pre-existing chunk-size warning as every prior build (VeeForm.js is
the large chunk, unrelated to this diff).

```
npm run lint
```
→ exit 0, no output. (Note: `doctrine/MEMORY.md`/`doctrine/domains/PROJECT.md`
both still say lint reports "95 real errors" from the 2026-08-20 hub-init
snapshot — that is now stale, a clean `npm run lint` run produces zero
output/errors today. Not fixing that doctrine drift here, out of this
task's scope — logged under "Noticed, not done".)

```
npm run test -- --run
```
→ `Test Files  10 passed (10)`, `Tests  76 passed (76)` — same count as
before this diff, no regressions, no new spec added (see below).

## Manual check (UI diff — build+test alone is not enough)
No browser-automation tool was available this session to do a real
click-through/screenshot:
- The `claude-in-chrome` skill reported the user chose "continue without
  browser tools" — not available this session.
- The raw-CDP-over-`ws` technique used in prior sessions (see
  `haven/workers/implementer/MEMORY.md`, 2026-08-25 entries) was
  attempted and **blocked by the permission classifier** this session
  (`node -e` driving a websocket was refused outright, before it could
  even connect) — a capability available in earlier sessions is not
  available in this one. Disclosing this honestly rather than silently
  falling back to a weaker check without saying so.

Substitute evidence used instead (same class of substitute as the
`docs-known-bugs-table-sync`/early dark-mode entries when no click-through
was possible):
1. `npm run build` — green (above), full production compile of
   `PagePreview.vue`'s `<script setup>` + `<template>` + both `<style>`
   blocks succeeds with no Vue SFC compile errors.
2. Live Vite dev-server transform check: a real `npm run dev` instance
   was already running on this machine (port 5174, pre-existing, not
   started by me). `curl http://localhost:5174/resume-vuejs-website/src/pages/dashboard/PagePreview.vue`
   → HTTP 200, returns the actual compiled `_sfc_main` JS module (proves
   Vite's real dev-mode SFC compiler accepts the file, not just Rollup's
   production compiler — same "compile check" substitute technique used
   in the issue-62 dark-mode entries).
3. Direct source cross-reference (not inference) of every field name used
   in the template against the real data shape, done BEFORE writing the
   template, not after: `src/models/{education,experience,project,award,
   certificate,reference,generalInformation,information}.model.ts` read
   directly for exact field names (`school`/`major`, `company`/`position`,
   `name`/`technology`/`isWorking`, `issueDate`, `isNoExpiration`,
   `fullName`, `positionDesired`/`career`/`levelCurrent`/`education`/
   `workForm`/`workLocation`/`careerGoal`), and `src/composables/
   useCandidate.ts` + `src/stores/candidate.ts` read directly to confirm
   `getCandidateByField`/`useCandidate({field})` returns arrays keyed
   exactly `educations`/`experiences`/`projects`/`awards`/`certificates`/
   `references` (plural, matching what `PagePreview.vue` destructures).

**Disclosed limitation:** none of the 3 above actually renders the page
or confirms the print CSS visually hides the sidebar/header — that part
is unverified beyond static review of the CSS rule targeting
`body.cv-print-mode header/footer/.dashboard-sidebar/.no-print`. Flagging
this explicitly rather than claiming more than what was actually checked.

## Acceptance
| Criterion | Evidence |
|---|---|
| New route `/dashboard/preview` reachable, matches existing route pattern | `src/routers/index.ts` diff — same `{ path, name, component: () => import(...), meta: { requiresAuth: true } }` shape as the 9 sibling routes |
| Page renders all 7 data sections from real store data, correct field names | Cross-referenced against `src/models/*.model.ts` + `useCandidate.ts` directly, listed above |
| "Xuất PDF / In" action present | `PagePreview.vue` — `<Button ... @click="handlePrint()">`, `handlePrint()` calls `window.print()` |
| No new dependency added | `git diff staging -- package.json package-lock.json` → empty (not shown above, re-confirmed: no change) |
| Build green | `✓ built in 4.97s`, `PagePreview-*.js`/`.css` chunks present in `dist/assets/` |
| Lint clean | `npm run lint` exit 0 |
| No test regressions | `npm run test -- --run` → `76 passed (76)`, same as before this diff |
| Print CSS doesn't leak to other pages | `cv-print-mode` class only added `onMounted`/removed `onUnmounted` of `PagePreview.vue` itself, all print rules gated on `body.cv-print-mode` |

## Noticed, not done
- `doctrine/MEMORY.md` and `doctrine/domains/PROJECT.md` both still claim
  "95 real lint errors, not fixed" from the 2026-08-20 hub-init snapshot —
  a fresh `npm run lint` today is clean (exit 0, zero output). This is
  stale doctrine, not something this task's scope covers fixing
  (updating hub doctrine text is a separate task).
- No test file added for `PagePreview.vue` — matches the existing,
  already-logged gap (issue #7's own note: "all `.vue` components except
  `VeeForm.vue` are still untested"). Not expanding that scope here.
- Avatar/photo is not part of the printed layout — issue #58 (avatar
  upload) is separate, unimplemented; nothing to render yet.
- The public share-link read-only view (issue #56) is a DIFFERENT,
  unauthenticated surface — this task only covers the authenticated
  dashboard preview, not a public URL.

## Seal gate
No outward-facing action taken (uncommitted on `feature/cv-preview-print`,
not merged, not pushed). Commit/PR/merge into `staging` deferred to
`/ship`, per the seal gate.

Stop at `status: sealed_pending_verifier`. Spawning a fresh verifier
subagent next (per `/todo`/`/worker` obligation) — this session wrote the
diff, so it cannot verify its own work (`NeverVerifyOwnWork`).
