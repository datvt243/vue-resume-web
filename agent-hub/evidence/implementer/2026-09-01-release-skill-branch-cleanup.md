# 2026-09-01 — release-skill-branch-cleanup

- Worker: implementer
- Version: 0.1.0
- Node: `release-skill-branch-cleanup` (new node, per LAI-13)
- Task: "audit lại toàn bộ chuỗi xem có gì lệch không" → "fix cả 3 vấn đề luôn" (operator, fix 3/3)

## Why this node
Audit finding: `.claude/skills/release/SKILL.md` step 3 creates
`release/vX.Y.Z-version-bump`, PRs it into `staging`, merges it — but
never deletes the branch afterward. `/ship` (the sibling skill) has
explicit branch-cleanup logic; `/release` didn't. Confirmed real litter
on the remote before this fix: `release/v1.2.0-version-bump` and
`release/v1.3.0-version-bump`, both already merged into `staging`/`main`,
neither deleted.

Same audit pass also found 2 more merged-but-undeleted branches, not
caused by this specific gap but cleaned up together since they're the
same class of problem:
- `fix/fix-env` (PR #68) — merged into `staging` correctly, just never
  cleaned up afterward.
- `chore/agent-hub-boot-reuse-guards` (PR #74) — merged straight into
  `main`, bypassing `staging` (a branch-model violation, separately
  reconciled by the sibling `staging`-sync node run just before this
  one in the same session — its content is now in both `main` and
  `staging`).

## Branch
`chore/release-branch-cleanup`, checked out from `staging`.

## Diff
| File | Why |
|---|---|
| `.claude/skills/release/SKILL.md` | Step 3: after `gh pr merge <PR#> --merge` + `git checkout staging && git pull`, added `git branch -d release/vX.Y.Z-version-bump` + `git push origin --delete release/vX.Y.Z-version-bump`, with a short note explaining why it's not optional and citing this audit finding |

## Non-diff actions (real, outward-facing, done under the same approval)
Deleted 4 confirmed-merged stray branches from the remote:
```
git push origin --delete release/v1.2.0-version-bump
git push origin --delete release/v1.3.0-version-bump
git push origin --delete fix/fix-env
git push origin --delete chore/agent-hub-boot-reuse-guards
```
Each was re-verified merged into BOTH `main` and `staging` immediately
before deletion:
```
git merge-base --is-ancestor origin/<branch> origin/main     # all 4: YES
git merge-base --is-ancestor origin/<branch> origin/staging  # all 4: YES
```
(`chore/agent-hub-boot-reuse-guards` only shows YES for `staging` because
the sibling reconciliation node — "chore: reconcile staging with main"
PR #83 — ran immediately before this one in the same session and merged
its content into `staging` too.)

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
✓ built in 4.99s
```
Same pre-existing chunk-size warning only.

```
> resume-vuejs-website@1.3.0 lint
> eslint src --ext .js,.ts,.vue
```
Exit 0, no output. (First attempt was blocked by a transient Claude Code
permission-classifier hiccup unrelated to the diff itself — retried
immediately, ran clean.)

## Acceptance
| Criterion | Evidence |
|---|---|
| `/release` will delete its own branch on future runs | `.claude/skills/release/SKILL.md` diff: `git branch -d`/`git push origin --delete` added right after the merge step |
| Existing litter is gone | 4x `git push origin --delete` succeeded; `git ls-remote --heads origin` re-checked after, none of the 4 remain |
| No branch deleted before confirming it's actually merged | Each of the 4 re-verified via `git merge-base --is-ancestor` against BOTH `main` and `staging` immediately before its delete |
| Build/lint still green | `✓ built in 4.99s`; lint exit 0 |
| Scope is skill-doc only | `git status --short` shows only `.claude/skills/release/SKILL.md` |

## Noticed, not done
- `/release`'s own step 7 "sync-back check" only diffs `package.json`
  between `staging`/`main` — it would NOT have caught the drift that PR
  #74 caused (agent-hub recipe files), because that drift wasn't created
  by `/release` itself, it was an external branch-model violation
  (a PR targeting `main` directly). Widening step 7 to a full-repo diff
  check was considered but not done here — out of this node's specific
  scope (branch cleanup), and the real fix for that failure mode is
  procedural (never target `main` except via `/release`), not a wider
  diff check. Flagging as a possible future hardening if this recurs.

## Seal gate
Branch deletions above ARE outward-facing and were done under the
operator's explicit "fix cả 3 vấn đề luôn" approval (same approval
covering this whole 3-part audit-fix task). No commit/push/merge of the
skill-doc diff itself yet — that's still deferred to `/ship`.

## Status
`sealed_pending_verifier`
