# Evidence — rename-repo-refs-cleanup (verify)

Date: 2026-08-31
Worker: verifier
Branch checked: `chore/rename-repo-refs` (fresh session, no shared context
with the implementer)

## Verdict: SEAL

## Checks run (all independent, re-derived from repo state)

1. `git branch --show-current` → `chore/rename-repo-refs`. Confirmed.

2. `git diff staging --stat` → 21 files: `.claude/CLAUDE.md`, 7
   `.claude/skills/*/SKILL.md`, `README.md`, `agent-hub/{CLAUDE.md,
   INDEX.md, NORTHSTAR.md, README.md, doctrine/{INDEX.md, MEMORY.md,
   SOUL.md, domains/PROJECT.md}, haven/diagrams/dev-loop.prime-mermaid.md,
   haven/workers/{implementer,verifier}/SOUL.md}`, `package-lock.json`.
   Zero `src/` files, zero non-`.md`/non-`package-lock.json` code files.
   Matches claimed scope.

3. `git diff staging --stat -- yarn.lock` → empty output. `yarn.lock` is
   NOT modified on this branch — confirmed the implementer's claimed
   revert (`git checkout -- yarn.lock`) held.

4. Full sweep: `grep -rl "vue-resume-web" --include="*.md"
   --include="*.ts" --include="*.js" --include="*.json"
   --include="*.html" --include="*.yml" . --exclude-dir=node_modules` →
   every hit falls inside `agent-hub/evidence/**` (append-only historical
   notes), `agent-hub/haven/diagrams/dev-loop-archive.md`,
   `REPORT-TOKENS.md`, `agent-hub/haven/workers/implementer/MEMORY.md`
   (quotes a real historical command), and
   `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md`. For the last
   file, cross-checked with `git diff staging --
   agent-hub/haven/diagrams/dev-loop.prime-mermaid.md`: only one line
   was added (this node's own PENDING→SEALED row) — the `SEALED`
   `github-pages-base-path-rename` row and the `BLOCKED_ON_BACKEND`
   `issue-8-jwt-localstorage` row are both pre-existing/untouched by this
   diff. Neither is a miss introduced by this task; both are historical
   PM rows this task correctly left alone. No hit found outside the
   claimed-intentional set.

5. Spot-checked file diffs directly (`git diff staging -- <file>`):
   - `README.md` — live demo URL, clone command, `cd` target, live URL
     footer, issue links (#1/#2/#3/#5) all swapped cleanly, no mangled
     text.
   - `.claude/CLAUDE.md` — project name header, repo/live URLs, issue
     #8/#13/#17/#7/#12 links all swapped cleanly.
   - `agent-hub/doctrine/MEMORY.md` — hub path, code repo path, remote
     URL all updated; added an inline note about the rename + a second
     independent stale-path bug (pre-dated the rename, path was
     `ResumeAPI/frontend`). No mangling.
   - `.claude/skills/boot/SKILL.md`, `.claude/skills/deploy/SKILL.md` —
     description frontmatter + heading + one hard-coded live URL, all
     clean single replacements.
   No instance of double-replacement (e.g.
   "resume-vuejs-websiteresume-vuejs-website") or broken markdown link
   syntax found anywhere spot-checked.

6. `agent-hub/doctrine/MEMORY.md` path/remote lines checked against live
   repo state:
   - `pwd` → `/Users/_david/Workspace/Project/resume/resume-vuejs-website`
     — matches the file's "Hub path"/"Code repo path" fields exactly.
   - `git remote -v` → `origin
     https://github.com/datvt243/resume-vuejs-website.git (fetch/push)`
     — matches the file's "Repo remote" field exactly.

7. `npm run lint` run fresh → exit code 0, no output (clean). Matches
   implementer's claim.

8. `npm run build` run fresh →
   ```
   ✓ built in 4.54s
   ```
   Same pre-existing "chunks larger than 500 kB" warning only, no new
   errors or warnings. Matches implementer's claim (they measured
   4.62s, this run 4.54s — normal variance, same warning set).

9. `package-lock.json` diff (`git diff staging -- package-lock.json`) →
   only two `name`/`version` field pairs changed
   (`vue-resume-web`/`0.0.0` → `resume-vuejs-website`/`1.2.0`), matching
   `package.json`'s current `"name": "resume-vuejs-website"`,
   `"version": "1.2.0"`. Confirmed via direct `grep` on `package.json`.

## Scope note (non-blocking)
One pre-existing row in `dev-loop.prime-mermaid.md`
(`issue-8-jwt-localstorage`, status `BLOCKED_ON_BACKEND`) still links to
`github.com/datvt243/vue-resume-web/issues/8` and was not touched by this
diff. It falls under the same "don't rewrite old PM-status rows"
principle as the SEALED rows even though its status label differs
(BLOCKED_ON_BACKEND, not SEALED) — the implementer's evidence note
described the exclusion set slightly narrower than what's actually true
in the file. Not a real miss (predates this task, out of scope, GitHub
redirects renamed-repo issue URLs anyway) — flagging only for precision,
not grounds for REOPEN.

## Outward-facing action
None taken by this verifier — no commit, push, or merge. Diagram row
flipped PENDING → SEALED per the verifier's mandate (PM status is owned
by the verifier). Still behind the seal gate for `/ship` (operator
approval required for `chore/rename-repo-refs` → `staging` PR/merge).

## Node
`rename-repo-refs-cleanup` — flipped PENDING → SEALED in
`haven/diagrams/dev-loop.prime-mermaid.md`.
