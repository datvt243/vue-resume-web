# 2026-08-25 — issue-7-vitest-setup — correction after REOPEN

- Worker: implementer
- Node: `issue-7-vitest-setup`
- Supersedes/appends: `2026-08-25-issue-7-vitest-setup.md` (kept, not
  deleted, per `evidence/README.md` "never delete" rule)

## What the verifier found
`agent-hub/evidence/verifier/2026-08-25-issue-7-vitest-setup-reopen.md` —
`yarn.lock` was modified (952 lines) by one of the `npm install` runs,
undisclosed in the original note's Diff table, contradicting
`doctrine/domains/PROJECT.md`'s own trap ("do NOT run yarn install unless
the task explicitly asks"). Root cause not fully diagnosed (no
`postinstall`/`preinstall` script, no `packageManager` field, no
husky/yarnrc found in the repo that would explain `npm install` touching
`yarn.lock`) — regardless of cause, it's undisclosed scope and doesn't
belong in this diff.

## Fix
```
git checkout main -- yarn.lock
```
Reverted `yarn.lock` back to `main`'s version. `package-lock.json` (the
project's actual source of truth per `doctrine/MEMORY.md`) is unaffected
and still reflects the new `vitest`/`jsdom`/`@vue/test-utils` deps.

## Re-verified after revert
```
✓ built in 4.72s
```
```
 ✓ src/utilities/index.spec.ts (13 tests) 3ms
 Test Files  1 passed (1)
      Tests  13 passed (13)
```
`git status --short` now shows only the files the original Diff table
claimed: `package.json`, `package-lock.json`, `vitest.config.ts`,
`src/utilities/index.spec.ts`, plus the two doctrine files — `yarn.lock`
no longer appears.

## Acceptance (delta from original note)
| Criterion | Evidence |
|---|---|
| `yarn.lock` no longer touched | `git diff main --stat -- yarn.lock` → empty |
| Build/test still green after revert | `✓ built in 4.72s`; `13 passed (13)` |
| Diff now matches exactly what the note claims | `git status --short` — no extra files |

## Seal gate
Still uncommitted on `feature/vitest-test-setup` — no outward-facing
action taken.
