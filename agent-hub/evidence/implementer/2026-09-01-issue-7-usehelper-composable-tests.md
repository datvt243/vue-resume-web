# 2026-09-01 — issue-7-usehelper-composable-tests

- Worker: implementer
- Version: 0.1.0
- Node: `issue-7-usehelper-composable-tests` (new node, per LAI-13)
- Task: "viết test cho useHelper.ts luôn" (operator, continuing issue #7)

## Why this node
The (sealed, not yet shipped) `issue-7-coverage-tooling` node measured real
coverage for `src/{utilities,stores,composables}/**` at 93.97% statements
— the only genuine 0% gap left in scope was `src/composables/useHelper.ts`
(a 2-line `inject()` wrapper). This node closes that gap.

## Branch
`feature/vitest-usehelper-tests`, checked out from `staging`. Before
branching, stashed the uncommitted `issue-7-coverage-tooling` work
(`git stash push -u`, on `feature/vitest-coverage-tooling`) so this node's
diff stays scoped to exactly one file, not mixed with the still-pending
coverage-tooling diff.

## Diff
| File | Why |
|---|---|
| `src/composables/useHelper.spec.ts` (new) | 4 tests for `useHelper`: exact-identity check that `loading` is the same Ref instance provided (not a snapshot — explicit regression guard for issue #9), reactivity of `loading.value` after injection, exact-identity + call-forwarding for `toast`, and the no-provide case (`undefined`, no crash) |

Test-only diff. No `src/composables/useHelper.ts` change.

## Command
```
npm run test
```
(Note: `npm run test:coverage` — added by the sibling `issue-7-coverage-
tooling` node — is not available on this branch since that node's diff
lives on a separate, still-unmerged branch. Ran the pre-existing `npm run
test` instead; real coverage re-measurement will happen naturally once
both branches are merged into `staging`.)

## Output
```
 RUN  v2.1.9 /Users/_david/Workspace/Project/resume/resume-vuejs-website

 ✓ src/utilities/index.spec.ts (13 tests) 3ms
 ✓ src/composables/useTheme.spec.ts (6 tests) 106ms
 ✓ src/stores/candidate.spec.ts (11 tests) 7ms
 ✓ src/stores/auth.spec.ts (9 tests) 8ms
 ✓ src/composables/useDocument.spec.ts (9 tests) 18ms
 ✓ src/composables/useCandidate.spec.ts (8 tests) 32ms
 ✓ index.spec.ts (1 test) 2ms
 ✓ src/composables/useHelper.spec.ts (4 tests) 15ms
 ✓ src/components/veevalidate/VeeForm.spec.ts (11 tests) 83ms
 ✓ src/composables/useInitTable.spec.ts (4 tests) 3ms

 Test Files  10 passed (10)
      Tests  76 passed (76)
   Start at  18:26:56
   Duration  1.41s (transform 643ms, setup 0ms, collect 1.75s, tests 279ms, environment 4.12s, prepare 715ms)
```
(72 → 76 tests, no regressions.) 4 `[Vue warn]: injection "..." not found`
lines appear on stderr for the intentional no-provide test case — expected
noise from Vue's own `inject()` warning, not a test failure (the test
asserts exactly this: undefined, no crash).

Also ran `npm run build`:
```
✓ 1343 modules transformed.
...
✓ built in 4.91s
```
Same pre-existing chunk-size warning only.

Also ran `npm run lint` — first pass found 1 real finding:
```
/Users/_david/Workspace/Project/resume/resume-vuejs-website/src/composables/useHelper.spec.ts
  12:14  error  'args' is defined but never used. Allowed unused args must match /^_/u  no-unused-vars
```
(An interface parameter name, `(args: unknown) => void`, tripped the same
rule as a real unused variable.) Fixed: `args` → `_args`. Re-ran:
```
> eslint src --ext .js,.ts,.vue
```
Exit 0, no output.

## Acceptance
| Criterion | Evidence |
|---|---|
| `useHelper.ts` has real test coverage | `✓ src/composables/useHelper.spec.ts (4 tests) 15ms` |
| Issue #9's fix (return the Ref, not a snapshot) has a regression guard | Test "returns the exact provided spinner Ref, not a snapshot of its value" — `expect(result.loading).toBe(refSpinner)` (identity, not deep-equality) |
| No regressions | `Tests  76 passed (76)` (was 72) |
| Build/lint green | `✓ built in 4.91s`; lint exit 0 after the 1 real fix |
| Scope is test-only, single file | `git status --short` shows only `?? src/composables/useHelper.spec.ts` |

## Noticed, not done
- `src/composables/useHelper.ts`'s `inject()` calls have no type argument
  (return type `unknown`) — worked around with casts in the spec file,
  didn't touch the source's typing (out of this node's scope, would widen
  the diff beyond "add a test").
- With this node + `issue-7-coverage-tooling` both merged, every file
  under `src/{utilities,stores,composables}/**` will have real test
  coverage except the barrel `src/composables/index.ts` (re-exports only,
  nothing to test). All `.vue` components except `VeeForm.vue` remain
  untested — issue #7's own stated target ("business logic" =
  stores/composables/utilities) doesn't require this, logged as a
  possible future scope decision, not assumed in-scope.

## Seal gate
None — no outward-facing action taken (no commit/push/merge). Branch left
uncommitted, deferred to `/ship` with operator approval.

## Status
`sealed_pending_verifier`
