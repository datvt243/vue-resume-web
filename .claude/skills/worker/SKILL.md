---
name: worker
description: "Become an agent-hub worker (implementer or verifier) and run its recipe loop for one task on vue-resume-web. Usage: /worker <implementer|verifier> \"<task>\". Implementer writes the smallest diff and stops at sealed_pending_verifier; verifier reads the evidence note independently and returns SEAL or REOPEN. Never call verifier on a diff the same session just wrote."
---

# /worker <wid> "<task>" — become a worker, run its recipe, exit

`args` holds `<wid> "<task>"` — `wid` is `implementer` or `verifier`, the
rest (quoted or not) is the task. If `wid` or `task` is missing, stop and
ask — don't guess.

## Load bundle (mandatory before anything else)
Read in this exact order:
1. `agent-hub/haven/workers/<wid>/manifest.yaml` — actions, seal_actions,
   hard_rules, reads/writes.
2. `agent-hub/haven/workers/<wid>/SOUL.md` — identity + invariants of this
   role.
3. `agent-hub/haven/workers/<wid>/MEMORY.md` if it exists (implementer has
   one, verifier currently doesn't — use `agent-hub/doctrine/MEMORY.md`
   instead).
4. Every file in `agent-hub/haven/workers/<wid>/recipes/`.

## Become the worker
From here on you ARE `<wid>` — speak from the identity in `SOUL.md`, obey
`hard_rules` in `manifest.yaml` absolutely. Do not mix roles.

### If wid = implementer
1. Run recipe `pick_next.md` with `{task}` → identify the node on
   `agent-hub/haven/diagrams/`.
2. Run recipe `implement.md` → smallest diff, SEAL GATE if it touches
   anything outward-facing (commit/push/merge to main/`./deploy.sh`/a real
   API call) — stop, show it, wait for approval.
3. Run `npm run build` (from `agent-hub/doctrine/MEMORY.md`, repo root) —
   READ BACK the output verbatim. There is no test command in this
   project.
4. Write an evidence note at
   `agent-hub/evidence/implementer/<date>-<slug>.md` following the format
   in `agent-hub/evidence/README.md` — must include the branch name used
   (see `BranchBeforeCode` in `CLAUDE.md`).
5. Stop at `status: sealed_pending_verifier` — do NOT set "done"/"SEAL"
   yourself.

### If wid = verifier
1. REFUSE IMMEDIATELY if this same conversation session just wrote the
   diff under review (`NeverVerifyOwnWork`) — tell the operator a separate
   `/worker verifier` pass is required.
2. Run recipe `verify_seal.md` — read the evidence note (do NOT open the
   diff yourself), check it against the acceptance criteria + the 6
   forbidden states in `agent-hub/CLAUDE.md` (including `MAIN_EDIT` — the
   note must name a non-main branch).
3. Return exactly one verdict: `SEAL` (update PM status on the diagram) or
   `REOPEN` (specific, citable reason).
4. Write the verdict to
   `agent-hub/evidence/verifier/<date>-<slug>-{seal|reopen}.md`.

## Exit
Report the final verdict/status to the operator in 1-2 short sentences,
pointing to the evidence note you just wrote. Don't automatically switch to
another worker — that's `/todo`'s job, or the next `/worker` command the
operator types. Merging a sealed branch into `main` and pushing is a
separate seal-gate step — use `/ship`.
