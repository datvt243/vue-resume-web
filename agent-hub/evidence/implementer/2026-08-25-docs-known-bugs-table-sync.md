# 2026-08-25 — docs-known-bugs-table-sync

- Worker: implementer
- Version: 0.1.0
- Node: `docs-known-bugs-table-sync` (new — no prior node covered this; added
  IN_PROGRESS row to `haven/diagrams/dev-loop.prime-mermaid.md`, same
  pattern as `eslint-lint-actually-runs`)
- Task (verbatim): "Update the Known Bugs table in .claude/CLAUDE.md:
  remove rows for issues that are now closed on GitHub (#1, #2, #3, #4,
  #5, #9, #10 — all SEALED on the agent-hub diagram), keep only rows for
  issues still open (#7 no test coverage, #8 JWT in localStorage), and fix
  the table so it doesn't tell a future session to 'fix' something already
  fixed"

## Branch
`docs/sync-known-bugs-table` (checked out from `main` before editing —
docs-only change, `docs/*` prefix per `doctrine/MEMORY.md` → Git workflow).

## Pre-check — confirmed each "known bug" is actually fixed in current source
The root `.claude/CLAUDE.md` predates the JS→TS migration (issue #13,
SEALED) — its file paths (`routers/index.js`, `services/auth.js`,
`useHelper.js`) no longer exist; current paths are `.ts`. Read the real
files before editing:
- `src/routers/index.ts:78` → `history: createWebHashHistory()` (#1 fixed).
- `src/services/auth.ts` → `handleLogin` uses `method: 'post'`,
  `data: { email, password }` (#2 fixed).
- `src/components/veevalidate/VeeForm.vue:35-38` → `const { valid: _valid,
  ...rest } = e; return rest` (destructuring, no `delete`) (#3 fixed).
- `src/components/veevalidate/VeeForm.vue:96` → `[e.name]: e.default ??
  ''` (no `e.nam` typo) (#4 fixed).
- `src/components/Toasts.vue` → `grep -n "v-html"` returns nothing (#5 fixed).
- `src/composables/useHelper.ts:10-14` → `const refSpinner =
  inject('spinner'); ... loading: refSpinner` (returns the Ref itself, no
  `toValue`) (#9 fixed).
- `src/components/GroupTags.vue:17-38` → `const tags = ref([...props.modelValue])`,
  mutates the local copy, emits `update:modelValue` — never touches
  `props.modelValue` directly (#10 fixed).
- `#8` (JWT in `localStorage`) — confirmed still true: `src/stores/auth.js`
  API section of the same file already documents `localStorage` key
  `"token"`. GitHub issue #8 is OPEN. Kept.
- `#7` (no test coverage) — real and open (GitHub #7 OPEN), but it's not a
  "location + anti-pattern" fact — it's a coverage gap, and the file
  already covers it under `## Gotchas` ("No tests — zero test setup...
  tracked in #7"). Not duplicated into the Known Bugs table — would be
  redundant, not "smallest diff."

## Diff
| File | Change |
|---|---|
| `.claude/CLAUDE.md` | Known Bugs table: removed the 7 rows for #1,2,3,4,5,9,10 (all closed/fixed, confirmed above); kept/added one row for #8 (still open); added a one-line note above "Full backlog" naming the fixed issues so a future session doesn't try to re-fix them |

## Command
```
npm run build
```
(repo root, exact command from `doctrine/MEMORY.md` — no test command exists in this project)

## Output
```
✓ built in 5.00s
```
(only pre-existing >500kB chunk-size warning on `VeeForm-*.js`, unrelated to this docs-only diff — same warning present before this change)

## Acceptance
| Criterion | Evidence |
|---|---|
| Closed issues (#1,2,3,4,5,9,10) removed from the table | Table now has one data row (#8); confirmed each was fixed in source, see Pre-check |
| Still-open issues represented | #8 kept as the only row; #7 already covered in `## Gotchas`, not duplicated |
| Table no longer tells a future session to "fix" already-fixed code | Old rows removed; replacement note explicitly says #1,2,3,4,5,9,10 "are fixed and closed — don't re-\"fix\" them" |
| Build still green after the edit | `✓ built in 5.00s` |
| Branch is not `main` | `git branch --show-current` → `docs/sync-known-bugs-table` |

## Noticed, not done
- `.claude/CLAUDE.md`'s Directory Map / API section still shows some stale
  `.js` paths (e.g. `stores/auth.js`, `stores/candidate.js` — need to
  verify against actual filenames) left over from the same TS migration.
  Out of scope for this task (only the Known Bugs table was asked for) —
  flagging for a future docs pass.

## Seal gate
No outward-facing action taken (no commit/push/merge) — diff is currently
uncommitted on `docs/sync-known-bugs-table`. Commit + merge to `main` goes
through `/ship`, separate operator approval.
