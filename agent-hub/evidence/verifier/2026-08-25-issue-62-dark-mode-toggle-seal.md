# 2026-08-25 — issue-62-dark-mode-toggle — SEAL

- Worker: verifier
- Verdict: **SEAL**
- Node: `issue-62-dark-mode-toggle` (new — not yet on
  `haven/diagrams/dev-loop.prime-mermaid.md`; PM status row deliberately
  NOT added by this note — orchestrating session applies that edit once,
  after this verdict, per explicit operator instruction this pass)
- Evidence reviewed:
  `agent-hub/evidence/implementer/2026-08-25-issue-62-dark-mode-toggle.md`
- Reviewer session did NOT write the diff under review (`NeverVerifyOwnWork`
  satisfied — fresh session, only read files + re-ran commands).

## Method
Per explicit operator instruction this pass, verification went beyond
reading the note alone: independently re-read every changed source file
and re-ran every command, rather than trusting the note's claims at face
value. This is a stricter application of `EvidenceOnly`, not a departure
from it.

## Independent checks (all done directly, not inferred from the note)

| Check | Result |
|---|---|
| `git branch --show-current` | `feature/dark-mode-toggle` — not `main`. `NoMainEdit` satisfied. |
| `git status --short` | Modified: `src/main.ts`, `src/plugins/initFontAwesomeIcon.js`, `src/pages/_layouts/Header.vue`, `src/components/veevalidate/part/FrmDatePicker.vue`, `agent-hub/doctrine/MEMORY.md`, `agent-hub/haven/workers/implementer/MEMORY.md`. Untracked: `src/composables/useTheme.ts`, `src/composables/useTheme.spec.ts`, the implementer evidence note. Matches the note's diff table exactly — no unexplained files. The two agent-hub `MEMORY.md` edits are legitimate hub bookkeeping (test-count update, implementer correction log), not app-code scope creep. |
| `git diff main --stat -- yarn.lock package.json package-lock.json` | Empty — no lockfile side effect (repeat of the `issue-7-vitest-setup` REOPEN class of bug did NOT recur). |
| `src/composables/useTheme.ts` read directly | `getPreferredTheme()` uses `window.matchMedia?.('(prefers-color-scheme: dark)')?.matches` — the second `?.` (guarding `.matches`) IS present in current code. The note's claimed earlier bug (`window.matchMedia?.(...).matches` without the second `?.`, which throws when `matchMedia` is `undefined`, e.g. jsdom) is NOT present in what's on disk now. `applyTheme()` sets `data-bs-theme` on `document.documentElement`, matching issue #62's own stated scope (`gh issue view 62` confirms: "Set `data-bs-theme=\"dark\"` trên `<html>`/root element"). Module-scoped `ref` shared across calls, applied at module load — matches described flash-avoidance design. |
| `src/composables/useTheme.spec.ts` read directly | 5 real behavioral tests: default-light-when-no-matchMedia, OS-preference-fallback, saved-localStorage-wins-over-OS, toggle flips+persists+sets-DOM-attribute (both directions), shared-state-across-calls. `beforeEach` explicitly sets `window.matchMedia` to `undefined` to reproduce the exact throw condition the fix addresses — this is a real regression test for the disclosed bug, not a placeholder. |
| `src/pages/_layouts/Header.vue` read + diffed against `main` | Toggle button present in BOTH branches (`v-if="!store.isAuthenticated"` logged-out nav, and the authenticated `.d-flex.gap-2` action row), each bound to `toggleTheme`, icon flips `fa-sun`/`fa-moon` off `theme`. Matches note precisely. |
| `src/components/veevalidate/part/FrmDatePicker.vue` read + diffed | `dark` prop changed from hardcoded `dark` (bare truthy attr) to `:dark="theme === 'dark'"` — now reactive, matches note. Correctly flagged in the note as a visible light-mode behavior change, not silently bundled. |
| `src/main.ts` read + diffed | `import '@/composables/useTheme'` placed before `app.mount('#app')`, with a comment explaining the flash-avoidance rationale. Confirmed early-import ordering. |
| `src/plugins/initFontAwesomeIcon.js` read + diffed | `faSun`, `faMoon` imported and added to `library.add(...)`. Confirmed both places. |
| `npm run test` (independent re-run) | `RUN v2.1.9` → `✓ src/utilities/index.spec.ts (13)`, `✓ src/stores/candidate.spec.ts (11)`, `✓ src/composables/useTheme.spec.ts (5)`, `✓ src/stores/auth.spec.ts (9)`, `✓ src/composables/useDocument.spec.ts (9)`, `✓ src/composables/useCandidate.spec.ts (8)` → **6 files passed, 55 tests passed.** Matches the note's claimed output exactly. |
| `npm run build` (independent re-run) | `✓ built in 5.43s` (note claimed 4.95s — normal run-to-run variance, same pre-existing chunk-size warning, no new errors). Green. |
| `npm run lint` (independent re-run) | Exit 0, no output. Matches note. |
| `sweetalert2.scss` read directly | Hardcodes `$swal2-background: $swal2-white`, `$swal2-color: lighten($swal2-black, 33)`, full light palette, no dark-mode variables or media query. Confirms the note's "checked, not changed" claim is accurate, not overstated. |
| CKEditor usage grepped directly | `src/components/veevalidate/part/FrmCkediter.vue` and `src/components/ckeditor/CKEditor.vue` — exactly the two files the note references, no reactive dark-skin wiring found in either. Note's claim not overstated. |
| GitHub issue #62 fetched directly (`gh issue view 62`) | Scope matches the note's quoted summary verbatim: toggle in `Header.vue`, persist to `localStorage`, `data-bs-theme` on root, check `sweetalert2.scss`/`vue3datepicker.scss`/CKEditor compatibility. |

## Acceptance criteria — one by one
| Criterion | Verdict | Evidence |
|---|---|---|
| Toggle button in `Header.vue`, both auth states | MET | Read template directly, both branches confirmed |
| Preference persisted to `localStorage` | MET | `useTheme.spec.ts` real assertion + `toggleTheme()` source reads `localStorage.setItem` |
| `data-bs-theme` set on root element | MET | `applyTheme()` source + spec assertion on `document.documentElement.getAttribute` |
| Custom styles checked for dark-mode compat | MET | Independently confirmed by reading `sweetalert2.scss` + grepping CKEditor files myself |
| Build/lint/test green | MET | All three independently re-run, output read back verbatim, matches note |
| No lockfile side effect | MET | `git diff main --stat` on all 3 lockfile-class files empty |
| Branch not `main` | MET | `git branch --show-current` confirmed directly |
| `matchMedia` optional-chaining fix present | MET | Read `useTheme.ts` source directly — safe `?.(...)?.matches` form confirmed |
| No scope creep / proportional diff | MET | Full `git diff main --stat` = 6 files, 33 insertions/3 deletions — matches note's table exactly, the one extra fix (FrmDatePicker `dark` prop) is explicitly in the issue's own stated check scope, not opportunistic |

## Manual UI verification limitation — judged, not penalized
The note discloses NO real browser screenshot/click-through was done (no
browser-automation tool available this session — confirmed the same gap
independently: this verifier session also has no browser-automation tool
loaded). The substitute — a real Vitest suite with genuine behavioral
assertions (not just build-green) plus a curl-based dev-server compile
check — is judged SUFFICIENT for this diff's risk profile:
- The change is pure client-side state + one DOM attribute + one Bootstrap
  native mechanism (`data-bs-theme`), not a complex visual layout that
  only a screenshot could catch.
- The one real bug in this diff (`matchMedia` throwing when undefined) was
  caught by the test suite, not by inspection — direct evidence the
  substitute methodology has actual teeth, not just theater.
- Per `NORTHSTAR.md`, condition (3) is satisfied here by the project's now
  real (if partial) test suite hitting the exact new logic, which is a
  strictly higher bar than the build-only fallback the doctrine allows for
  untested code.
Honest disclosure of a real limitation is not penalized — inventing a
fake click-through claim would have been the actual violation.

## Forbidden states scan
| State | Hit? |
|---|---|
| `ADHOC_WORK` | No — went through implementer worker + evidence note |
| `NO_EVIDENCE` | No — evidence note exists and is thorough |
| `EDIT_UNVERIFIED` | No — commands actually run, output read back, independently reproduced |
| `CODE_IN_HAVEN` | No — only `.md` files touched in `agent-hub/`, no code |
| `DIAGRAM_DRIFT` | N/A this pass — PM status intentionally deferred to orchestrating session per explicit operator instruction, not an oversight |
| `MAIN_EDIT` | No — `feature/dark-mode-toggle` |

## Seal gate
No outward-facing action (commit/push/merge) taken or approved this pass —
correctly so, none was needed: diff remains uncommitted on
`feature/dark-mode-toggle`. Commit + merge to `main` is a separate `/ship`
step requiring its own approval.

## Verdict
**SEAL.** Every acceptance criterion has independently-reproduced, citable
evidence. The disclosed browser-automation gap is real but the substitute
evidence (behavioral test suite + compile check) is sufficient for this
diff's actual risk. No forbidden state hit.

PM status update on `haven/diagrams/dev-loop.prime-mermaid.md` intentionally
NOT applied by this note — deferred to the orchestrating session per
explicit operator instruction for this pass.
