# 2026-09-06 — agent-hub-archive-pass-4

- Worker: implementer
- Version: 0.1.0
- Node: `agent-hub-archive-pass-4` (new node, `IN_PROGRESS` — chore, no
  `src/` code)
- Task (verbatim): operator ran `/hub-tokens`, saw the active diagram
  flagged at 20,933B (>15KB threshold, 2 full SEALED entries not
  archived), said "ừ archive đi" (yes, archive it).

## Hub bytes before: 85915

## Branch
`chore/archive-diagram-pass-4`, checked out from `staging`. Named to
match the repo's existing convention (`git log` shows a prior
`chore(agent-hub): archive pass 3` commit) — this is pass 4.

## Diff
| File | Why |
|---|---|
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | Moved the 2 full SEALED rows dated 2026-09-05 (`issue-63-account-settings-page`, `issue-61-forgot-reset-password`) to compact pointer rows; updated the header note (4th-pass line + a `[note, 4th pass]` limitation line, matching the 3rd pass's own pattern). |
| `agent-hub/haven/diagrams/dev-loop-archive.md` | Appended both rows' full original text VERBATIM (no rewording, per the archive's own no-rewrite convention) at the end of the PM status table, under a new "4th pass" header note. |

No `src/` file touched — this is hub bookkeeping only.

## Command
```
npm run build
```
(from `doctrine/MEMORY.md` — sanity check only; this diff touches no
application code, `.md` files aren't part of the Vite build.)

## Output (verbatim, tail)
```
dist/assets/index-Dr16DA0v.js                     348.47 kB │ gzip: 120.79 kB
dist/assets/VeeForm-DxE_q3Jk.js                   997.61 kB │ gzip: 283.12 kB

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 4.72s
```
Same pre-existing chunk-size warning as every prior SEALED node — not
caused by this diff.

## Verification of the archive itself
- Re-ran the exact `/hub-tokens` script section for the active file:
  `wc -c agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` → 19,425B
  (down from 20,933B before this pass).
- `grep -cE '\| SEALED \|'` → 64, `grep -cE '— archived, see'` → 64 —
  every currently-SEALED row in the active file is now a pointer, zero
  full-content SEALED rows remain (matches the 3rd-pass precedent: only
  the 5 non-SEALED rows, which are never archived per LAI-13, stay
  full-content).
- Active file is STILL over the 15KB threshold (19,425B) after this
  pass — expected and disclosed up front in the diagram's own "[note,
  4th pass]" line, same as the 3rd pass's equivalent note: the floor is
  the mermaid diagram + header prose + the 5 non-SEALED rows (`hub-init`
  PENDING, 4x `issue-8-jwt-localstorage*` BLOCKED_ON_BACKEND, all fairly
  long) + this pass's own new `IN_PROGRESS` row. Further reduction isn't
  possible through archiving alone (archiving only ever moves SEALED
  rows) — not a failure of this task, a known structural floor.
- Confirmed both moved rows are byte-for-byte identical in the archive
  file vs. what they were in the active file before this edit (copied
  directly via `Edit`, not retyped/summarized — verified by re-reading
  the archive file's new tail after the edit).

## Acceptance
| Criterion | Evidence |
|---|---|
| Node on diagram before "code" | `agent-hub-archive-pass-4` row added, `IN_PROGRESS`, in the same edit that starts the archiving (this is a haven-only chore, `NodeBeforeCode` applies loosely per the `agent-hub-token-cleanup-20260830` precedent) |
| Branch dedicated, not `main`/`staging` | `git branch --show-current` → `chore/archive-diagram-pass-4` |
| Nothing deleted, nothing reworded (archive's own rule) | Both rows copied verbatim, byte-for-byte, from the active file into the archive |
| Active file's SEALED rows all pointers again | `grep` counts above: 64 SEALED = 64 archived-pointer |
| Build green (sanity) | `✓ built in 4.72s`, same pre-existing warning only |
| No `src/` touched | `git diff staging --stat` shows only the 2 diagram `.md` files |
| Threshold flag honestly reported, not hidden | Active file still 19,425B (>15KB) — disclosed explicitly, matches 3rd-pass precedent of an honest "floor" note rather than claiming full compliance |

## Noticed, not done
Nothing new. The still-over-threshold active file is the same known
structural limitation the 3rd pass already documented — not a new
finding, just re-confirmed here.

## Seal gate
No outward-facing action taken in this pass (no commit, no push, no
merge). Merging this branch into `staging` is a separate `/ship` step,
pending operator approval.
