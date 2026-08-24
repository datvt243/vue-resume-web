# 2026-08-25 — docs-known-bugs-table-sync — SEAL

- Worker: verifier
- Verdict: **SEAL**
- Node: `docs-known-bugs-table-sync` (was IN_PROGRESS, now SEALED)
- Evidence note reviewed: `evidence/implementer/2026-08-25-docs-known-bugs-table-sync.md`
- `NeverVerifyOwnWork`: satisfied — this session did not write the diff, was launched fresh specifically to verify it.

## Independent checks performed (own session, source files re-read directly, not the implementer's diff/reasoning)

| Check | Result |
|---|---|
| Branch | `git branch --show-current` → `docs/sync-known-bugs-table` (not `main`) |
| `git status`/`git diff --stat` | Only `.claude/CLAUDE.md` and `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` changed (+ new evidence note, + untracked unrelated `.claude/skills/run-dev/`) — no code files touched |
| GitHub issue states | `gh issue view` on #1,2,3,4,5,7,8,9,10 individually → #1,2,3,4,5,9,10 all `CLOSED`; #7, #8 both `OPEN`. Matches the table's current content exactly (only #8 kept as a row, #1-5/9/10 removed) |
| `src/routers/index.ts:78` | `createWebHashHistory()` in use → #1 genuinely fixed |
| `src/services/auth.ts` `handleLogin` | `method: 'post'`, `data: { email, password }` → #2 genuinely fixed |
| `src/components/veevalidate/VeeForm.vue` `getFields` | `const { valid: _valid, ...rest } = e; return rest` (destructure, no `delete`) → #3 genuinely fixed |
| `src/components/veevalidate/VeeForm.vue` `reset()` | `e.default ?? ''`, no `e.nam` typo → #4 genuinely fixed |
| `src/components/Toasts.vue` | `grep -n "v-html"` → no matches → #5 genuinely fixed |
| `src/composables/useHelper.ts` | `return { loading: refSpinner, toast: refToast }` — returns the injected Ref itself, no `toValue()` snapshot → #9 genuinely fixed |
| `src/components/GroupTags.vue` | `const tags = ref([...props.modelValue])`, all mutations go through the local `tags`/`newTags` copy, `props.modelValue` never written → #10 genuinely fixed |
| `src/stores/auth.ts` | `localStorage.setItem('token', val)` / `getItem('token')` still present → #8 genuinely still open, correctly kept |
| Build | Re-ran `npm run build` myself → `✓ built in 4.94s`, only the same pre-existing >500kB `VeeForm-*.js` chunk-size warning, no errors |
| Output truncation | None — full build output read back, nothing hidden |
| Diagram sync | New node `docs-known-bugs-table-sync` was added to `haven/diagrams/dev-loop.prime-mermaid.md` in the same diff (IN_PROGRESS at implementer stage) — no `DIAGRAM_DRIFT` |
| Proportionality | Diff touches only the Known Bugs table as scoped; stale `.js` paths elsewhere in the same file were noticed but correctly left out of scope ("Noticed, not done") — no opportunistic scope creep |

## Acceptance criteria (from the note) — all cited with independent evidence
1. Closed issues #1,2,3,4,5,9,10 removed from the table — confirmed, table now has one data row (#8).
2. Still-open issues represented — #8 present; #7 already covered under `## Gotchas`, correctly not duplicated.
3. Table no longer instructs "fixing" already-fixed code — old rows gone, explicit note added naming the closed issues.
4. Build green after edit — confirmed independently (`✓ built in 4.94s`).
5. Branch is not `main` — confirmed independently (`docs/sync-known-bugs-table`).

## Forbidden states scanned
`ADHOC_WORK` no (node exists, worker used) · `NO_EVIDENCE` no (note present) · `EDIT_UNVERIFIED` no (build re-run independently) · `CODE_IN_HAVEN` no (only docs/diagram `.md` files changed) · `DIAGRAM_DRIFT` no (diagram updated in same diff) · `MAIN_EDIT` no (branch confirmed non-main).

## Seal gate
No outward-facing action reviewed or approved here — diff remains uncommitted on `docs/sync-known-bugs-table`. Commit/merge to `main` is a separate `/ship` step requiring its own operator approval.

## PM status
Updated `docs-known-bugs-table-sync` row in `haven/diagrams/dev-loop.prime-mermaid.md` from `IN_PROGRESS` to `SEALED`.
