# 2026-09-01 — issue-7-usehelper-composable-tests — SEAL

- Worker: verifier
- Version: 0.1.0
- Node: `issue-7-usehelper-composable-tests`
- Session: fresh subagent, no memory of writing the diff under review
  (`NeverVerifyOwnWork` satisfied by construction)

## Verdict
**SEAL**

## What I checked (independently, not trusting the implementer's note)

### Branch / scope
- `git branch --show-current` → `feature/vitest-usehelper-tests` (not
  `main`/`staging` — `NoMainEdit` satisfied).
- `git status --short` → exactly:
  - `M agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` (the PM row)
  - `?? agent-hub/evidence/implementer/2026-09-01-issue-7-usehelper-composable-tests.md`
  - `?? src/composables/useHelper.spec.ts`
  - No other `src/` files touched, `useHelper.ts` itself untouched.
  Matches the note's claim exactly — proportional, `SmallestDiff` honored.

### Command re-run (fresh, own eyes on the output)
- `npm run test` → `Test Files  10 passed (10)`, `Tests  76 passed (76)`.
  Matches note's `72 → 76, no regressions`. The 4 `[Vue warn]: injection
  "..." not found` stderr lines are from the intentional no-provide test
  case, not failures — output not truncated.
- `npm run build` → `✓ built in 4.85s`, only the pre-existing chunk-size
  warning (`VeeForm-*.js` >500kB), nothing new.
- `npm run lint` → exit 0, zero output (ran `eslint src --ext
  .js,.ts,.vue` directly, confirmed exit code 0). Matches note's claim
  that the one real finding (`no-unused-vars` on `args` param) was
  already fixed to `_args` before this evidence was written.

### Source read directly, not inferred
- `src/composables/useHelper.ts` (7 lines of logic): `inject('spinner')`
  and `inject('toast')`, returned as `{ loading: refSpinner, toast:
  refToast }` — returns the Refs/functions themselves, no `toValue()`
  unwrap. Confirms issue #9 is currently fixed in source.
- `src/composables/useHelper.spec.ts`: 4 tests, all genuine (not
  placeholders):
  1. `expect(result.loading).toBe(refSpinner)` — **`toBe`, not
     `toEqual`** — this is the load-bearing regression guard. If
     `useHelper.ts` regressed to issue #9's old bug (`toValue(refSpinner)`
     instead of the Ref), `result.loading` would be the *unwrapped
     primitive* (`null` in this test), which fails identity comparison
     against the Ref object `refSpinner` — `toBe` would correctly fail.
     `toEqual` would NOT catch this regression (a `Ref<null>`'s
     `.value` and a bare `null` aren't what's being compared here, but
     more importantly `toEqual` on two different types/shapes still
     tends to over-match structurally in ways identity doesn't) — the
     implementer's choice of `toBe` is the correct, deliberate one for
     this specific guard.
  2. Reactivity test: mutates `refSpinner.value` after injection,
     re-reads `result.loading?.value` — proves the returned reference
     stays live, not a snapshot.
  3. Toast identity + call-forwarding: `toBe` on the function reference,
     then calls it and asserts `toHaveBeenCalledWith`.
  4. No-provide case: asserts both `undefined`, no throw.
  Mount pattern (`@vue/test-utils`, `global.provide`) is a real technique
  needed because `inject()` requires an active component instance —
  matches the pre-existing `useDocument.spec.ts` pattern, not a new
  invented workaround.

### Diagram / PM status
- `dev-loop.prime-mermaid.md` line 58: node `issue-7-usehelper-composable-tests`
  found with `State = PENDING`, notes matching the evidence note
  1:1 (branch, command outputs, scope). `DIAGRAM_DRIFT` not present —
  code change and diagram row landed together, just needed my status
  bump.

### Forbidden states scan (`CLAUDE.md`)
| State | Hit? |
|---|---|
| `ADHOC_WORK` | No — went through implementer, node exists on diagram |
| `NO_EVIDENCE` | No — evidence note present and detailed |
| `EDIT_UNVERIFIED` | No — test/build/lint all independently re-run by me, output read back |
| `CODE_IN_HAVEN` | No — only the diagram `.md` row touched under `haven/`, no code |
| `DIAGRAM_DRIFT` | No — row exists, just PENDING until this verdict |
| `MAIN_EDIT` | No — branch is `feature/vitest-usehelper-tests` |

### Seal gate
None required — no outward-facing action taken (branch left uncommitted,
per the note). Commit/PR/merge deferred to `/ship` with operator
approval, same as the note states.

## Acceptance criteria — all cited
| Criterion | Evidence |
|---|---|
| `useHelper.ts` has real test coverage | 4 genuine tests, read directly, not placeholders |
| Issue #9 regression guard is real | `toBe(refSpinner)` identity check — verified it would actually fail if the old `toValue()` bug returned |
| No regressions | Fresh `npm run test` → `76 passed (76)`, 10/10 files |
| Build/lint green | Fresh `npm run build` → `✓ built in 4.85s`; fresh `npm run lint` → exit 0 |
| Scope is test-only, single file | Fresh `git status --short` → exactly 1 new spec file + diagram row + evidence note |
| Branch is non-main | `git branch --show-current` → `feature/vitest-usehelper-tests` |

## Missing
None.

## forbidden_hit
null
