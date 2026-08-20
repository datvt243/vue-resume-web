---
name: boot
description: Orientation for the vue-resume-web agent-hub. Read NORTHSTAR, doctrine, diagrams, and the most recent evidence notes; report a 6-line status. Use at the very start of every working session on this project, even for small edits. Makes NO changes.
---

# /boot — 60-second orientation for vue-resume-web

You are in a READ role here, not a worker role. Do not modify any file
during this step — read and report only.

## Steps (exact order, don't skip any)
1. Read `agent-hub/NORTHSTAR.md`.
2. Read `agent-hub/CLAUDE.md` — recall the 6 forbidden states and the seal
   gate for yourself.
3. Read `agent-hub/doctrine/MEMORY.md` — get the repo path and exact
   commands (`npm run build`, `npm run dev`... — NO test command exists).
4. Read `agent-hub/doctrine/domains/PROJECT.md` — especially the Traps
   table, don't repeat a known bug (e.g. `createMemoryHistory`, GET login
   leaking the password).
5. Read every file in `agent-hub/haven/diagrams/` — list nodes + current PM
   status.
6. Read `agent-hub/haven/workers/` — confirm there are exactly 2 workers:
   implementer, verifier.
7. Read at most the 5 most recent evidence notes (newest file by date) in
   `agent-hub/evidence/implementer/` and `agent-hub/evidence/verifier/`. If
   a directory is empty, note "no evidence notes yet".

## Report format — EXACTLY 6 lines, no more, no less
```
🎯 Northstar: <one sentence from NORTHSTAR.md>
✅ Forbidden: <none active | name of the active state, if any>
📊 Diagrams: <N nodes = X sealed, Y pending, Z in_progress>
🔧 Workers: implementer, verifier
📝 Last action: <node — SEAL|REOPEN, date, short quote from the latest evidence note, or "none yet">
🚧 Blockers: <list of open <<FILL>> in doctrine/MEMORY.md or doctrine/domains/PROJECT.md, or "none">
```

## Rules
- Do NOT re-scan the whole `src/` tree — the doctrine already holds the
  ground truth you need.
- Do NOT fill in `<<FILL>>` values yourself during `/boot` — just report
  them as a blocker.
- If a load-bearing file (`NORTHSTAR.md`, `doctrine/MEMORY.md`,
  `doctrine/domains/PROJECT.md`, `haven/diagrams/dev-loop.prime-mermaid.md`)
  can't be read, stop immediately and report the error instead of guessing
  its content.
- After the report, be ready to take `/worker implementer "<task>"`,
  `/worker verifier "<task>"`, `/todo "<task>"`, or `/ship`.
