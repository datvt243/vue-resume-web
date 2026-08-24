# 2026-08-25 — run-dev-skill

- Worker: implementer
- Version: 0.1.0
- Node: `run-dev-skill` (new — no prior node; added IN_PROGRESS row to
  `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task (verbatim): "tạo cho tôi command run-dev: 1. chạy command
  open-debugger-brower 2. chạy localhost 'npm run dev' trên brower vừa mở"
  (create a `/run-dev` command: open the Chrome remote-debugging browser,
  then start `npm run dev` and point that browser at it) — file was
  already written and exercised successfully earlier in the session
  (dev-server tab confirmed loaded); this pass only adds it to the repo
  through the proper branch/evidence/build flow per operator's follow-up
  "commit run-dev skill too".

## Branch
`chore/add-run-dev-skill` (checked out from `main` before staging —
tooling addition, `chore/*` prefix).

## Diff
| File | Change |
|---|---|
| `.claude/skills/run-dev/SKILL.md` | New file — `/run-dev` slash command: launches Chrome with remote debugging on port 9888 (reusing an already-running instance), starts `npm run dev` in the background if not already running, then opens a new tab in that browser pointed at the dev server's real printed URL via the DevTools HTTP endpoint (`PUT /json/new?<url>`). No app code touched. |

## Command
```
npm run build
```
(repo root — docs/tooling-only change, unaffected by the build, run anyway per policy; no test command exists)

## Output
```
✓ built in 4.75s
```
(only the pre-existing >500kB chunk-size warning, unrelated)

## Manual check (already done earlier this session, before this commit pass)
Ran `/run-dev`: debug Chrome opened on port 9888, reused the dev server
already listening on `localhost:5173`, opened a new tab there — confirmed
via `GET /json/list` that the tab's title was "Resume API" at
`http://localhost:5173/vue-resume-web/#/`. Not re-run for this commit
pass since nothing in the skill file changed since then.

## Acceptance
| Criterion | Evidence |
|---|---|
| `/run-dev` skill file exists and matches the spec (open debugger, then load localhost dev server into it) | File present at `.claude/skills/run-dev/SKILL.md`, content unchanged from the version already manually exercised this session |
| No app code (`src/`) touched | `git status --short` on this branch shows only the new skill file |
| Build still green | `✓ built in 4.75s` |
| Branch is not `main` | `git branch --show-current` → `chore/add-run-dev-skill` |

## Noticed, not done
Nothing new — same scope as requested.

## Seal gate
No outward-facing action taken yet (no commit/push/merge) — diff staged
on `chore/add-run-dev-skill`, awaiting verifier then `/ship`.
