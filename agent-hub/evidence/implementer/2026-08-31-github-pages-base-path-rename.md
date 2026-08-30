# Evidence — github-pages-base-path-rename

Date: 2026-08-31
Worker: implementer
Branch: `fix/issue-pages-base-path` (cut from `staging`)

## Task
Operator: repo was renamed `vue-resume-web` → `resume-vuejs-website` on
GitHub. GitHub Pages "không hiện nữa" (page stopped showing) after the
rename. Diagnose + fix.

## Root cause (verified, not inferred)
`vite.config.ts:10` had `base: '/vue-resume-web/'` hard-coded, overriding
the unused `const base = process.env.BASE_URL || '/'` on line 6. GitHub
Pages itself deployed fine after the rename — confirmed via
`gh api repos/datvt243/resume-vuejs-website/pages`:
`{"status":"built","html_url":"https://datvt243.github.io/resume-vuejs-website/",...}`
and `gh run list --workflow=deploy.yml` showing recent green runs. But the
built `dist/index.html` still referenced assets under `/vue-resume-web/...`
— a path that no longer matches the live Pages URL
(`/resume-vuejs-website/...`) — so every JS/CSS request 404s and the page
renders blank. Not a Pages-config issue; a stale hard-coded base path in
the app's own build config.

## Diff (smallest that qualifies)
- `vite.config.ts`: line 6 default changed to
  `process.env.BASE_URL || '/resume-vuejs-website/'`; line 10 changed
  from the hard-coded string to `base` (now actually uses the const that
  was previously dead code).
- `package.json`: `"name"` field `vue-resume-web` → `resume-vuejs-website`
  (cosmetic, matches repo identity, not the root cause but same-scope
  drift found while diagnosing).

Not touched (out of scope, flagged only): `README.md`, `.claude/CLAUDE.md`,
`.claude/skills/*/SKILL.md`, `REPORT-TOKENS.md`, `package-lock.json` still
reference the old name in places — none of these affect the deploy/runtime
behavior, pure doc/lockfile-metadata drift. Left for a separate chore task.

## Pre-existing staging state (handled before branching)
`staging` had uncommitted `package-lock.json`/`yarn.lock` changes at
session start (not created by this session — confirmed via git status
at conversation start, matches the pre-task gitStatus snapshot). Operator
chose "stash to a new branch" — stashed on `staging`, branched
`fix/issue-pages-base-path` from clean `staging`, popped the stash back
onto the fix branch. Those lockfile changes are NOT part of this node's
diff and are carried on the branch unexamined — separate concern.

## Build verification (real, read back)
```
$ npm run build
...
✓ built in 4.65s
```
Same pre-existing "chunks larger than 500 kB" warning only (VeeForm.js —
known, unrelated to this change). No new errors.

Confirmed the fix directly:
```
$ grep -o '/resume-vuejs-website/[^"]*' dist/index.html
/resume-vuejs-website/favicon.png
/resume-vuejs-website/assets/index-DTuaUGlH.js
/resume-vuejs-website/assets/index-r57Lbdk2.css
```
No `/vue-resume-web/` references remain in `dist/index.html`.

Pre-existing unrelated TS diagnostic noted (not introduced by this diff):
`vite.config.ts:3:8` `path` default-import warning — present before this
change too (line 3 untouched by the diff), separate tech debt.

## Test
No `.spec.ts` exists for `vite.config.ts` (build config, not app code).
Per `doctrine/MEMORY.md` fallback: `npm run build` (above) is the
verification; this is NOT a real unit test, stated explicitly per
NORTHSTAR.md's condition (3).

## Outward-facing action
None yet — diff is on `fix/issue-pages-base-path`, uncommitted at time of
writing this note. Commit + PR into `staging` deferred to `/ship`, which
is the Seal Gate step (operator approval required before merge/push).

## Node
`github-pages-base-path-rename` — new node, added to
`haven/diagrams/dev-loop.prime-mermaid.md` PM status as PENDING (verifier
owns promoting it).
