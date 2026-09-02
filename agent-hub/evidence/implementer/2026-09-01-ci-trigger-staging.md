# 2026-09-01 — ci-trigger-staging

- Worker: implementer
- Version: 0.1.0
- Node: `ci-trigger-staging` (new node, per LAI-13)
- Task: "audit lại toàn bộ chuỗi xem có gì lệch không" → "fix cả 3 vấn đề luôn" (operator)

## Why this node
A live audit of the 2-tier release workflow (`main`/`staging`) found
`.github/workflows/ci.yml` only triggers on `push`/`pull_request` to
`[main]`. Confirmed empirically, not just from the YAML, via `gh run
list --workflow=ci.yml --limit=10`: none of PR #77/#78/#79/#80/#81 (all
`/ship` PRs into `staging` from this session) show up — every day-to-day
PR into `staging` gets zero independent CI check. Only PRs that happen to
target `main` directly (the `/release` PR, or a rule violation like PR
#74 — see the sibling `sync staging from main` reconciliation done just
before this node) ever got a real GitHub Actions gate.

## Branch
`chore/ci-trigger-staging`, checked out from `staging` (already
up to date with the just-merged `main → staging` reconciliation PR #83).

## Diff
| File | Why |
|---|---|
| `.github/workflows/ci.yml` | `branches: [main]` → `branches: [main, staging]` on both `push` and `pull_request` triggers |
| `agent-hub/doctrine/MEMORY.md` | CI row updated to note `staging` is now covered too, and why (audit finding) |

## Command
```
npm run build
```
```
npm run lint
```

## Output
```
✓ 1343 modules transformed.
...
✓ built in 5.33s
```
Same pre-existing chunk-size warning only.

```
> resume-vuejs-website@1.3.0 lint
> eslint src --ext .js,.ts,.vue
```
Exit 0, no output.

`ci.yml` re-read directly after the edit to confirm it's still well-formed
YAML — 2-line diff only, structure (jobs/steps) untouched, no local YAML
linter available in this environment (`python3 -c "import yaml"` failed,
no module) so verified by direct read instead.

## Acceptance
| Criterion | Evidence |
|---|---|
| `staging` PRs/pushes now get a real CI gate | `ci.yml` diff: `branches: [main, staging]` on both triggers |
| No regression to the existing `main` trigger | `main` still present in both lists, unchanged behavior for `main` |
| Build/lint still green | `✓ built in 5.33s`; lint exit 0 |
| Scope is CI-config + doctrine-note only | `git status --short` shows only `.github/workflows/ci.yml` + `agent-hub/doctrine/MEMORY.md` |

## Noticed, not done
- The real proof this works (a PR into `staging` actually triggering a
  fresh `ci.yml` run) will only be observable once this node's own PR is
  shipped — can't be verified before that PR exists. Flagging so the
  verifier/operator checks `gh run list --workflow=ci.yml` again after
  this ships, to confirm the new trigger actually fires for real (not
  just "the YAML looks right").

## Seal gate
None — no outward-facing action taken (no commit/push/merge) by this note
itself. Branch left uncommitted, deferred to `/ship` with operator
approval (already given via "fix cả 3 vấn đề luôn").

## Status
`sealed_pending_verifier`
