# 2026-08-25 — issue-62-dark-mode-body-attr-override — SEAL

- Worker: verifier
- Version: 0.1.0
- Node: `issue-62-dark-mode-body-attr-override` (new node, regression fix
  for the already-SEALED `issue-62-dark-mode-toggle`; per LAI-13 that old
  node's PM status is not touched)
- Evidence reviewed: `evidence/implementer/2026-08-25-issue-62-dark-mode-body-attr-override.md`
- Verdict: **SEAL**

This is a re-verification of a case where the prior SEAL was itself wrong
(operator caught a real no-op in production after the first
implementer+verifier pass trusted unit tests alone). Given that history,
every claim below was reproduced independently rather than taken from the
note's text, including a fresh CDP script (not the note's captured
output).

## Branch / scope
- `git branch --show-current` → `fix/issue-62-dark-mode-body-attr-override`
  — not `main`. `NoMainEdit` satisfied.
- `git diff main --stat -- yarn.lock package.json package-lock.json` →
  empty. No lockfile/dependency side effect.
- `git status --short` → `index.html`, `src/composables/useTheme.ts`,
  `src/composables/useTheme.spec.ts` modified; `index.spec.ts` new;
  `agent-hub/doctrine/domains/PROJECT.md` and
  `agent-hub/haven/workers/implementer/MEMORY.md` modified (hub memory
  logging the trap + the CDP technique — read both diffs directly,
  markdown-only, no code, matches what the note discloses). No file
  outside the claimed scope was touched.

## Direct source reads
- `index.html`: `<body>` tag confirmed to have no `data-bs-theme`
  attribute (line 9, just `<body>`).
- `src/composables/useTheme.ts`: `getPreferredTheme()` confirmed —
  saved localStorage value wins; else `matchMedia('(prefers-color-scheme:
  light)')` → `'light'`; else falls back to `'dark'`. Matches the note's
  claim exactly (dark is now the default fallback, was `'light'` before).
- `src/composables/useTheme.spec.ts`: read all 6 tests. `mockMatchMedia`
  is genuinely query-aware (`query.includes('light') ? prefersLight :
  !prefersLight`), not a blanket match. Tests assert the actual new
  behavior: dark-default-with-no-matchMedia, OS-light-honored, OS-dark-still-dark
  (distinct case), saved-value-wins, toggle persistence, shared state —
  not renamed placeholders.
- `index.spec.ts`: reads the real `index.html` off disk and regex-asserts
  the `<body ...>` tag does not contain `data-bs-theme`. A genuine
  regression guard, not a trivial always-pass.

## Commands re-run myself
- `npm run test` → `Test Files 7 passed (7)`, `Tests 57 passed (57)`,
  output not truncated. Matches note exactly.
- `npm run build` → `✓ built in 4.73s`, exit 0. Same pre-existing
  chunk-size warning as prior sealed nodes, nothing new.
- `npm run lint` → exit 0, no output (clean).

## Live reproduction (independent, own script — not the note's transcript)
Chrome debug instance on port 9888, tab `http://localhost:5173/vue-resume-web/#/login`.
Wrote a fresh throwaway CDP script
(`/private/tmp/.../scratchpad/verify-dark-mode.js`, this verifier session's
own file, never touched the repo) using `require('.../node_modules/ws')`
directly against the `webSocketDebuggerUrl`. Sequence: `localStorage.clear()`
→ `Page.reload({ignoreCache:true})` → wait for `Page.loadEventFired` →
read state → find `[title]` element containing "giao diện" and `.click()`
it → read state again.

```
Using tab: http://localhost:5173/vue-resume-web/#/login
--- BEFORE click (after hard reload, localStorage cleared) ---
{"htmlTheme":"dark","bodyHasThemeAttr":false,"bodyBg":"rgb(33, 37, 41)","bodyColor":"rgb(222, 226, 230)","localStorageTheme":null}
--- click attempt ---
{"found":true,"title":"Chuyển sang giao diện sáng"}
--- AFTER click ---
{"htmlTheme":"light","bodyHasThemeAttr":false,"bodyBg":"rgb(255, 255, 255)","bodyColor":"rgb(33, 37, 41)","localStorageTheme":"light"}
```

`bodyHasThemeAttr: false` in both readings — confirms the hardcoded
`<body data-bs-theme="dark">` regression is gone, not just in the source
file but in the actually-rendered live DOM. The real toggle button, found
by its real Vietnamese title (not synthesized), produced a real visible
background-color change on `body` (`rgb(33,37,41)` → `rgb(255,255,255)`)
on a genuine `.click()`. This independently reproduces — does not merely
repeat — the note's claimed CDP output.

## Acceptance criteria — one by one
| Criterion | Verdict | Evidence |
|---|---|---|
| Root cause identified precisely | MET | Read `index.html` + `useTheme.ts` directly, confirms exact mechanism described |
| Fix verified live, not just unit test | MET | Own fresh CDP script, real click, real computed-style change |
| Existing default look preserved | MET | Read `getPreferredTheme()` source: falls back to `'dark'` |
| Regression can't silently reappear | MET | Read `index.spec.ts`, real regex guard against `<body>`'s raw HTML |
| Build/lint/test suite green | MET | Re-ran all 3 myself, verbatim output above |
| No lockfile side effect | MET | `git diff main --stat` on all 3 lockfile-ish paths is empty |
| Branch is not `main` | MET | `git branch --show-current` |
| No out-of-scope files touched | MET | `git status --short` fully accounted for; hub memory edits are disclosed logging, not code |

## Forbidden states scan
`ADHOC_WORK` no (went through implementer, node exists) · `NO_EVIDENCE` no
· `EDIT_UNVERIFIED` no (independently re-ran everything) ·
`CODE_IN_HAVEN` no (hub diffs are markdown only) · `DIAGRAM_DRIFT` — being
resolved by this SEAL (PM status add) · `MAIN_EDIT` no.

## Seal gate
No outward-facing action in the diff itself (uncommitted on the fix
branch) — matches the note. Commit/merge to `main` is a separate `/ship`
step, not part of this SEAL.

## Decision
SEAL. Every acceptance criterion has independently-reproduced, citable
evidence — not inferred from the note's text. The prior regression
happened because verification stopped at trusting a described result;
this pass deliberately did not repeat that mistake.
