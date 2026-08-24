# 2026-08-25 — issue-7-vitest-setup

- Worker: implementer
- Version: 0.1.0
- Node: `issue-7-vitest-setup` (new — GitHub issue #7 had no prior diagram
  node; row will be added directly with the verifier's final verdict, per
  the operator's "gộp lại" (batch) instruction — no separate IN_PROGRESS
  edit for a task that completes within one pass)
- Task (verbatim): "#7 và #8" (operator, via `/todo`) — this note covers
  #7 only; #8 handled as its own separate pass (see
  `2026-08-25-issue-8-jwt-localstorage-recheck.md`)

## Branch
`feature/vitest-test-setup` (checked out from `main` before any change —
`feature/*` per `doctrine/MEMORY.md` → Git workflow, kept after merge).

## Scope decision (SmallestDiff)
Issue #7's own write-up asks for Vitest setup + ~20-30 tests across
utilities/stores/composables/components (~8h estimate, >60% coverage
target). Did ONLY the setup + the easiest, highest-confidence layer (pure
functions in `src/utilities/index.ts`) to prove the infra works end-to-end
with a real, passing, non-trivial test file — not the full 8-hour plan.
Issue #7 stays OPEN; full coverage is separate follow-up scope (see
`doctrine/domains/PROJECT.md` → Traps, updated this pass).

## Diff
| File | Change |
|---|---|
| `package.json` | `vitest@2.1.9`, `@vue/test-utils@2.4.11`, `jsdom@26.1.0` added to `devDependencies`; new `"test": "vitest run"` script |
| `vitest.config.ts` | New — jsdom environment, `globals: true`, `@` alias matching `vite.config.ts` |
| `src/utilities/index.spec.ts` | New — 13 tests covering `formatDate`, `formatDateToInput`, `getLocalizedText`, `wrapLocalizedText` (edge cases: falsy date, single-digit day/month padding, all 3 date formats, null/object localized text, `en`-preservation on wrap) |
| `agent-hub/doctrine/MEMORY.md` | Test command row updated from "DOES NOT EXIST" to the real `npm run test` (per this file's own instruction: fix immediately when `package.json` scripts change) |
| `agent-hub/doctrine/domains/PROJECT.md` | Traps table: "no test suite" entry marked partially fixed with root-caused version pins; added a "Decisions, with reasoning" row for the `vitest@2.1.9`/`jsdom@26.1.0` pin |

## Version-pin root cause (see PROJECT.md decision row for full detail)
- `vitest@^4` (latest at install time) requires `vite@^6\|\|^7\|\|^8`;
  installing it next to the project's `vite@^5.3.1` created a duplicate
  nested `vite@6.4.3`, which broke `vitest.config.ts`'s TS types (two
  incompatible `Plugin<Api>` types). Pinned `vitest@2.1.9` (needs
  `vite@^5.0.0`, matches exactly, no duplicate).
- `jsdom@27.0.1` (latest at install time) throws
  `Error: require() of ES Module .../@csstools/css-calc/dist/index.mjs not
  supported` on every test run (`ERR_REQUIRE_ESM`) — transitive
  `@asamuzakjp/css-color` dependency. Pinned `jsdom@26.1.0`, predates the
  regression, clean run.

## Commands
```
npm run build
npm run test
npm run lint
```
(all three from `doctrine/MEMORY.md`, repo root)

## Output
```
✓ built in 4.65s
```
```
 RUN  v2.1.9 /Users/_david/Workspace/Project/ResumeAPI/frontend

 ✓ src/utilities/index.spec.ts (13 tests) 3ms

 Test Files  1 passed (1)
      Tests  13 passed (13)
   Duration  436ms (transform 34ms, setup 0ms, collect 22ms, tests 3ms, environment 218ms, prepare 44ms)
```
```
> vue-resume-web@0.0.0 lint
> eslint src --ext .js,.ts,.vue

(no output — exit 0)
```

## Acceptance
| Criterion | Evidence |
|---|---|
| Vitest actually installed and runnable, no version conflict | `npm run test` → `Test Files 1 passed (1)`, `Tests 13 passed (13)`, no `ERR_REQUIRE_ESM`/type errors |
| At least one real (non-trivial) test file, on the layer issue #7 itself ranks easiest/first | `src/utilities/index.spec.ts`, 13 cases across all 4 exported functions incl. edge cases |
| Existing behavior (build, lint) unaffected | `npm run build` → `✓ built in 4.65s`; `npm run lint` → exit 0, no output |
| Doctrine command table fixed immediately per its own rule | `doctrine/MEMORY.md` Test row updated same pass |
| Branch is not `main` | `git branch --show-current` → `feature/vitest-test-setup` |
| No scope creep into full 60% coverage plan | Only `src/utilities/` touched with tests; `src/stores/`, `src/composables/`, components untouched |

## Noticed, not done
- `.github/workflows/ci.yml` still only runs lint + build, not `npm run
  test` — natural follow-up now that a real test command exists, but
  wiring CI wasn't part of this task; needs its own pass.
- Full issue #7 scope (stores/composables/components, >60% coverage)
  remains — only the setup + easiest layer was done here.
- `npm install` prints an `EBADENGINE` warning (`entities@8.0.0` wants
  Node `>=20.19.0`, environment has `v20.18.0`) — non-fatal, install and
  tests both succeeded anyway, flagging in case it becomes a real problem
  later with a stricter engine-check in CI.

## Seal gate
No outward-facing action taken (no commit/push/merge) — diff uncommitted
on `feature/vitest-test-setup`. Commit + merge to `main` goes through
`/ship`, separate approval.
