# 2026-09-06 — gitignore-worker-runs-log-fix

- Worker: implementer
- Version: 0.1.0
- Node: `gitignore-worker-runs-log-fix` (new node, `IN_PROGRESS` — chore,
  touches `.gitignore` only)
- Task (verbatim): operator, after the verifier's side-note on
  `agent-hub-archive-pass-4` flagged `worker-runs.log` as gitignored,
  asked me to look into it ("xem qua worker-runs.log gitignore đó xem
  sao"), then confirmed: "ừ fix đi" (yes, fix it).

## Hub bytes before: 84881

## Branch
`fix/gitignore-worker-runs-log`, checked out from `staging` (bugfix
prefix — deleted after merge per `/ship`'s rule).

## Root cause (verified directly, not inferred)
```
$ grep -n "\.log" .gitignore
3:*.log
4:npm-debug.log*
5:yarn-debug.log*
6:yarn-error.log*
7:pnpm-debug.log*
8:lerna-debug.log*

$ git check-ignore -v agent-hub/evidence/worker-runs.log
.gitignore:3:*.log	agent-hub/evidence/worker-runs.log

$ git log --oneline -- agent-hub/evidence/worker-runs.log
(empty)

$ find . -name "*.log" -not -path "*/node_modules/*" -not -path "*/dist/*"
./agent-hub/evidence/worker-runs.log
```
`.gitignore`'s line 3 (`*.log`, boilerplate from repo init) is a blanket
pattern broader than the 5 specific debug-log patterns already listed
right below it (lines 4-8, which already cover the real
npm/yarn/pnpm/lerna debug-log case). `worker-runs.log` is the ONLY
`.log` file anywhere in this repo outside `node_modules`/`dist` — so
line 3 was doing nothing except silently swallowing this one real file.
Confirmed via `git log` that it has genuinely never been committed,
despite `doctrine/MEMORY.md`'s stated invariant "evidence/ is committed;
'bad' notes are kept too" and `evidence/README.md`'s own description of
`worker-runs.log` as an append-only audit trail. All 3 lines currently
in the file (today's 3 SEAL verdicts) existed only in this local working
tree before this fix — would be silently lost on a fresh clone.

## Diff
| File | Why |
|---|---|
| `.gitignore` | Removed the redundant/overly-broad `*.log` line. The 5 specific patterns below it (`npm-debug.log*` etc.) already cover the intended debug-log noise — nothing else in this repo produces a `.log` file, confirmed by the `find` above. |
| `agent-hub/evidence/worker-runs.log` | Newly tracked (no longer ignored after the `.gitignore` fix — confirmed `git check-ignore -v` now exits 1, no `-f` needed). Content is the pre-existing 3 lines, untouched. |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | New PM status row, `IN_PROGRESS`. |

No other `src/` file touched.

## Command
```
npm run build
```
(from `doctrine/MEMORY.md`, repo root)

## Output (verbatim, tail)
```
dist/assets/index-Dr16DA0v.js                     348.47 kB │ gzip: 120.79 kB
dist/assets/VeeForm-DxE_q3Jk.js                   997.61 kB │ gzip: 283.12 kB

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 5.18s
```
Same pre-existing chunk-size warning as every prior SEALED node — not
caused by this diff.

```
npm run lint
> resume-vuejs-website@1.4.0 lint
> eslint src --ext .js,.ts,.vue
(no output, exit 0)
```

## Acceptance
| Criterion | Evidence |
|---|---|
| Node on diagram before code | `gitignore-worker-runs-log-fix` row added, `IN_PROGRESS`, before `.gitignore` was touched |
| Branch dedicated, not `main`/`staging` | `git branch --show-current` → `fix/gitignore-worker-runs-log` |
| Smallest diff | 1 line removed from `.gitignore`, 1 file newly tracked (content untouched), 1 diagram row — no opportunistic changes to the other `.gitignore` lines |
| Root cause verified, not guessed | `git check-ignore -v` + `git log` + `find` all read directly, quoted above |
| File no longer ignored | `git check-ignore -v agent-hub/evidence/worker-runs.log` → exit 1 (was exit 0 before) |
| No unwanted files surfaced by removing the blanket rule | `git status --short` after the `.gitignore` edit shows only the expected 3 changes — no other `.log` file anywhere in the repo to accidentally start tracking |
| Build green | `✓ built in 5.18s`, same pre-existing warning only |
| Lint clean | exit 0, no output |

## Noticed, not done
`agent-hub/evidence/worker-runs-archive.log` (referenced in
`evidence/README.md` and the `/hub-tokens` script as the eventual
archive destination for old `worker-runs.log` lines) doesn't exist yet —
not created here, out of scope (nothing to archive yet, only 3 lines
exist). It would have hit the exact same gitignore trap once created;
now it won't, since the blanket `*.log` rule is gone.

## Seal gate
No outward-facing action taken in this pass (no commit, no push, no
merge). Merging this branch into `staging` is a separate `/ship` step,
pending operator approval.
