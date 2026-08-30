---
name: deploy
description: "Check the status of the automated GitHub Pages deploy for resume-vuejs-website. Usage: /deploy. Deploy is no longer a manual script — .github/workflows/deploy.yml auto-deploys on every push to main. This command watches/reports the latest deploy workflow run instead of triggering anything."
---

# /deploy — check the automated GitHub Pages deploy

`deploy.sh` was retired (issue #16, 2026-08-20). Deploying to GitHub Pages
is no longer a manual step you invoke — `.github/workflows/deploy.yml`
runs automatically on every push to `main` (build → lint → publish `dist/`
to `gh-pages` via `peaceiris/actions-gh-pages`). The outward-facing action
is now the `main` merge itself (done via `/ship`), not a separate deploy
command.

This command's job is now to check on that automated deploy, not to run
one — nothing here needs Seal Gate approval since it triggers no new
outward-facing action.

## Steps
1. `gh run list --workflow=deploy.yml --limit 5` — show the most recent
   deploy runs and their status/conclusion.
2. If the latest run for the current `HEAD` commit on `main` is still
   `in_progress`/`queued`: `gh run watch <run-id>` to follow it live (or
   just report "still running, check back" if the operator doesn't want to
   wait).
3. If it `completed`/`failure`: `gh run view <run-id> --log-failed` to
   show what failed, and report the real error — don't guess.
4. If it succeeded: report the live URL
   (`https://datvt243.github.io/resume-vuejs-website/`) and which commit is now
   live.

## Rules
- Don't re-trigger a deploy manually (no `gh workflow run` — deploy only
  fires on push to `main`, which `/ship` already does).
- Don't edit `.github/workflows/deploy.yml` as part of this command — if
  the workflow itself needs changing, that's a normal code change through
  the implementer/verifier loop, not something `/deploy` does inline.

## Runtime
`/deploy`
