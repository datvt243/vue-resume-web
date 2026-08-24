# 2026-08-25 — issue-62-dark-mode-body-attr-override

- Worker: implementer
- Version: 0.1.0
- Node: `issue-62-dark-mode-body-attr-override` (new — regression fix for
  the already-SEALED `issue-62-dark-mode-toggle` node; LAI-13 forbids
  editing that old node's PM status directly, this is a separate node)
- Task (verbatim): operator manually tested the shipped dark-mode toggle
  and reported: "#62 tôi thấy chưa work, chưa có light/dark theme" (it
  doesn't work, there's no light/dark theme) — a real regression report,
  not a new feature request

## Branch
`fix/issue-62-dark-mode-body-attr-override` (checked out from `main`
before any change).

## Root cause
`index.html` (line 9) hardcoded `<body data-bs-theme="dark">`. CSS custom
properties driven by `[data-bs-theme=...]` resolve from the CLOSEST
ancestor carrying the attribute — `<body>` (which contains `#app`, i.e.
the entire visible app) is closer than `<html>` for every element on the
page. `useTheme.ts` only ever sets the attribute on
`document.documentElement` (`<html>`). Result: toggling correctly flipped
`<html>`'s attribute, but `<body>`'s hardcoded `dark` value shadowed it
for literally everything visible — the toggle was a real, silent no-op.
This `<body>` attribute predates this task (added by the earlier
`feature/default-layout-redesign` work, unrelated to issue #62).

## Why this shipped past implementer + verifier on the first pass
Neither had a real browser-screenshot tool that session (disclosed
honestly in `evidence/implementer/2026-08-25-issue-62-dark-mode-toggle.md`)
and substituted unit tests (`useTheme.spec.ts`) + a `curl` compile check.
The unit tests correctly proved `useTheme.ts` itself works — they just
can't catch a conflict with a DIFFERENT file (`index.html`) that the
composable doesn't control. The operator caught this by actually running
the app.

## Diff
| File | Change |
|---|---|
| `index.html` | Removed the hardcoded `data-bs-theme="dark"` from `<body>` |
| `src/composables/useTheme.ts` | `getPreferredTheme()`'s no-saved-value fallback changed from `'light'` to `'dark'` — preserves the app's existing default look (previously enforced by the now-removed hardcoded attribute) for everyone except users whose OS explicitly reports `prefers-color-scheme: light`, who now correctly get light by default |
| `src/composables/useTheme.spec.ts` | Updated the 2 tests whose expected default was `'light'` (now `'dark'`); rewrote `mockMatchMedia` to be query-aware (previously any query matched, which would have made the new "explicit OS light" check spuriously pass); added a test for "OS explicitly prefers dark → still dark" to distinguish from "no preference" |
| `index.spec.ts` (new, repo root) | Regression guard: reads `index.html`, asserts the `<body>` tag does NOT contain `data-bs-theme` — so this exact bug class can't silently reappear |

## Real, live verification (not just unit tests this time)
No screenshot tool is available this session either, but per the
correction logged in `haven/workers/implementer/MEMORY.md`, used a
throwaway Node script against the already-running debug Chrome (port
9888) via the CDP `Runtime.evaluate` method (`node_modules/ws`, present
transitively, no new dependency added):

```
--- after hard reload, localStorage cleared ---
html data-bs-theme: dark
body data-bs-theme attr present?: false
body computed bg: rgb(33, 37, 41)
body computed color: rgb(222, 226, 230)
toggle click result: clicked: Chuyển sang giao diện sáng
--- after clicking toggle ---
html data-bs-theme: light
body computed bg: rgb(255, 255, 255)
body computed color: rgb(33, 37, 41)
localStorage theme: light
```
This is real: `document.documentElement.getAttribute` read directly,
`getComputedStyle` read directly, the actual toggle `<button>` found by
its real `title` text and `.click()`'d — not simulated/inferred.
`rgb(33,37,41)` → `rgb(255,255,255)` on the SAME `body` element,
triggered by a real click, is the visible fix working.

## Commands
```
npm run test
npm run build
npm run lint
```

## Output
```
 RUN  v2.1.9 /Users/_david/Workspace/Project/ResumeAPI/frontend

 ✓ index.spec.ts (1 test) 2ms
 ✓ src/utilities/index.spec.ts (13 tests) 4ms
 ✓ src/stores/candidate.spec.ts (11 tests) 8ms
 ✓ src/composables/useTheme.spec.ts (6 tests) 68ms
 ✓ src/stores/auth.spec.ts (9 tests) 8ms
 ✓ src/composables/useDocument.spec.ts (9 tests) 22ms
 ✓ src/composables/useCandidate.spec.ts (8 tests) 26ms

 Test Files  7 passed (7)
      Tests  57 passed (57)
```
```
✓ built in 4.96s
```
```
> vue-resume-web@0.0.0 lint
> eslint src --ext .js,.ts,.vue

(no output — exit 0)
```

## Acceptance
| Criterion | Evidence |
|---|---|
| Root cause identified precisely, not guessed | CDP script showed `body computed bg` was dark even while `html[data-bs-theme]` was correctly `"light"` on the very first check, before any fix — isolated to `index.html`'s hardcoded attribute |
| Fix verified live, not just via unit test | CDP script: real click on the real button, real `getComputedStyle` before/after showing the actual color change |
| Existing default look preserved for the common case | `getPreferredTheme()` still returns `'dark'` when there's no saved value and no explicit OS-light signal |
| Regression can't silently reappear | `index.spec.ts` fails the build's test step if `data-bs-theme` is ever re-added to `<body>` |
| Build/lint/full test suite still green | `✓ built in 4.96s`; lint exit 0; `57 passed (57)` |
| No dependency-lockfile side effect | No `npm install` run this pass; `ws` used via existing transitive `node_modules/ws`, not added to `package.json` |
| Branch is not `main` | `git branch --show-current` → `fix/issue-62-dark-mode-body-attr-override` |

## Noticed, not done
- The CDP-script technique used here for live verification isn't
  formalized as a reusable script/recipe anywhere — logged as a technique
  in `haven/workers/implementer/MEMORY.md`, but a real reusable helper
  script (e.g. under a `scripts/` dir, NOT `agent-hub/haven/`, since code
  doesn't belong in the hub) could save time next time a UI diff needs
  live verification without a dedicated browser tool.

## Seal gate
No outward-facing action taken (no commit/push/merge) — diff uncommitted
on `fix/issue-62-dark-mode-body-attr-override`. Commit + merge to `main`
goes through `/ship`, separate approval.
