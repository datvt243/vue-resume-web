# 2026-09-01 — issue-7-useinittable-composable-tests

- Worker: implementer
- Version: 0.1.0
- Node: `issue-7-useinittable-composable-tests` (new node, per LAI-13 — not
  editing any prior `issue-7-*` SEALED node's PM status)
- Task: "#7" (operator, via `/todo`)

## Why this node
Issue #7 (https://github.com/datvt243/resume-vuejs-website/issues/7)'s own
plan (tiers 1-4: pure functions, stores, `useDocument`/`useCandidate`,
`VeeForm.vue`) is already fully SEALED across 3 prior nodes
(`issue-7-vitest-setup`, `issue-7-stores-composables-tests`,
`issue-7-veeform-component-tests`). `doctrine/MEMORY.md`'s Test row
explicitly names the next concrete gap: "Other composables
(`useInitTable`)... still untested". Picked that named gap rather than
guessing — smallest identifiable next increment, not ambiguous.

## Branch
`feature/vitest-useinittable-tests`, checked out from `staging` (per
`doctrine/MEMORY.md` → Git workflow, 2-tier model — NOT from `main`, which
`haven/workers/implementer/manifest.yaml`/`SOUL.md` still say, stale
pre-2026-08-30 text; `doctrine/MEMORY.md` wins per its own stated
authority).

## Diff
| File | Why |
|---|---|
| `src/composables/useInitTable.spec.ts` (new) | 4 tests covering `useInitTable`: field→column mapping incl. `convertTo` default fallback to `'text'`, plain-array input via `toValue`, reactivity to a `Ref` source (matches `TableDefault.vue`'s real call `useInitTable(toRef(props.settings))`), empty-array edge case |

Test-only diff. No `src/composables/useInitTable.ts` change — the
composable itself has no bug, just no test.

## Command
```
npm run test
```
(= `vitest run`, per `doctrine/MEMORY.md` → Test row)

## Output
```
 RUN  v2.1.9 /Users/_david/Workspace/Project/resume/resume-vuejs-website

 ✓ src/utilities/index.spec.ts (13 tests) 6ms
 ✓ src/stores/candidate.spec.ts (11 tests) 10ms
 ✓ src/stores/auth.spec.ts (9 tests) 8ms
 ✓ src/composables/useTheme.spec.ts (6 tests) 109ms
 ✓ src/composables/useCandidate.spec.ts (8 tests) 24ms
 ✓ src/composables/useDocument.spec.ts (9 tests) 25ms
 ✓ index.spec.ts (1 test) 2ms
 ✓ src/components/veevalidate/VeeForm.spec.ts (11 tests) 81ms
 ✓ src/composables/useInitTable.spec.ts (4 tests) 4ms

 Test Files  9 passed (9)
      Tests  72 passed (72)
   Start at  17:53:55
   Duration  1.23s (transform 508ms, setup 0ms, collect 1.36s, tests 269ms, environment 3.25s, prepare 584ms)
```
(68 → 72 tests, no regressions.)

Also ran `npm run build`:
```
✓ 1343 modules transformed.
...
✓ built in 4.83s
```
Same pre-existing chunk-size warning only (`VeeForm-*.js` ~997 kB).

Also ran `npm run lint`:
```
> eslint src --ext .js,.ts,.vue
```
Exit 0, no output.

## Acceptance
| Criterion | Evidence |
|---|---|
| `useInitTable` has real test coverage | `✓ src/composables/useInitTable.spec.ts (4 tests) 4ms` |
| No regressions in existing suite | `Tests  72 passed (72)` (was 68) |
| Build still green | `✓ built in 4.83s` |
| Lint still green | `npm run lint` exit 0, no output |
| Scope is test-only, no `src/` behavior change | `git status --short` shows only `?? src/composables/useInitTable.spec.ts` |

## Noticed, not done
- `src/composables/useHelper.ts` is also still untested (uses `inject()`,
  needs the same mount-a-throwaway-component pattern as
  `useDocument.spec.ts`) — not named explicitly in
  `doctrine/MEMORY.md`'s gap list, out of this node's scope. Logging here
  so a future `issue-7-*` node can pick it up without re-deriving the gap.
- All `.vue` components except `VeeForm.vue` remain untested (per
  `doctrine/MEMORY.md`'s "all Vue components still untested" — that line
  itself is stale now that `VeeForm.vue` has coverage; the doctrine file
  should get a follow-up correction, not done here since it's a
  MEMORY.md accuracy fix, not part of this test-writing task).
- Issue #7 stays OPEN — no coverage tool is wired (`>60%` target from the
  issue's own plan is unmeasured, not just unmet), and this node is a
  single incremental gap-fill, not the full close-out.

## Seal gate
None — no outward-facing action taken (no commit/push/merge). Branch left
uncommitted-to-`staging`, deferred to `/ship` with operator approval.

## Status
`sealed_pending_verifier`
