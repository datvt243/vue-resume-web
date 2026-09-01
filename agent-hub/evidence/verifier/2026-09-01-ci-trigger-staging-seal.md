# 2026-09-01 — ci-trigger-staging — SEAL

- Worker: verifier
- Version: 0.1.0
- Node: `ci-trigger-staging`
- Verdict: **SEAL**

## Self-grading check
Fresh subagent, spawned specifically to verify this node. This session
did not write the diff under review. `NeverVerifyOwnWork` satisfied by
construction.

## Independent checks (not just trusting the note)

**Branch / scope**
- `git branch --show-current` → `chore/ci-trigger-staging` (not `main`,
  not `staging`). `NoMainEdit` satisfied.
- `git status --short` → `M .github/workflows/ci.yml`,
  `M agent-hub/doctrine/MEMORY.md`,
  `M agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` (this node's own
  PENDING row, already present pre-verify), plus the untracked evidence
  note itself. `git diff staging --stat` confirms only those 3 tracked
  files changed, 4 insertions / 3 deletions total. Zero `src/` files
  touched, zero code in `haven/` (`CODE_IN_HAVEN` clear).

**`ci.yml` read directly**
```yaml
on:
    push:
        branches: [main, staging]
    pull_request:
        branches: [main, staging]
```
Both triggers list `[main, staging]`. Rest of the file (checkout →
setup-node → npm ci → lint → build) structurally untouched — matches the
note's claim of a 2-line diff.

**Build**
Fresh `npm run build` → `✓ built in 5.10s`, same pre-existing chunk-size
warning only (`VeeForm-*.js` 997.61 kB), no new warnings/errors.

**Lint**
Fresh `npm run lint` → exit 0, no output. Command matches
`doctrine/MEMORY.md`'s documented lint command, run from repo root.

**Gap was real — independently confirmed via `gh run list`**
`gh run list --workflow=ci.yml --limit=30 --json ...` (30 runs, back to
2026-08-21) — every `pull_request` event's `headBranch` is either
`staging` (the `/release` PRs: "release: v1.3.0"/"v1.2.0"/"v1.1.0", head
= staging, base = main) or one anomaly: `chore/agent-hub-boot-reuse-guards`
(PR #74). Checked that one directly: `gh pr view 74 --json baseRefName`
→ `"baseRefName":"main"` — a task branch that was PR'd straight into
`main`, bypassing `staging` (a known rule violation, already flagged by
the implementer's own note and reconciled in a sibling "sync staging from
main" node). Zero `pull_request` runs in this history ever had
`staging` as the base branch. This confirms the claimed gap (every
day-to-day `/ship` PR into `staging` got zero independent CI check) was
real prior to this fix, not just inferred from reading the old YAML.

## Acceptance criteria
| Criterion | Evidence | Status |
|---|---|---|
| `staging` PRs/pushes now get a real CI gate | `ci.yml` read directly: `branches: [main, staging]` on both triggers | met |
| No regression to existing `main` trigger | `main` still present, unchanged in both lists | met |
| Build/lint still green | fresh `npm run build` ✓ 5.10s; fresh `npm run lint` exit 0 | met |
| Scope is CI-config + doctrine-note only | `git diff staging --stat` = 3 files, no `src/` | met |
| Claimed gap was real (not just inferred) | `gh run list` + `gh pr view 74` — no `pull_request` run in 30-run history ever targeted `staging` as base | met |

## Forbidden states scan
| State | Hit? |
|---|---|
| `ADHOC_WORK` | No — node exists on diagram, went through implementer |
| `NO_EVIDENCE` | No — evidence note present |
| `EDIT_UNVERIFIED` | No — build/lint independently re-run and read back by this session |
| `CODE_IN_HAVEN` | No — only `.yml`/`.md` changed, no code in `haven/` |
| `DIAGRAM_DRIFT` | No — sealing now, PM status updated in this same pass |
| `MAIN_EDIT` | No — branch `chore/ci-trigger-staging`, confirmed via `git branch --show-current` |

## Seal gate
No outward-facing action taken yet (branch still uncommitted, per the
implementer note) — correct, deferred to `/ship` with operator approval.
Nothing for the verifier to gate here.

## Proportionality
Diff is minimal: 2-line YAML change + 1 doctrine-note line + this
diagram row. No opportunistic scope creep.

## Decision
SEAL. Every acceptance criterion has citable, independently-reproduced
evidence. PM status updated PENDING → SEALED on
`haven/diagrams/dev-loop.prime-mermaid.md`.
