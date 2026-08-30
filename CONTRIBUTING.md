# Contributing

## Branch model (2 tiers, both GitHub branch-protected)

```
fix/feature/hotfix branches  →  staging  →  main
        (PR, any merge type)      (PR, --merge only)
```

- **`staging`** — integration branch. Every `fix/*`/`feature/*`/`hotfix/*`
  branch is cut from `staging`, and its PR targets `staging`.
- **`main`** — production. Only ever receives code from `staging`, via
  the `/release` step (see below). Nobody branches off `main` directly
  and no PR targets `main` except the `staging → main` release PR.

Both `main` and `staging` are GitHub branch-protected (set up
2026-08-30): `enforce_admins: true`, PR required, no force-push, no
branch deletion. **A direct `git push` to either branch is rejected**
(`GH006`) — verified for real, not just configured on paper. Every
change lands through a merged pull request.

### Why `required_approving_review_count: 0`

This is a solo-operator project — there is no second human reviewer to
approve PRs, and GitHub does not allow an author to approve their own PR.
Setting the required review count to `1`+ would have made every PR
permanently unmergeable (locked out even the repo owner). `0` still
forces every change through the PR mechanism (audit trail, CI gate,
protection against an accidental direct push) without requiring a
reviewer that doesn't exist. If a second contributor ever joins, raise
this number then — it's a config value, not an architectural commitment.

### Why the `staging → main` release merges with `--merge`, never squash

`main` is meant to read as a real history of what shipped in each
release, not one giant commit per release. A `--merge` (not `--squash`,
not `--rebase`) commit preserves every commit that was already reviewed
and merged into `staging`, visible on `main`, tied to the release tag
that bundled them. Squashing at release time would throw that traceability
away for no benefit — the individual commits already went through their
own PR into `staging`.

## Day-to-day workflow

```bash
git checkout staging
git pull
git checkout -b feature/my-thing   # or fix/..., hotfix/...
# ... work ...
/ship "feat: my thing"             # commits, PRs into staging, merges
```

`/ship` (`.claude/skills/ship/SKILL.md`) never touches `main` — it only
ever opens/merges a PR into `staging`.

## Releasing `staging` → `main`

```bash
/release           # minor bump (default)
/release patch
/release major
```

`/release` (`.claude/skills/release/SKILL.md`) does, in order: a real
`npm run lint` + `npm run build` gate on `staging` (won't proceed if
red), a semver version bump (via its own tiny PR into `staging` first,
so `staging` carries the bump before it ever reaches `main`), a real
`staging → main` PR merged with `--merge`, an annotated git tag
(`vX.Y.Z`), and closes whatever GitHub issues the shipped commits
actually reference (`Closes #n`/`Fixes #n`/`Resolves #n` — checked
against each issue's real current state first, never blindly re-closed).

Deploy is not a separate step here — `.github/workflows/deploy.yml`
already auto-triggers on every push to `main` (build, lint, publish
`dist/` to `gh-pages`). `/release` confirms that run started; it doesn't
call a separate deploy hook, because none exists for this project
(confirmed 2026-08-30 — if that changes, `/release`'s own SKILL.md is the
place to add it, not this doc).

### First release under this workflow

If a version has never been tagged at all, `/release` skips the bump
step and just tags whatever `package.json` currently says. This repo
already had a `v1.0.0` tag from before this workflow existed, so its
first `/release` run bumps normally (`v1.0.0` → `v1.1.0`, the default
minor bump) rather than hitting that special case — it only matters for
a project that has genuinely never been tagged.

## Commands reference

| Command | Does |
|---|---|
| `/ship ["msg"]` | commit → PR → merge into `staging` |
| `/release [major\|minor\|patch]` | `staging` → `main`, tag, close shipped issues |
| `/boot` | read-only orientation for the `agent-hub/` memory system |
| `/worker implementer/verifier "<task>"` | the implement → verify loop this repo's `agent-hub/` runs on |

See `agent-hub/CLAUDE.md` for the full agent contract (forbidden states,
seal gate, four lenses) that governs how changes get made here.
