---
name: run-dev
description: "Open the Chrome remote-debugging browser and point it at the resume-vuejs-website dev server. Usage: /run-dev. Runs `npm run dev` in the background and navigates the already-open debug browser to it — no manual steps."
---

# /run-dev — open debug browser + point it at `npm run dev`

Two steps, in order. Local-only, nothing outward-facing — no Seal Gate.

## Step 1 — open the Chrome remote-debugging browser
Same command as `/open-browser-debugger` (`~/.claude/commands/open-browser-debugger.md`):
```bash
open -na "Google Chrome" --args \
  --remote-debugging-port=9888 \
  --user-data-dir="$HOME/.chrome-debug-profile"
```
Confirm it's up: `curl -s http://localhost:9888/json/version` must return JSON
(retry a couple times — Chrome takes a moment to start). If a debug-profile
Chrome is already running (a prior `/run-dev` or `/open-browser-debugger`),
skip relaunching it — just reuse it.

## Step 2 — start `npm run dev` and load it into that browser
1. Check the dev server isn't already running: `lsof -i :5173` (or
   `curl -s -o /dev/null -w '%{http_code}' http://localhost:5173`). If it's
   already up, skip starting a new one.
2. Otherwise start it from the repo root, backgrounded (`run_in_background`,
   never foreground — it's a long-lived server):
   ```bash
   npm run dev
   ```
   Read its output back until it prints the local URL (Vite's
   `➜  Local:   http://localhost:5173/`) — that's the real port, don't
   assume 5173 if Vite picked a different one because it was busy.
3. Open a new tab at that URL in the port-9888 browser via the DevTools
   HTTP endpoint (no extra browser-automation tool needed):
   ```bash
   curl -s -X PUT "http://localhost:9888/json/new?http://localhost:5173/"
   ```
   Use the URL actually printed by Vite in step 2, not a hardcoded guess.
4. Report the URL and that the tab was opened. Don't claim the page
   "loaded correctly" unless you actually checked (e.g. fetched the tab's
   `/json` entry or took a screenshot) — inferred success isn't evidence.

## Rules
- Never run `npm run dev` in the foreground — it never exits, it will hang
  the session.
- Don't kill/restart an already-running dev server or debug-profile Chrome
  found in step 1/2.1 — reuse what's there.
- This command doesn't touch `agent-hub/` and doesn't need a worker/evidence
  note — it's a local run/inspect action, not a code change.

## Runtime
`/run-dev`
