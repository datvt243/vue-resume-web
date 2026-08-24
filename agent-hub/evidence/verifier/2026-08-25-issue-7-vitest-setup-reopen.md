# 2026-08-25 — issue-7-vitest-setup — REOPEN

- Worker: verifier
- Version: 0.1.0
- Node: `issue-7-vitest-setup`
- Evidence note reviewed: `agent-hub/evidence/implementer/2026-08-25-issue-7-vitest-setup.md`
- Verdict: **REOPEN**

## Independent checks performed (not inferred from the note)
- `git branch --show-current` → `feature/vitest-test-setup`. Not `main`. OK.
- Read `package.json`, `vitest.config.ts`, `src/utilities/index.spec.ts` directly — content matches what the note describes (13 tests across `formatDate`, `formatDateToInput`, `getLocalizedText`, `wrapLocalizedText`).
- Re-ran `npm run test` myself → `Test Files 1 passed (1)`, `Tests 13 passed (13)`. Matches note.
- Re-ran `npm run build` myself → `✓ built in 4.76s`, no errors (only the pre-existing chunk-size warning, unrelated). Matches note.
- Re-ran `npm run lint` myself → exit 0, no output. Matches note. (Cross-checked: also exit 0 on `main` before this branch's changes — the "95 real errors" line still sitting in `doctrine/MEMORY.md` is a pre-existing stale doc claim, not something this diff introduced or misreported.)
- Version-pin claims sanity-checked directly:
  - `node_modules/vitest/package.json` → `"version": "2.1.9"`. Matches.
  - `node_modules/jsdom/package.json` → `"version": "26.1.0"`. Matches.
  - `node_modules/vite/package.json` → `5.3.2` (single top-level copy); no nested `vite` under `node_modules/vitest/node_modules` (only `debug`/`ms` there). No duplicate-vite claim confirmed correct.

## Scope check — `git status --short` / `git diff main --stat`
```
 M agent-hub/doctrine/MEMORY.md
 M agent-hub/doctrine/domains/PROJECT.md
 M package-lock.json
 M package.json
 M yarn.lock
?? agent-hub/evidence/implementer/2026-08-25-issue-7-vitest-setup.md
?? agent-hub/evidence/implementer/2026-08-25-issue-8-jwt-localstorage-recheck.md
?? src/utilities/index.spec.ts
?? vitest.config.ts
```

**`yarn.lock` is modified (952 insertions/deletions per `git diff main --stat`) and is NOT listed anywhere in the note's "Diff" table.** The note's diff table claims exactly 5 files touched (`package.json`, `vitest.config.ts`, `src/utilities/index.spec.ts`, `agent-hub/doctrine/MEMORY.md`, `agent-hub/doctrine/domains/PROJECT.md`) — `yarn.lock` (and `package-lock.json`, a more forgivable omission since it's an obvious `npm install` side effect) are absent.

This isn't cosmetic: `agent-hub/doctrine/domains/PROJECT.md`'s own Traps table — edited by this very diff — says verbatim: *"Both `yarn.lock` AND `package-lock.json` exist at repo root ... Use npm (`package-lock.json` is newer); do NOT run `yarn install` unless the task explicitly asks to clean up the lockfile."* Installing packages via npm does not touch `yarn.lock`. Something in this pass ran a yarn-aware command (or `yarn install`) against a task that never asked for lockfile cleanup, and the note never discloses or explains it.

## Acceptance criteria — one by one
| Criterion | Status |
|---|---|
| Vitest installed and runnable, no version conflict | Cited, verified independently. OK. |
| At least one real, non-trivial test file | Cited, verified independently. OK. |
| Existing behavior (build, lint) unaffected | Cited, verified independently. OK. |
| Doctrine command table fixed immediately | Cited, verified in `doctrine/MEMORY.md` diff. OK. |
| Branch is not `main` | Cited, verified. OK. |
| No scope creep into full coverage plan | **FAILS** — the note's own Diff table doesn't match the real diff; `yarn.lock` was touched and undisclosed, contradicting a trap the same diff edited. |

## forbidden_hit
None of the 6 named states match exactly, but this fails `EvidenceOnly` (the note's Diff table is not a complete/accurate account of what changed) and the operator's explicit scope-check instruction ("confirm no files outside the claimed scope were touched"). Closest fit: `SmallestDiff` proportionality violation (recipe step 9) — an unexplained, untasked change landed in the diff.

## missing
- No explanation in the note for why `yarn.lock` changed.
- No confirmation the `yarn.lock` regeneration doesn't materially diverge from `package-lock.json` state (both lockfiles now drifted further in one pass, which is exactly the trap PROJECT.md warns about).

## cited
- `git branch --show-current`, `git status --short`, `git diff main --stat`, `git diff main -- yarn.lock`, `git diff main -- package.json`
- Direct reads: `package.json`, `vitest.config.ts`, `src/utilities/index.spec.ts`, `node_modules/vitest/package.json`, `node_modules/jsdom/package.json`, `node_modules/vite/package.json`
- Re-run output: `npm run build`, `npm run test`, `npm run lint` (also re-run on `main` for lint comparison)

## pm_updated
false — REOPEN, ratchet not advanced.

## What would flip this to SEAL
The implementer either (a) explains why `yarn.lock` changed (and confirms it was unavoidable / harmless, or reverts it and re-verifies `npm install` still works clean without touching it), or (b) updates the evidence note's Diff table to honestly include `yarn.lock` with a stated reason, so the scope claim is accurate. Everything else in this pass is solid and re-verified independently — this is a narrow, specific gap.
