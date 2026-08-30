# 2026-08-30 — agent-hub-token-cleanup-20260830

- Worker: implementer
- Version: 0.1.0
- Node: `agent-hub-token-cleanup-20260830` (new node, `IN_PROGRESS` —
  chore, no `src/` code)
- Task (verbatim): operator asked to measure agent-hub's token cost
  (`/hub-tokens`), then, after discussing duplicate-reading findings from
  that report, said: "làm luôn cả #1, #2, #3 / tạo cho tôi 1 file
  REPORT-TOKENS.md ... / tôi cũng có 2 project khác có agent-hub, hãy
  kiểm tra luôn thể / 1. datvt243.github.io / 2. ResumeAPI/backend / và
  agent-hub-init"

## Branch
`chore/agent-hub-token-cleanup` — checked out from `main`. The prior
session's uncommitted work (`feature/vitest-veeform-tests`, SEALED node
`issue-7-veeform-component-tests` + the `issue-8` recheck bookkeeping) was
`git stash push -u` first, so this chore starts from a clean `main`, not
mixed into that unrelated feature branch. Restored via `git stash pop`
onto `feature/vitest-veeform-tests` after this chore's diff was written.

## Diff
| File | Why |
|---|---|
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | Moved 7 full SEALED rows (dated 2026-08-29: `loading-countdown-redesign`, `open-to-work-field`, `home-dashboard-summary`, `home-dashboard-itviec-style`, `sidebar-welcome-style`, `sidebar-cv-status-stats`, `sidebar-welcome-merge-stats`) to compact pointer rows; updated the header note. |
| `agent-hub/haven/diagrams/dev-loop-archive.md` | Appended the 7 rows' full original text VERBATIM (no rewording, per the archive's own no-rewrite convention) under a new "2nd pass" section + header note. |
| `.claude/skills/boot/SKILL.md` | Step 2: stop explicitly reading `agent-hub/CLAUDE.md` (harness auto-injects it once step 1 touches `agent-hub/`). Step 7: replace `ls -lat <dir>` with `find <dir> -maxdepth 1 -type f -name "*.md" -exec ls -t {} +`. |
| `REPORT-TOKENS.md` (repo root, new) | Written report consolidating everything measured/found/fixed this session, per operator's explicit request. |

## Why #1 (archive) — root cause of the 2 duplicate-reading findings reported earlier this session
`/hub-tokens` (run just before this task) flagged the active diagram at
30,122B (>15KB threshold), 8 full SEALED entries not archived (7 real,
since `issue-7-veeform-component-tests` had just been added+SEALED on the
`feature/vitest-veeform-tests` branch — that row stays on the feature
branch, unrelated to this chore branch, not touched here). A large active
diagram is (a) the direct recurring-cost driver every implementer/verifier
session pays (~7.5K of the ~21.5K token recurring load was the diagram
alone), and (b) the reason a harness "file modified externally" notice
(after the verifier subagent's edit) re-surfaced ~90 lines of near-
duplicate content earlier in the session. Archiving shrinks both.

## Why #2/#3 (skill fixes)
Both are things actually observed going wrong THIS session, not
speculative: `agent-hub/CLAUDE.md`'s content appeared twice in context
during `/boot` (once via an explicit `cat`, once via the harness's
automatic nested-CLAUDE.md injection); `ls -lat agent-hub/evidence/{implementer,verifier}/`
returned the repo root's listing instead of the target directory's files,
twice in a row, forcing a `find`-based retry both times.

## Command
```
npm run build
```
(from `doctrine/MEMORY.md` — sanity check only; this diff touches no
application code, `.md` files aren't part of the Vite build.)

## Output (verbatim, tail)
```
dist/assets/VeeForm-CNnT-CVN.js                  997.61 kB │ gzip: 283.12 kB

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 4.85s
```
Same pre-existing chunk-size warning as every prior SEALED node — not
caused by this diff.

## Sibling-repo checks (read-only, `/hub-tokens` script reused as-is against a different `ROOT`)
Operator asked to also check `datvt243.github.io`, `ResumeAPI/backend`,
`agent-hub-init` — measurement only, no edits made to those repos (out of
scope / different repo, different worker identity from this hub).

| Repo | Active diagram size | Flag | Action taken |
|---|---|---|---|
| `datvt243.github.io` | 14,722B (7 SEALED, 10 archived pointers) | ✓ under 15KB threshold | none needed |
| `ResumeAPI/backend` | 24,649B (7 SEALED entries not archived) | ⚠ over 15KB threshold | none — flagged only, different repo |
| `agent-hub-init` | n/a | no `agent-hub/` dir — this is a template/scaffold repo (contains `agent-hub-structure.md`/`agent-hub-templates.md`/`init-agent-hub-prompt.md` etc., not a live hub instance) | not applicable |

Full numeric breakdown for all repos in `REPORT-TOKENS.md`.

## Acceptance
| Criterion | Evidence |
|---|---|
| Active diagram back under the 15KB threshold | `wc -c agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` → `13000` |
| Archive has the 7 rows verbatim, nothing reworded | Diff on `dev-loop-archive.md` — appended text is byte-identical to what was removed from the active file (same `Edit` old_string/new_string pair reused) |
| Skill fixes match what was actually observed wrong this session | `.claude/skills/boot/SKILL.md` diff — both changes cite the specific observed failure (duplicate CLAUDE.md, wrong `ls` output) |
| Build still green | `✓ built in 4.85s`, no errors |
| No app code touched | `git diff main --stat` (see below) limited to `agent-hub/haven/diagrams/*`, `.claude/skills/boot/SKILL.md`, `REPORT-TOKENS.md` |
| Sibling repos measured, not modified | `git status --short` in each sibling repo shows no changes made by this session |

## Noticed, not done
`ResumeAPI/backend`'s `agent-hub/` has the same "diagram over 15KB, 7
SEALED not archived" pattern this chore just fixed here — not touched,
since it's a separate repo/hub with its own worker identity and this
task's authorization was scoped to the frontend repo (operator said
"kiểm tra luôn thể" — check too — not "fix too"). Flagged in
`REPORT-TOKENS.md` as a recommendation for the operator to action
separately if wanted.

## Seal gate
No outward-facing action taken (no commit/push/merge) — everything
uncommitted on `chore/agent-hub-token-cleanup`, deferred to `/ship`.
