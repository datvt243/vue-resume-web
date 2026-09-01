# 2026-09-01 — issue-7-coverage-tooling

- Worker: implementer
- Version: 0.1.0
- Node: `issue-7-coverage-tooling` (new node, per LAI-13)
- Task: "tiếp tục làm tới khi done" (operator, continuing issue #7)

## Why this node
Issue #7 (https://github.com/datvt243/resume-vuejs-website/issues/7)
states a success target — "Coverage >60% cho business logic (stores +
composables + utilities)" — that no prior `issue-7-*` node ever actually
measured. Every prior node only asserted individual `*.spec.ts` files
pass, never a real coverage %. Without a real number, "the target is met"
would be `EDIT_UNVERIFIED` — a claim, not evidence. This node closes that
gap: install a coverage tool, wire it, run it for real, read the output
back.

## Branch
`feature/vitest-coverage-tooling`, checked out from `staging`.

## Diff
| File | Why |
|---|---|
| `package.json` | added `@vitest/coverage-v8@2.1.9` devDependency (pinned to match `vitest@2.1.9`, same pinning rationale as the original `issue-7-vitest-setup` decision — see `doctrine/domains/PROJECT.md` → Decisions); added `test:coverage` script |
| `package-lock.json` | npm-generated, matches the above |
| `vitest.config.ts` | added `test.coverage` block: `provider: 'v8'`, `reporter: ['text', 'text-summary']`, `include: ['src/utilities/**', 'src/stores/**', 'src/composables/**']` — scoped to match issue #7's own "business logic" wording, deliberately excludes `.vue` components (not part of that stated target, and most have no tests yet — including them would just noise-drop the % without being the thing actually being measured) |
| `agent-hub/doctrine/MEMORY.md` | Test row updated: real test count (72, was stale at 55/incomplete), new `test:coverage` row with the measured number below |

`yarn.lock` was touched by `npm install` (1115-line diff) despite not
running yarn — same known trap as `issue-7-vitest-setup`. Reverted via
`git checkout staging -- yarn.lock` before proceeding; confirmed via
`git status --short` it's no longer in the diff.

## Command
```
npm run test:coverage
```
(= `vitest run --coverage`, new script added by this diff — no prior
command in `doctrine/MEMORY.md` covered this, adding it was necessary to
give a future session an exact command to reproduce this evidence, per
`doctrine/MEMORY.md`'s own rule: "If `package.json` scripts change... fix
the table above IMMEDIATELY".)

## Output
```
 RUN  v2.1.9 /Users/_david/Workspace/Project/resume/resume-vuejs-website
      Coverage enabled with v8

 ✓ src/utilities/index.spec.ts (13 tests) 5ms
 ✓ src/stores/candidate.spec.ts (11 tests) 10ms
 ✓ src/stores/auth.spec.ts (9 tests) 9ms
 ✓ src/composables/useTheme.spec.ts (6 tests) 197ms
 ✓ src/composables/useCandidate.spec.ts (8 tests) 29ms
 ✓ src/composables/useDocument.spec.ts (9 tests) 38ms
 ✓ src/components/veevalidate/VeeForm.spec.ts (11 tests) 86ms
 ✓ index.spec.ts (1 test) 2ms
 ✓ src/composables/useInitTable.spec.ts (4 tests) 4ms

 Test Files  9 passed (9)
      Tests  72 passed (72)
   Start at  18:21:20
   Duration  2.02s (transform 763ms, setup 0ms, collect 2.14s, tests 379ms, environment 4.84s, prepare 898ms)

 % Coverage report from v8
------------------|---------|----------|---------|---------|-------------------
File              | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------|---------|----------|---------|---------|-------------------
All files         |   93.97 |    90.37 |      90 |   93.97 |
 composables      |   89.54 |    88.13 |   80.95 |   89.54 |
  index.ts        |       0 |        0 |       0 |       0 | 1
  useCandidate.ts |   89.77 |    88.46 |   85.71 |   89.77 | 84-85,92-99
  useDocument.ts  |      95 |      100 |   85.71 |      95 | 35,104,122-123
  useHelper.ts    |       0 |        0 |       0 |       0 | 1-17
  useInitTable.ts |     100 |    71.42 |     100 |     100 | 28-29
  useTheme.ts     |     100 |      100 |     100 |     100 |
 stores           |     100 |    93.47 |     100 |     100 |
  auth.ts         |     100 |    93.33 |     100 |     100 | 12
  candidate.ts    |     100 |    93.54 |     100 |     100 | 24,47
 utilities        |     100 |       90 |     100 |     100 |
  index.ts        |     100 |       90 |     100 |     100 | 39,62,72
------------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 93.97% ( 359/382 )
Branches     : 90.37% ( 122/135 )
Functions    : 90% ( 36/40 )
Lines        : 93.97% ( 359/382 )
================================================================================
```

Also ran `npm run build`:
```
✓ 1343 modules transformed.
...
✓ built in 5.15s
```
Same pre-existing chunk-size warning only.

Also ran `npm run lint`:
```
> eslint src --ext .js,.ts,.vue
```
Exit 0, no output.

## Acceptance
| Criterion | Evidence |
|---|---|
| Issue #7's `>60%` coverage target is actually measured, not asserted | Coverage summary: `Statements: 93.97%`, `Branches: 90.37%` — real tool output, not inferred |
| No regressions | `Tests  72 passed (72)`, same as before this node |
| Build/lint still green | `✓ built in 5.15s`; `npm run lint` exit 0 |
| Known `yarn.lock` trap not repeated silently | Detected via `git status --short` after install, reverted, re-confirmed clean |
| `doctrine/MEMORY.md` kept in sync with the new script | Test + "Test + coverage" rows updated in the same diff |

## Noticed, not done
- `src/composables/useHelper.ts` is the only 0%-covered file in scope
  (composables). It's a 2-line `inject()` wrapper — small, worth a
  dedicated follow-up node (`issue-7-usehelper-composable-tests`) rather
  than folding it in here, keeping this node's diff scoped to "add the
  measurement tool" only (`SmallestDiff`).
- `src/composables/index.ts` shows 0% but is a barrel re-export file (no
  executable logic) — not a real gap, not actionable.
- CI (`.github/workflows/ci.yml`) still doesn't run `npm run test` or
  `npm run test:coverage` — only lint + build. Out of this node's scope
  (a CI change is a separate, outward-facing-adjacent decision), logged
  here for a future node.
- `.vue` components (all except `VeeForm.vue`) remain outside both the
  coverage scope and the test suite — deliberate: issue #7's own target
  only names "business logic" (stores/composables/utilities), and this
  node's job was to measure THAT claim, not expand its definition.

## Seal gate
None — no outward-facing action taken (no commit/push/merge). Branch left
uncommitted, deferred to `/ship` with operator approval.

## Status
`sealed_pending_verifier`

## Correction (2026-09-01, post-SEAL, evidence-accuracy only)
Before shipping, this branch was rebased onto `staging` to pick up the
sibling `issue-7-usehelper-composable-tests` node (merged separately,
PR #78) — `useHelper.ts` was the one 0% file this node's own measurement
flagged. Re-ran `npm run test:coverage` after the rebase:

```
All files         |   96.33 |    91.11 |    92.5 |   96.33 |
 composables      |   93.63 |    89.83 |   85.71 |   93.63 |
  useHelper.ts    |     100 |      100 |     100 |     100 |
...
Statements   : 96.33% ( 368/382 )
Branches     : 91.11% ( 123/135 )
Functions    : 92.5% ( 37/40 )
```

Improved from 93.97%/90.37% to 96.33%/91.11% — not a regression, the
number this node's own note quoted (93.97%) was simply measured before
the sibling node existed. PM status not changed (still SEALED, ratchet
not touched) — this is a number update, not a new defect. `npm run
build` (`✓ built in 5.02s`) and `npm run lint` (exit 0) both re-confirmed
green after the rebase; `yarn.lock` re-confirmed clean (`git status
--short -- yarn.lock` empty).
