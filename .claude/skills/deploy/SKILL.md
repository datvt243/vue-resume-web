---
name: deploy
description: "Run deploy.sh to publish the current build to GitHub Pages (gh-pages branch) for vue-resume-web. Usage: /deploy. Warns if not on a clean main first. Falls back to pushing dist/ over HTTPS (via the gh credential helper) if deploy.sh's SSH push fails with a host-key error — a known sandbox limitation. Invoking /deploy IS the seal-gate approval, no extra confirmation asked beyond the branch/clean-tree check."
---

# /deploy — build + publish to GitHub Pages via deploy.sh

Calling `/deploy` IS the approval for this outward-facing action (Seal
Gate, see `agent-hub/CLAUDE.md`) — don't ask for confirmation again, except
for the one branch check in step 1 (publishing the wrong content to
production is hard to reverse, so that check is allowed to pause).

## Steps
1. `git branch --show-current` + `git status --short`.
   - Not on `main`, or `main` has uncommitted changes → warn the operator:
     deploy publishes whatever is in the current working tree, not
     necessarily what's merged into `main`. Ask whether to proceed anyway,
     switch to `main` first, or stop.
   - Clean `main` → proceed straight to step 2, no need to ask again.
2. Run `./deploy.sh` from repo root. Internally it does: `npm run build`
   (READ BACK the output verbatim — `deploy.sh` has `set -e` so a red build
   already aborts the script) → `cd dist` → `git init && git add -A &&
   git commit -m 'deploy'` → `git push -f
   git@github.com:datvt243/vue-resume-web.git master:gh-pages`.
3. If the push step fails with `Host key verification failed` / `Could not
   read from remote repository` (no SSH key available — a known limitation
   in some sandboxes, see `agent-hub/haven/workers/implementer/MEMORY.md`
   → Corrections):
   a. From inside `dist/` (the commit from step 2 already exists there),
      push over HTTPS instead, reusing the `gh`-configured credential
      helper: `git push -f https://github.com/datvt243/vue-resume-web.git master:gh-pages`.
   b. `cd -` back to repo root.
   c. Note in the final report that the HTTPS fallback was used.
4. If it fails for any OTHER reason (red build, an auth error unrelated to
   SSH, network failure) → stop, report the real error verbatim. Do NOT
   guess a workaround.
5. Report the result: which commit `gh-pages` now points to (from the
   `git push` output), the live URL
   (`https://datvt243.github.io/vue-resume-web/`), and whether the HTTPS
   fallback was needed.

## Rules
- NEVER force-push anywhere except `gh-pages` — that force-push is
  `deploy.sh`'s own design (GitHub Pages history doesn't need preserving,
  unlike `main`).
- Don't edit `deploy.sh` itself to "fix" the SSH issue permanently — the
  HTTPS fallback here is a per-run workaround for sandboxes without SSH
  keys, not a decision to change the project's deploy mechanism (that's a
  separate operator call).
- A leftover `.git` inside `dist/` from a prior run is fine — `git init` is
  idempotent, `deploy.sh`'s commit step still works on top of it.
- Don't touch `main` or any other branch during this command beyond the
  read-only check in step 1.

## Runtime
`/deploy`
