---
name: todo
description: "One-command version of the agent-hub implementer -> verifier loop for vue-resume-web. Usage: /todo \"<task>\". Runs implementer then verifier as two separate passes (verifier never carries the implementer's reasoning), auto-retries the implementer pass on REOPEN up to 3 times, then stops and reports. Does not auto-commit."
---

# /todo "<task>" — implementer → verifier, 2 separate passes, automatic

`args` is the task verbatim. If empty, stop and ask.

This is NOT a single pass that writes and grades itself — it's a
typing-level shortcut only. Internally it still has to run 2 genuinely
separate passes, same as calling `/worker` twice, and the verifier must not
carry over the implementer pass's reasoning (`NeverVerifyOwnWork` must not
be broken).

## Loop
Set `N = 0`, `MAX = 3`.

1. **Implementer pass** (same obligations as `/worker implementer "<task>"`
   — see `.claude/skills/worker/SKILL.md`): pick_next → implement →
   `npm run build` + read back the output → evidence note → stop at
   `sealed_pending_verifier`.
   - If the implementer reports `blocked` (e.g. a command missing from
     `doctrine/MEMORY.md`) → stop IMMEDIATELY, tell the operator, do NOT
     loop.
2. **Verifier pass** (same obligations as `/worker verifier` — a
   reasoning-wise separate turn, not carrying over the reasoning just used
   in step 1): read step 1's evidence note → SEAL or REOPEN.
3. If **SEAL** → stop the loop, report the result to the operator, point to
   both the implementer and verifier evidence notes. Do NOT
   `git add`/`commit`/`push`/merge — the seal gate still applies (use
   `/ship` for that, separately).
4. If **REOPEN** → `N += 1`.
   - If `N < MAX`: go back to step 1, feeding the verifier evidence note's
     REOPEN reason verbatim as new input to the implementer.
   - If `N >= MAX`: stop, tell the operator: this node keeps getting
     REOPENed, needs a manual decision (don't loop forever).

## Rules
- The seal gate applies to EVERY outward-facing action in both passes.
- Every pass must write evidence — no "it's a combined command so no note
  needed" exception.
- If the operator wants to read the evidence themselves between the two
  steps before letting the verifier grade it, use separate
  `/worker implementer` + `/worker verifier` instead of `/todo`.
