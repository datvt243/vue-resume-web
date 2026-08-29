# 2026-08-29 - loading-countdown-redesign

- Worker: implementer
- Version: 0.1.0
- Node: `loading-countdown-redesign` (new node — no existing diagram node
  matched, task is direct from operator via `/todo`, not a GitHub issue)
- Task (verbatim): "phần loading tôi muốn hiển thị thông tin rõ hơn, vì là
  project cá nhân xài server free nên loading lâu, thời gian là 30s, hãy
  xây dựng lại Loading, và bộ đếm ngược 30s"

## Branch
`feature/loading-countdown-redesign` (checked out from `main`). Caught a
self-correction mid-task: wrote the diff before running `git checkout -b`
(should be step 0 per `implement.md`) — no commit had happened yet, so
fixed immediately by branching before build/evidence, no `MAIN_EDIT`
actually landed on `main`.

## Diff
| file | why |
|---|---|
| `src/components/Spinner.vue` | Rebuilt the loading overlay: replaced the plain Bootstrap spinner + one static line of text with a circular countdown ring (SVG-free, CSS `conic-gradient`) counting down from 30s, clearer copy explaining the free-tier cold start, and an "overtime" fallback state (spinning icon + reassurance text) if the call takes longer than 30s. `show()`/`hide()` public API (`defineExpose`) unchanged — no caller (`App.vue`, `services/base.ts`) needed edits. |

## Command
```
npm run build
```
(from repo root, per `doctrine/MEMORY.md` — no dedicated test file exists
for this component; `npm run test` doesn't cover `.vue` components yet,
see `doctrine/MEMORY.md` → Test row.)

## Output
```
> vue-resume-web@0.0.0 build
> vite build

vite v5.3.2 building for production...
transforming...
✓ 1342 modules transformed.
rendering chunks...
computing gzip size...
...
✓ built in 7.73s
```
Same pre-existing chunk-size warning only (`VeeForm-*.js` > 500kB,
present before this change too, unrelated to this diff).

One real error caught and fixed during this same pass: a stray
`</content>` tag leaked into the file from the initial write, which broke
the Vue SFC parser (`Invalid end tag` at line 150) on the first
`npm run build` attempt. Fixed, rebuilt, green on the second attempt
(output above is the passing run).

## Acceptance
| Criterion | Evidence |
|---|---|
| `npm run build` green | `✓ built in 7.73s`, no errors |
| Countdown starts at 30 and is visible when loading | Live CDP check (below): `number: "30"` on the first two polls after triggering a real spinner show |
| `show()`/`hide()` public contract unchanged (no caller edits needed) | `grep -rn "spinner" src/App.vue src/services/base.ts` unchanged — both still call `.show()`/`.hide()` with no args |
| Manual UI observation (this project has no component test for `.vue` files yet — see `doctrine/MEMORY.md`) | See "Manual verification" below |

## Manual verification
No dedicated browser-automation/screenshot tool loaded this session
(consistent with the technique logged in
`haven/workers/implementer/MEMORY.md` from the dark-mode toggle fix) —
used the same real-CDP technique instead of settling for build-only
evidence: `node_modules/ws` connected to the already-open debug Chrome
(port 9888, tab already authenticated and on
`/vue-resume-web/#/dashboard/information` — the operator's real session,
so I did NOT log in or mutate any data, only triggered a page **reload**,
which is the same read-only `GET candidate/<email>` call `App.vue`
already makes on every mount). Polled `.spinner-container` /
`.countdown-number` / `.countdown-ring` every 500ms for 6s after the
reload:

```json
[
  { "visible": true,  "number": "30", "overtime": false },
  { "visible": true,  "number": "30", "overtime": false },
  { "visible": false },
  { "visible": false },
  ... (9 more, all visible: false)
]
```

Confirms: the countdown ring renders with `30` immediately on `show()`,
`overtime` class is not set at start, and the overlay correctly
disappears once the real API call resolves (this dev-server run hit a
fast/local response, so the countdown didn't have time to tick down or
hit overtime in this particular observation — the 1s `setInterval` logic
itself is plain, deterministic JS with no async/timing dependency, so
this is judged sufficient without forcing an artificial 30s-plus delay
against a real production call). Tab confirmed still on
`/vue-resume-web/#/dashboard/information` after reload, no crash, no
console error surfaced by the build step.

## Noticed, not done
- No dedicated unit test exists for `Spinner.vue`'s countdown timer logic
  (interval start/stop/reset). Issue #7 (no component tests yet) already
  tracks this gap generally — not fixed here, out of scope for a UI-copy
  task.

## Seal gate
None — no commit/push/merge/deploy happened in this pass. Only local
file edit + local build + local read-only reload for verification.
