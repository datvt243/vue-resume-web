# Evidence — readme-env-example-cleanup

Date: 2026-08-31
Worker: implementer
Branch: `chore/readme-env-example` (cut from `staging`)

## Task
Operator: "update lại gitignore và readme.md" (follow-up to the repo
rename cleanup).

## Investigation before editing
- `.gitignore`: no old-repo-name references, and `git status --ignored
  --short --untracked-files=all` showed nothing untracked/leaking —
  confirmed clean, **no change made**.
- Checked `.env*` handling since README told devs to create
  `.env.development` manually:
  - `git ls-files | grep env` → `.env.development` and `.env.production`
    ARE tracked in git (pushed to the public repo).
  - Read their content directly: no secrets, only
    `VITE_API_URL`/`BASE_URL` (public API URL + build base path).
  - `.env` (untracked, correctly gitignored) DOES contain real secrets
    (test account email/password) — confirmed this file is NOT tracked,
    no leak.
  - Checked `src/config/api.config.js`: `export const API =
    import.meta.env.VITE_API_URL` — **no fallback**. Confirmed
    `.github/workflows/deploy.yml`/`ci.yml` have no `env:`/secrets step
    supplying `VITE_API_URL` — the committed `.env.production` file is
    the ONLY source for it at build time.
  - **Conclusion, confirmed with operator before acting**: untracking
    `.env.production` would break the next production deploy (`API`
    would resolve to `undefined`). Did NOT untrack/gitignore it. Instead
    added `.env.example` (new tracked file, documents the vars, doesn't
    change what's tracked) and pointed README at it for local overrides.

## Diff
- `.env.example` (new): documents `VITE_API_URL`/`BASE_URL`, explains
  the existing `.env`/`.env.development`/`.env.production` split.
- `README.md`:
  - Title `# Vue Resume Web` → `# Resume Vuejs Website` (matches repo
    rename, missed in the earlier `rename-repo-refs-cleanup` pass since
    that only grepped for the literal string `vue-resume-web`, not the
    spaced-out title).
  - "Cấu hình môi trường" section: old instructions told devs to
    hand-create `.env.development` (redundant — file already exists and
    is tracked); replaced with the real state + pointer to
    `.env.example` for local overrides.
  - "Known Issues" table: was listing #1/#2/#3/#5 as open — verified via
    `gh issue list --state all` that all of #1-#6, #9-#20, #34 are
    CLOSED. Replaced with the two issues actually still OPEN relevant to
    this table's original intent: #7 (partial test coverage), #8
    (blocked on backend).
  - "Roadmap": checked off items already shipped (#1-6, #16, #20, #13
    core), replaced the 4 generic placeholder items ("Preview CV",
    "Export PDF", "Public CV link", "Upload avatar" — no issue numbers)
    with the real open enhancement backlog + numbers, verified via
    `gh issue list`: #55, #56, #57, #58, #59, #60, #61, #63 (all
    confirmed OPEN).

## Build verification (real, read back)
```
$ npm run lint
(exit 0, no output)

$ npm run build
...
✓ built in 4.81s
```
Same pre-existing chunk-size warning only. Diff is `README.md` +
`.env.example` only — no `src/`, no `.gitignore`, no env-file tracking
changes.

## REOPEN round 1 (fixed)
Verifier caught `.env.example` was created but never `git add`ed — diff
only contained `README.md`, so the shipped branch would have linked to a
file absent from the commit. Fixed: `git add .env.example`. Re-ran
`git diff staging --stat` to confirm all 3 real files (`.env.example`,
`README.md`, diagram) are now staged. See
`evidence/verifier/2026-08-31-readme-env-example-cleanup-reopen.md` for
the verifier's full round-1 findings.

## Outward-facing action
None yet — uncommitted on `chore/readme-env-example` at time of writing.
Deferred to `/ship`.

## Node
`readme-env-example-cleanup` — new node, PENDING (verifier owns
promoting it).
