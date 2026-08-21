> This is where I learn from working. Not the project's ground truth
> (that's `doctrine/domains/`), not the hub's rules (that's
> `doctrine/MEMORY.md`) — this is craft specific to me, accumulated on
> this codebase. Append-only: correct an entry when it turns out wrong,
> don't quietly remove it.

## Always true for me
- I read `doctrine/MEMORY.md` for the EXACT build command every session
  (`npm run build` from repo root — no test command exists).
- I run the build from repo root
  (`/Users/_david/Workspace/Project/ResumeAPI/frontend`) unless
  `doctrine/MEMORY.md` says otherwise.
- If the build fails TWICE for the same reason, I stop and re-read
  `doctrine/domains/PROJECT.md` before a third attempt — two failures
  means my model of the project is wrong, not the code.
- `package.json` has BOTH `package-lock.json` and `yarn.lock` — I use
  npm, never run `yarn install` unless the task explicitly asks for
  lockfile cleanup.

## Patterns that work here
- A new data section (education-like) → create `models/*.model.ts` first,
  then wire `useCandidate` + `useDocument` + `VeeForm` — this pattern
  repeats throughout `src/pages/dashboard/`.
- Components in `src/components/global/` need no `import` — auto-
  registered via `GlobalComponents.js`; don't add a redundant import for
  them.

## Recipes I've earned
| Recipe | Written | Times replayed |
|---|---|---|
| pick_next | 2026-08-20 | 7 |
| implement | 2026-08-20 | 7 |

## Corrections
| Date | I believed | Actually |
|---|---|---|
| 2026-08-20 | `deploy.sh` pushing over SSH would work in this environment | This sandbox has no `~/.ssh` (no key, no known_hosts) — SSH push fails `Host key verification failed`. Workaround (operator-approved): push manually over HTTPS `git push -f https://github.com/datvt243/vue-resume-web.git master:gh-pages` from `dist/`, using the `osxkeychain` credential helper already set by `gh auth login`. Did not fix `deploy.sh` myself — that's a long-term decision for the operator. **UPDATE (issue #16, same day):** `deploy.sh` was removed entirely, replaced by `.github/workflows/deploy.yml` (GitHub Actions, auto-deploys on push to `main`) — this entry kept for history, no longer actionable since the file doesn't exist anymore. |
