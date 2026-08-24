# 2026-08-25 — issue-62-dark-mode-toggle

- Worker: implementer
- Version: 0.1.0
- Node: `issue-62-dark-mode-toggle` (new)
- Task (verbatim): "#62" via `/todo` — [GitHub issue #62](https://github.com/datvt243/vue-resume-web/issues/62),
  "[ENHANCEMENT] Dark mode toggle"

## Branch
`feature/dark-mode-toggle` (checked out from `main` before any change).

## Issue's own stated scope
- Toggle button in `Header.vue`, persist preference to `localStorage`.
- Set `data-bs-theme="dark"` on the root element (Bootstrap 5.3+ native
  dark-mode support — already imports `bootstrap/scss/variables-dark`).
- Check `sweetalert2.scss`, `vue3datepicker.scss`, CKEditor for dark-mode
  compatibility.

## Diff
| File | Change |
|---|---|
| `src/composables/useTheme.ts` | New — module-scoped `theme` ref, shared across every `useTheme()` call. Reads `localStorage['theme']`, falls back to `prefers-color-scheme` media query, defaults to `light`. Applies `data-bs-theme` on `document.documentElement` immediately at module load (so importing it early avoids a flash). `toggleTheme()` flips + persists + re-applies. |
| `src/composables/useTheme.spec.ts` | New — 5 tests (see below) |
| `src/main.ts` | Import `@/composables/useTheme` before `app.mount()`, so the persisted/preferred theme is set before first paint |
| `src/plugins/initFontAwesomeIcon.js` | Registered `faSun`/`faMoon` (needed for the toggle button's icon) |
| `src/pages/_layouts/Header.vue` | Added the toggle button in BOTH header states: inside `ul.navbar-nav` for the logged-out navbar, and in the `.d-flex.gap-2` action row for the logged-in navbar. Icon flips moon/sun by current `theme`; `title` attr states what clicking will do (in Vietnamese, matching the rest of the UI) |
| `src/components/veevalidate/part/FrmDatePicker.vue` | Changed `VueDatePicker`'s `dark` prop from a hardcoded `true` to `:dark="theme === 'dark'"` — see "Pre-existing bug found" below |

## Pre-existing bug found and fixed (in scope — issue explicitly asks to check `vue3datepicker.scss` compatibility)
`FrmDatePicker.vue` had `dark` hardcoded on `VueDatePicker`, meaning the
date picker widget rendered in dark theme **always**, even on the
(previously the only) light page — a small existing inconsistency. Now it
follows the app's actual theme. This is a visible behavior change in
LIGHT mode too (the date picker used to look dark, now looks light to
match) — flagging clearly since it's not purely additive.

## Checked, not changed (SweetAlert2 / CKEditor)
- `sweetalert2.scss` hardcodes a full light palette (`$swal2-background:
  $swal2-white`, etc.) — SweetAlert2 popups will stay light-styled
  regardless of `data-bs-theme`. This doesn't break/make anything
  unreadable (popup is self-contained, always has its own light
  background+dark text), it just won't visually match a dark page.
  Reskinning it for dark mode is a real separate effort (own variable
  overrides or `@media`), out of this task's ~1-day scope per the issue's
  own estimate — logged as follow-up, not attempted.
- CKEditor (`ckeditor5`, used via `FrmCkediter.vue`/`CKEditor.vue`) has no
  built-in reactive dark skin wired up in this repo; would need either a
  CKEditor dark theme plugin or custom CSS overrides. Same as above — real
  separate effort, not attempted here.

## Manual UI verification — LIMITATION, disclosed
No browser-automation/screenshot tool was available in this session
(`ToolSearch` for chrome/CDP/screenshot tooling returned nothing — only
raw `curl` against the port-9888 DevTools HTTP endpoint, which manages
tabs but cannot render/screenshot). Could NOT do an actual visual
click-through this pass. Substituted with:
1. A real, passing Vitest suite on the actual toggle logic (`useTheme.spec.ts`)
   — not just build-green, real behavioral assertions.
2. Confirmed via `curl` that the running dev server (`localhost:5173`)
   transforms and serves `main.ts` and `Header.vue` with the new code
   present and no compile/transform error (HTTP 200, transformed output
   contains `useTheme`/`toggleTheme`).
Logged as a correction in `haven/workers/implementer/MEMORY.md` for future
sessions with the same tooling gap.

## Real bug caught by writing the test (not by inspection)
First version of `useTheme.ts` had `window.matchMedia?.('...').matches` —
the optional chaining only guards the *call*, not the trailing `.matches`
access. jsdom does NOT implement `window.matchMedia` (confirmed:
`typeof window.matchMedia === 'undefined'` in this test environment) —
so this would throw `TypeError: Cannot read properties of undefined
(reading 'matches')` on any environment without `matchMedia` (this test
env, and some older/embedded browsers). Fixed to
`window.matchMedia?.('...')?.matches` before writing the tests around it.

## Commands
```
npm run test
npm run build
npm run lint
```
(all three from `doctrine/MEMORY.md`, repo root)

## Output
```
 RUN  v2.1.9 /Users/_david/Workspace/Project/ResumeAPI/frontend

 ✓ src/utilities/index.spec.ts (13 tests) 5ms
 ✓ src/composables/useTheme.spec.ts (5 tests) 51ms
 ✓ src/stores/candidate.spec.ts (11 tests) 6ms
 ✓ src/stores/auth.spec.ts (9 tests) 7ms
 ✓ src/composables/useDocument.spec.ts (9 tests) 24ms
 ✓ src/composables/useCandidate.spec.ts (8 tests) 29ms

 Test Files  6 passed (6)
      Tests  55 passed (55)
```
```
✓ built in 4.95s
```
```
> vue-resume-web@0.0.0 lint
> eslint src --ext .js,.ts,.vue

(no output — exit 0)
```
Dev-server compile check:
```
$ curl -s -o /dev/null -w "http_code=%{http_code}\n" http://localhost:5173/vue-resume-web/
http_code=200
$ curl -s http://localhost:5173/vue-resume-web/src/main.ts | grep useTheme
import "/vue-resume-web/src/composables/useTheme.ts?t=1787596366651";
$ curl -s http://localhost:5173/vue-resume-web/src/pages/_layouts/Header.vue | grep -n "toggleTheme"
27:const { theme, toggleTheme } = useTheme()
```

## Acceptance
| Criterion | Evidence |
|---|---|
| Toggle button in `Header.vue`, both auth states | Diff shows both branches of the pug template edited |
| Preference persisted to `localStorage` | `useTheme.spec.ts` — "toggleTheme flips the value, persists it..." test |
| `data-bs-theme` set on root element | Same test — asserts `document.documentElement.getAttribute('data-bs-theme')` |
| Custom styles checked for dark-mode compatibility | `sweetalert2.scss`, `vue3datepicker.scss`, CKEditor usage read directly; findings above (1 real bug fixed, 2 logged as follow-up) |
| Build/lint/test green | `✓ built in 4.95s`; lint exit 0; `55 passed (55)` |
| No dependency-lockfile side effect | `git diff main --stat -- yarn.lock` → empty; no `npm install` run this pass |
| Branch is not `main` | `git branch --show-current` → `feature/dark-mode-toggle` |

## Noticed, not done
- SweetAlert2 popups stay light-only (see "Checked, not changed" above).
- CKEditor has no dark skin wired up (see above).
- No actual visual/click-through verification this pass — see "Manual UI
  verification" limitation above. Verifier should weigh this explicitly.

## Seal gate
No outward-facing action taken (no commit/push/merge) — diff uncommitted
on `feature/dark-mode-toggle`. Commit + merge to `main` goes through
`/ship`, separate approval.
