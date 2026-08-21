# Contract
- Input: `{task: string}`
- Output: `{node, diagram, current_state, acceptance: string[],
  files: string[], blocked_by: string|null}`

## Steps
1. Read `NORTHSTAR.md` + `doctrine/MEMORY.md` + `doctrine/domains/PROJECT.md`.
2. Read EVERY diagram in `haven/diagrams/`, list nodes + PM status.
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
7. Evidence: write `evidence/implementer/<date>-<slug>.md` (flat file,
   matches the convention actually used across every prior evidence note
   — see `evidence/README.md`).

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
