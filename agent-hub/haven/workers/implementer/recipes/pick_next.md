# Contract
- Input: `{task: string}`
- Output: `{node, diagram, current_state, acceptance: string[],
  files: string[], blocked_by: string|null}`

> [GUARD, added 2026-08-31] If `/boot` already ran in THIS SAME session,
> `NORTHSTAR.md` / `doctrine/MEMORY.md` / `doctrine/domains/PROJECT.md` /
> `haven/diagrams/` are already in context from that pass — steps 1-2 below
> REUSE that content, don't `Read` it again (a second full read of the same
> 4 files is pure duplication, same class of token waste as the
> `agent-hub/CLAUDE.md` case already fixed in `boot/SKILL.md`). Only `Read`
> for real when: (a) `/worker implementer` is invoked without a prior
> `/boot` this session, or (b) the content might have changed since it was
> last read.

## Steps
1. Get `NORTHSTAR.md` + `doctrine/MEMORY.md` + `doctrine/domains/PROJECT.md`
   — reuse from `/boot` if available (see GUARD above), else `Read` fresh.
2. Get every diagram in `haven/diagrams/`, list nodes + PM status — reuse
   from `/boot` if available (see GUARD above), else `Read` fresh.
3. If the task doesn't match an existing node, don't invent work —
   append a new row to the PM status table for it (`IN_PROGRESS`) instead
   of blocking, matching how prior ad-hoc/operator-direct tasks were
   added (e.g. `eslint-lint-actually-runs`).
4. If genuinely ambiguous (task unclear, not just "no existing node") —
   stop and ask, don't guess.
5. Locate code anchors by grepping `../src/` — real paths only, never
   invented (e.g. `src/models/`, `src/composables/`, `src/services/`).
6. Declare blockers: if `doctrine/MEMORY.md` is missing a needed command,
   stop and report `blocked` — do NOT guess a command.
7. [added 2026-09-02] Measure `hub_bytes_before` — the total bytes across
   the 5 categories `/hub-tokens` calls the "per-session total" (root
   files, `doctrine/`, the active `haven/diagrams/`, 2 worker bundles).
   Record this number in the evidence note at step 8 — the verifier reads
   it back to compute the hub-size diff in `worker-runs.log`.
8. Evidence: write `evidence/implementer/<date>-<slug>.md` (flat file,
   matches the convention actually used across every prior evidence note
   — see `evidence/README.md`), including the line
   `## Hub bytes before: <N>` from step 7.

## Hard rules honored
`NodeBeforeCode` | `EvidencePerAction` | `NoSilentFailure`

## Failure branches
| Failure | Handling |
|---|---|
| No diagram exists yet | Create `haven/diagrams/<slug>.prime-mermaid.md` matching the `dev-loop` format |
| Task is ambiguous | Stop and ask, don't guess |
| Task touches a known trap in `doctrine/domains/PROJECT.md` (e.g. editing `VeeForm.vue`, `auth.js`) | Read the relevant trap carefully before implementing, don't repeat the bug pattern |

## Runtime
`/worker implementer "<task>"`. No API key, no network call — Claude Code
IS the runtime.
