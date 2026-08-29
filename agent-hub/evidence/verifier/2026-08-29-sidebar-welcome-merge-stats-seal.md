# 2026-08-29 - sidebar-welcome-merge-stats - SEAL

- Worker: verifier (fresh subagent, did not write the diff under review —
  `NeverVerifyOwnWork` satisfied by construction)
- Node: `sidebar-welcome-merge-stats`
- Verdict: **SEAL**

## Note reviewed
`agent-hub/evidence/implementer/2026-08-29-sidebar-welcome-merge-stats.md`

## Acceptance criteria — checked one by one

| Criterion | My independent evidence |
|---|---|
| `npm run build` green | Re-ran myself from repo root: `✓ 1343 modules transformed`, full asset table printed with no truncation/`...`, `✓ built in 5.37s`. Same pre-existing chunk-size warning only. Matches the note's `5.32s` (normal run-to-run variance). |
| Stats merged into the welcome card, not a separate card | Read `src/pages/_layouts/LayoutDefault.vue` directly (not just the note). Lines 52-60: single `.dashboard-sidebar-welcome` block contains hi/name/both stat lines. `grep -n "dashboard-sidebar-stats\|dashboard-sidebar-stat-row\|dashboard-sidebar-stat-value"` on the file → **zero matches**, confirming the old separate card/CSS from the prior node is fully removed, not just visually hidden. |
| Exact text format "Tìm việc: On/Off" | Read the literal template lines: `p.dashboard-sidebar-welcome-stat.mb-1` → `| Tìm việc:` then `span(:class="isOpenToWork ? 'text-success' : 'opacity-50'") {{ isOpenToWork ? ' On' : ' Off' }}`. This renders exactly `Tìm việc: On` or `Tìm việc: Off` — matches the requested wording verbatim, plain text/span (no badge component), colored via a class not a pill. |
| Same underlying data, no fabrication | `isOpenToWork`/`cvViewCount` computed/const are unchanged from the prior SEALED node (`sidebar-cv-status-stats`), confirmed by reading lines 26-29 — same `candidate.getGeneralInformation?.openToWork` source, same `0` placeholder with the same disclosing comment. |

## Branch check (`NoMainEdit`)
`git branch --show-current` → `feature/sidebar-welcome-style`. Not `main`.
No `MAIN_EDIT`.

## Proportionality (`SmallestDiff`)
`git diff main --stat -- src/` shows `LayoutDefault.vue` + `PageHome.vue`.
The `PageHome.vue` delta predates this node — it belongs to the already-
SEALED `home-dashboard-itviec-style` node stacked earlier on this same
still-unshipped branch, not to this task. This node's own contribution is
exactly the one file the note claims (`LayoutDefault.vue`), confirmed by
reading it. No opportunistic scope creep found.

## Live screenshot attempt — gap disclosed, not a diff defect
Wrote and ran my own fresh CDP script (`ws` package,
`ws://localhost:9888/devtools/page/7C525E75CCF27A4D2D85971BE3916145`)
using client-side hash navigation (`window.location.hash = '#/'`, no
`Page.navigate`/reload), per the instruction to avoid the pre-existing
`App.vue` reload-redirect trap.

Result: the debug browser's session had already lost its auth token
before my check ran — `localStorage.getItem('token')` → `false`,
`location.href` after hash-set → `#/login` (router guard redirect, not a
crash). This is an environment/session condition (token expired /
cleared, or a previous invalidToken auto-logout — a pre-existing
documented `handleBase` behavior, unrelated to this diff), not something
introduced by the code under review. I hold no test credentials to log
back in and did not attempt to guess any against the real backend.

This mirrors the precedent already accepted in this exact sequence
(`home-dashboard-itviec-style` SEAL note: "itviec reference screenshot
itself unavailable this session so verified everything else instead").
Per that precedent, a missing live screenshot does not block SEAL when
every acceptance criterion already has independent, citable evidence from
other means (here: build + direct source-code read of the literal
rendered strings, which is unambiguous — arguably stronger than visual
inspection for confirming exact text). The underlying `isOpenToWork`/
`cvViewCount` data-binding pattern was already live-screenshot-verified
working in the immediately prior SEALED node
(`evidence/verifier/2026-08-29-sidebar-cv-status-stats-seal.md`); this
node only restructures markup/CSS around that same already-proven data,
it does not introduce new data logic.

## Forbidden states scan
All 6 checked against `CLAUDE.md` — none hit. No outward-facing action
(commit/push/merge/deploy) taken in this pass, so no Seal Gate approval
was needed (matches the note's own "Seal gate: None").

## Decision
SEAL. Every stated acceptance criterion has independent citable evidence
(build output + direct source read). The screenshot gap is a disclosed
environment/session condition, not a defect in the diff, and is handled
per the established precedent in this same node sequence.

## PM status update
`sidebar-welcome-merge-stats`: IN_PROGRESS → **SEALED** on
`agent-hub/haven/diagrams/dev-loop.prime-mermaid.md`.
