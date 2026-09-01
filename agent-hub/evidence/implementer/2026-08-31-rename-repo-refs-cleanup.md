# Evidence — rename-repo-refs-cleanup

Date: 2026-08-31
Worker: implementer
Branch: `chore/rename-repo-refs` (cut from `staging`)

## Task
Operator: after the `github-pages-base-path-rename` fix shipped and
deployed, clean up remaining references to the old repo name
`vue-resume-web` (repo is now `resume-vuejs-website`) across the repo.

## Scope decision
Full `grep -rl "vue-resume-web"` returned ~90 hits, the vast majority
inside `agent-hub/evidence/**` (append-only historical evidence notes —
NORTHSTAR.md's Language & token policy and the hub's own "evidence is
committed, bad notes kept too" rule forbid rewriting these) and
`agent-hub/haven/diagrams/dev-loop-archive.md` /
`dev-loop.prime-mermaid.md`'s already-SEALED old PM-status rows (LAI-13:
never edit an old node's status/text). Also skipped
`agent-hub/haven/workers/implementer/MEMORY.md:39`, which quotes a real
historical command (`git push -f https://github.com/datvt243/vue-resume-web.git
master:gh-pages`) that was actually run under the old name — rewriting it
would misrepresent history. Also skipped `REPORT-TOKENS.md` (a delivered
historical report snapshot, not a living reference).

Fixed (active, forward-looking, non-append-only files):
- `README.md`, `.claude/CLAUDE.md` — live URLs, clone command, issue
  links, repo description
- `agent-hub/README.md`, `NORTHSTAR.md` (incl. `dna:` id
  `vue_resume_web_hub` -> `resume_vuejs_website_hub`, confirmed via grep
  it's not referenced anywhere else), `INDEX.md`, `CLAUDE.md`,
  `doctrine/INDEX.md`, `doctrine/SOUL.md`, `doctrine/domains/PROJECT.md`
  (issue links), `haven/workers/{implementer,verifier}/SOUL.md`
- `.claude/skills/{boot,deploy,release,run-dev,ship,todo,worker}/SKILL.md`
  — descriptions + one hard-coded live URL in `deploy/SKILL.md`
- `agent-hub/doctrine/MEMORY.md` — this one wasn't just a name swap: the
  "Hub path" / "Code repo path" fields were pointing at a stale path
  (`/Users/_david/Workspace/Project/ResumeAPI/frontend`) that predates
  even this rename (repo moved to
  `/Users/_david/Workspace/Project/resume/resume-vuejs-website` at some
  point, path was never updated in this file — a second, independent
  drift bug, not caused by the rename). Fixed to the real current path
  (verified via `pwd`/`git remote -v`), remote URL updated, left a note
  explaining both changes for future sessions.
- `package-lock.json` — ran `npm install` to regenerate `name`
  (`vue-resume-web` -> `resume-vuejs-website`) and `version`
  (`0.0.0` -> `1.2.0`, another independent stale-field bug — lockfile's
  root version had never been synced to `package.json`) fields cleanly
  instead of hand-editing.

## Side effect caught and reverted
`npm install` also rewrote `yarn.lock` (~950 lines) even though no yarn
command was run — this matches the exact shape of pre-existing drift
already found dirty on `staging` at the start of today's session (see the
`github-pages-base-path-rename` evidence note) and stashed aside then.
Something in this environment appears to touch `yarn.lock` reactively
(not from any command this session issued) on branch/install operations.
Discarded via `git checkout -- yarn.lock` before committing — not this
node's business, flagging for the operator separately, not fixing here.

## Build verification (real, read back)
```
$ npm run lint
> resume-vuejs-website@1.2.0 lint
> eslint src --ext .js,.ts,.vue
(exit 0, no output = clean)

$ npm run build
...
✓ built in 4.62s
```
Same pre-existing chunk-size warning only. No new errors. Diff is
entirely `.md`/`package-lock.json` (metadata) — no `src/` touched.

## Outward-facing action
None yet — diff on `chore/rename-repo-refs`, uncommitted at time of
writing. Commit + PR into `staging` deferred to `/ship`.

## Node
`rename-repo-refs-cleanup` — new node, added to
`haven/diagrams/dev-loop.prime-mermaid.md` PM status as PENDING.
