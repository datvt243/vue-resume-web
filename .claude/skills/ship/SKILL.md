---
name: ship
description: "Commit any pending changes on the current task branch, merge it into main, and push — for vue-resume-web. Usage: /ship [\"<commit message>\"]. Refuses to run directly on main (MAIN_EDIT protection). Requires npm run build green first. Deletes fix/* branches after merge, keeps feature/* branches. Invoking /ship IS the seal-gate approval, no extra confirmation asked."
---

# /ship ["<commit message>"] — commit, merge branch → main, push

`args` (optional) is the commit message. If empty, infer one from the
current diff following Conventional Commits (`fix:`/`feat:`/`docs:`/
`chore:`...), matching the repo's actual commit history style
(`git log --oneline`).

Calling `/ship` IS the approval for this outward-facing action (Seal Gate,
see `agent-hub/CLAUDE.md`) — don't ask for confirmation again, unless you
hit a blocker (red build, currently on `main`, conflict...).

## Steps
1. `git branch --show-current`.
   - On `main` + clean working tree → report "main is clean, nothing to
     ship", stop.
   - On `main` + uncommitted changes → **REFUSE** to ship directly on
     `main` (`MAIN_EDIT`). Tell the operator, suggest
     `git checkout -b <branch>` first, then call `/ship` again.
2. On a branch other than `main`:
   a. `npm run build` (the exact command from
      `agent-hub/doctrine/MEMORY.md`) — READ BACK the output verbatim. Red
      → stop immediately, do NOT commit/merge, report the real error to
      the operator.
   b. If `git status --short` is non-empty: `git add` exactly the files
      relevant to the current change (don't add unrelated
      junk/artifacts), commit with the given message or an inferred one,
      ending with `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`.
   c. `git checkout main && git merge --no-ff <branch> -m "Merge branch '<branch>' into main\n\nCo-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"`.
   d. `git push`.
   e. Delete the local branch depending on its kind:
      - Name starts with `fix/...` (bugfix) → `git branch -d <branch>`
        (delete — a fix branch's lifecycle ends once merged).
      - Name starts with `feature/...` (new feature) → **KEEP IT**, do not
        delete. A feature branch may still need further work/rebase/
        reference after merging.
      - Any other name that doesn't match the two patterns above (e.g.
        `chore/...`, `docs/...`, `work/<node>`) → treat as fix-like,
        delete after merge (safe default, fewer stray branches).
3. Report the result briefly: commit hash, branch merged, whether it was
   deleted or kept, whether push succeeded — don't repeat the diff content
   (it's already in git log).

## Rules
- NEVER merge/push if `npm run build` is red.
- NO force-push, NO `--no-verify`, NO skipping hooks.
- If the repo is mid merge-conflict or mid-rebase → stop, tell the
  operator, don't `--abort`/`-X ours` on your own.
- Files under `agent-hub/` in the diff still get added/committed normally,
  but when reporting in step 3, follow the terse rule: name the file only,
  don't show its content.
- `/ship` does not run the verifier itself. If the branch name matches
  `fix/issue-<n>-...`/`work/<node>`, do a quick check of
  `agent-hub/haven/diagrams/*.md` — if the related node isn't `SEALED` yet,
  shipping is still allowed (this is a plain git command) but warn the
  operator with one short line.

## Runtime
`/ship` or `/ship "<commit message>"`.
