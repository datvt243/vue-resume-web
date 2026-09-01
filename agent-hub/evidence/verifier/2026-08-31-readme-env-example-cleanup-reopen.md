# 2026-08-31 — readme-env-example-cleanup — REOPEN

- Worker: verifier
- Node: `readme-env-example-cleanup`
- Evidence note reviewed: `agent-hub/evidence/implementer/2026-08-31-readme-env-example-cleanup.md`
- Verdict: **REOPEN**

## Independent checks performed (not inferred from the note)
1. `git branch --show-current` → `chore/readme-env-example`. Not `main`/`staging`. OK.
2. `git diff staging --stat` → only `README.md` (44 lines) and
   `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` (1 line)
   changed. `git status --short --untracked-files=all` shows:
   ```
    M README.md
    M agent-hub/haven/diagrams/dev-loop.prime-mermaid.md
   ?? .env.example
   ?? agent-hub/evidence/implementer/2026-08-31-readme-env-example-cleanup.md
   ```
   **`.env.example` is untracked (`??`), not part of the git diff at all.**
   `git ls-files | grep -i example` returns nothing. `git diff staging
   --name-status` confirms only 2 files (`README.md`,
   `dev-loop.prime-mermaid.md`) — no `.env.example`.
3. No `.gitignore` change (`git diff staging --stat -- .gitignore` empty).
   `git ls-files | grep -i '\.env'` → `.env.development`,
   `.env.production` still tracked, unchanged
   (`git diff staging --stat -- .env.development .env.production`
   empty). No env-file-tracking changes. OK.
4. Read `src/config/api.config.js` directly:
   `export const API = import.meta.env.VITE_API_URL` — confirmed no
   fallback. Read `.github/workflows/deploy.yml` and `ci.yml` directly —
   neither has an `env:` block or `VITE_API_URL` anywhere; only
   `npm ci`, `npm run lint`, `npm run build`,
   `peaceiris/actions-gh-pages@v4`. Confirms the implementer's stated
   reason for NOT untracking `.env.production` (Vite bakes env vars in
   at build time, and CI supplies nothing else) is actually correct, not
   just asserted.
5. Read `README.md`'s new "Known Issues" and "Roadmap" sections directly
   (`git diff staging -- README.md`). Cross-checked every cited issue
   number via `gh issue list --state all --limit 100 --json
   number,state`:
   - Claimed CLOSED: #1–6, #9–20, #34 → all confirmed `CLOSED`.
   - Claimed OPEN (Known Issues): #7, #8 → both confirmed `OPEN`.
   - Claimed OPEN (Roadmap): #55, #56, #57, #58, #59, #60, #61, #63 →
     all confirmed `OPEN`.
   No mismatched issue number found.
6. Read `.env.example` content directly — documents `VITE_API_URL` /
   `BASE_URL`, no real secret, references match `api.config.js` and
   `vite.config.ts` usage. Content itself is fine; the problem is purely
   that it was never `git add`ed.
7. `npm run lint` (fresh, this session) → exit 0, no output. `npm run
   build` (fresh, this session) → `✓ built in 4.54s`, same pre-existing
   chunk-size warning only, no errors.
8. `.env` (real test credentials): `ls -la .env` + `git check-ignore -v
   .env` → still present locally, still gitignored, `git diff staging
   --stat -- .env` empty. Not touched or exposed anywhere in this diff.

## forbidden_hit
`NO_EVIDENCE`/`EDIT_UNVERIFIED`-adjacent: the implementer's evidence
note and the diagram row both assert "`.env.example` (new, documents
vars)" and "Diff: `README.md` + `.env.example` only" as fact, but the
file was never staged/committed — `git status` proves it is still
untracked. If `/ship` ran right now, the branch would carry a
`README.md` that links to and instructs `cp .env.example .env` for a
file that does not exist in the commit. This is not cosmetic: a fresh
clone following the new README instructions would fail at that step.

## missing
- `git add .env.example` (or equivalent) was never run — the file sits
  on disk but outside git's tracked/staged state.

## cited
- `git branch --show-current`, `git diff staging --stat`, `git status
  --short --untracked-files=all`, `git ls-files | grep -i example`,
  `git diff staging --name-status`, `git diff staging --stat -- .env
  .env.development .env.production .gitignore`
- Direct reads: `src/config/api.config.js`,
  `.github/workflows/deploy.yml`, `.github/workflows/ci.yml`,
  `README.md` diff, `.env.example` content
- `gh issue list --state all --limit 100 --json number,state`
- Re-run output: `npm run lint`, `npm run build`
- `ls -la .env`, `git check-ignore -v .env`

## pm_updated
false — REOPEN, ratchet not advanced. Diagram row for
`readme-env-example-cleanup` left as-is (PENDING) — not touched, per
the pattern used for the prior `issue-7-vitest-setup` REOPEN (the row
only gets rewritten once the node actually SEALs).

## What would flip this to SEAL
Run `git add .env.example` on branch `chore/readme-env-example` (and
re-verify `git status` shows it staged/tracked, not `??`), then
re-verify. Everything else in this pass — README content, issue-number
accuracy, the decision not to untrack `.env.production`, lint/build,
`.env` non-exposure — is correct and independently re-verified here.
This is a single, narrow, mechanical gap.
