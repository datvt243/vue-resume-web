> the gate.

# Contract
- Input: path to an evidence note under `evidence/implementer/`.
- Output: `{verdict: SEAL|REOPEN, node, cited: string[], missing: string[],
  forbidden_hit: string|null, pm_updated: boolean}`
- REFUSAL: if this same session wrote the diff under review → refuse
  immediately: "I wrote this, a separate verifier pass is required."
  (`NeverVerifyOwnWork`)

## Re-run scope [cost-driven, added 2026-09-02]
Default: AUDIT the note, don't re-run `npm run build`/dev-server checks from
scratch. `EvidenceOnly` means "don't substitute reasoning for real
evidence" — it does NOT mean "always regenerate the evidence yourself." If
the note's output is verbatim, not truncated (step 5), the command matches
`doctrine/MEMORY.md` (step 4), and it covers every acceptance criterion
(step 6) → verdict straight off the note, no re-run.

Only re-run (partial or full) when:
- The note is missing a citation, output looks truncated/hidden, or the
  command doesn't match doctrine → REOPEN per steps 4-5 instead — don't
  spend effort re-running a note that's already broken.
- The node is outward-facing or a `/release` gate — higher risk than an
  ordinary diff, worth the independent-confirmation cost.
- `doctrine/domains/PROJECT.md` names this class of change as needing
  independent re-run (a per-project call, not the kit default).

Observed in practice (usage audit 2026-09-02, across 3 production hubs):
verifiers re-running the FULL build from scratch for every node — even a
1-line doc fix — doubled (up to 6x with parallel subagents) the token cost
of every change with no change to the SEAL/REOPEN verdict. Not a bug, but
not what `EvidenceOnly` asks for either — this section pins the boundary so
it's not reinvented per hub.

## Steps
1. REFUSE SELF-GRADING FIRST — did I write this diff in this session?
2. Read the NOTE — only the note, do NOT open the diff directly.
   (`EvidenceOnly`)
3. Read the NODE — get acceptance criteria from `haven/diagrams/`,
   forbidden states from `CLAUDE.md`. [GUARD, added 2026-08-31] Don't `Read
   agent-hub/CLAUDE.md` yourself for this — same mechanism as
   `boot/SKILL.md`: the harness auto-injects this file's full content as a
   nested-CLAUDE.md `<system-reminder>` the moment step 2 touches anything
   under `agent-hub/`; reading it again here duplicates that content. Read
   it directly only if it's actually missing from context after step 2.
4. Check the command in the note matches `doctrine/MEMORY.md` (e.g. `npm
   run build` from repo root — this project has NO test command, don't
   REOPEN just because "tests pass" is missing when the note already
   states this is build-only).
5. Check the output isn't truncated/hidden (`...`, "truncated") → REOPEN
   if it is.
6. Go through acceptance criteria ONE BY ONE — missing evidence for any
   one = REOPEN, list it under "missing".
7. Scan all 6 forbidden states.
7b. Check the BRANCH — does the note clearly name a dedicated branch
    (other than `main`) used for the diff? Missing, or the diff was made
    on `main` → REOPEN, `forbidden_hit: MAIN_EDIT`. (`NoMainEdit`)
8. Check the SEAL GATE — is there a recorded approval in the note if the
   diff is outward-facing (commit/push/merge branch → main/deploy)?
9. Check proportionality — did the diff do more than the node required,
   or opportunistically fix another untasked trap in
   `doctrine/domains/PROJECT.md`? → REOPEN (`SmallestDiff`).
10. Decide exactly one of two: SEAL (every criterion has citable
    evidence) or REOPEN (even one important gap is enough).
11. Only on SEAL: update the ratchet/PM status in `haven/diagrams/`.
12. Write the verdict to
    `evidence/verifier/<date>-<slug>-{seal|reopen}.md` (flat file,
    matches the convention used across every prior evidence note).
12b. [added 2026-09-02] In the verdict note, truthfully declare 1 line
   `## Re-run`: `none` (audit-only, the correct default per "Re-run
   scope" above), `partial` (name exactly which command was re-run), or
   `full` (re-ran the entire build from scratch) — always with a reason
   matching one of the 3 exception cases in "Re-run scope" if not `none`.
   Misdeclaring this corrupts the duplicate-cost signal step 13 depends
   on.
13. [added 2026-09-02] Append 1 line to `evidence/worker-runs.log`
   (create the file if it doesn't exist): take `hub_bytes_before` from the
   `## Hub bytes before` line in the implementer's note (already read in
   step 2, reuse it); measure `hub_bytes_after` the same way (this hub's
   `/hub-tokens` per-session total), taken AFTER updating PM status in
   step 11 if SEALed. Format:
   ```
   <ISO timestamp> role=verifier outcome=SEAL|REOPEN node=<slug>
   rerun=none|partial|full hub_bytes_before=<N> hub_bytes_after=<N>
   ```
   NEVER edit/delete an old line here — append-only, same rule as the
   rest of `evidence/`.

## Hard rules honored
`NeverVerifyOwnWork` | `EvidenceOnly` | `VerdictOnly` | `RatchetOnly` | `NoMainEdit`

## Failure branches
| Failure | Handling |
|---|---|
| No evidence note | REOPEN, `NO_EVIDENCE` |
| Node doesn't exist on any diagram | REOPEN, `forbidden_hit: node_unknown` |
| Node is already SEALED | Don't overwrite — must be a new node |

## Runtime
`/worker verifier "<task or note>"`. Prefer spawning a fresh subagent for
this pass — it naturally satisfies `NeverVerifyOwnWork` without needing
the operator to explicitly request a separate session.
