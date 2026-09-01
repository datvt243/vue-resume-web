# 2026-09-01 — docs-readme-issue7-close-sync

- Worker: implementer
- Version: 0.1.0
- Node: `docs-readme-issue7-close-sync` (new node, per LAI-13)
- Task: "sync lại README luôn" (operator, right after closing issue #7)

## Why this node
Issue #7 was just closed (`gh issue close 7`, with a summary comment
citing the real coverage measurement). `README.md`'s "Known Issues" table
still listed #7 as an open issue — stale as of this closure. Same pattern
as the earlier `docs-known-bugs-table-sync`/`readme-env-example-cleanup`
nodes: keep README's issue-number claims matching live GitHub state.

## Branch
`docs/sync-readme-issue7-close`, checked out from `staging`.

## Diff
| File | Why |
|---|---|
| `README.md` | "Known Issues" table: removed the `#7` row (only `#8` remains, re-confirmed still OPEN). Roadmap: `- [ ] Hoàn thiện test coverage với Vitest (#7 — đã có nền, còn thiếu nhiều component)` → `- [x] Test coverage với Vitest (#7 — 96%+ coverage cho stores/composables/utilities + VeeForm.vue; component còn lại ngoài scope ban đầu)` |

Docs-only diff, no `src/` change.

## Command
```
npm run build
```

## Output
```
✓ 1343 modules transformed.
...
✓ built in 4.91s
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
| README no longer claims #7 is open | `git diff README.md` shows the `#7` row removed from Known Issues |
| Roadmap reflects the real, measured result, not a vague "đã có nền" | Roadmap line now cites `96%+ coverage cho stores/composables/utilities + VeeForm.vue` |
| No other README issue-number references are stale | Fresh `gh issue list --state all` cross-check: #8 OPEN (unchanged), #55-61,63 all still OPEN (unchanged), no other issue numbers appear in README |
| Build/lint green | `✓ built in 4.91s`; lint exit 0 |
| Scope is docs-only | `git status --short` shows only `M README.md` |

## Noticed, not done
- README has no "how to run tests" section at all (`npm run test` /
  `npm run test:coverage` aren't mentioned anywhere in "Getting Started").
  Out of this node's scope (operator asked to sync the stale #7
  reference, not add new documentation sections) — flagged as a possible
  future doc improvement.

## Seal gate
None — no outward-facing action taken (no commit/push/merge). Branch left
uncommitted, deferred to `/ship` with operator approval.

## Status
`sealed_pending_verifier`
