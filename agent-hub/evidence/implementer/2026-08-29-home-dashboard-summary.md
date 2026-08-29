# 2026-08-29 - home-dashboard-summary

- Worker: implementer
- Version: 0.1.0
- Node: `home-dashboard-summary` (new node — no existing diagram node
  matched; task direct from operator, not a GitHub issue)
- Task (verbatim): "khi click vào 'logo' Resume API, thì qua về url '/#'
  hiện nút login, hãy update thành page dashboard với các thông số cơ bản
  / section 1: bao gồm thông tin cơ bản avatar (nếu có) họ tên, vị trí,
  tình trạng open-to-work và email / section 2: lượt view CV (thông tin
  này chưa có để tạm view = 0) / section 3: Attack CV, hiển thị file
  attack kèm chức năng attack file mới, file pdf / section 4, Profile
  Information, hiển thị phần trăm CV đã hoàn thành, chức năng này cũng
  chưa có, hãy để số liệu mẫu"

## Scope clarification (operator confirmed)
Section 3 ("Attach CV") has no backend support — grepped the sibling
backend repo (`../backend`), confirmed there is no upload/save endpoint
for a CV file (only `POST .../download-pdf`, which server-generates a PDF
from structured resume data via Puppeteer, not a stored uploaded file —
`src/services/createPDF.ts`, `src/candidate_me/index.ts:127`). Asked the
operator via `AskUserQuestion` how to handle this gap; operator replied
"hãy để lên trước, backend sẽ update sau" (ship the UI now, backend
catches up later) — implemented as a UI-only stub: file picker + selected
filename shown, explicitly NOT persisted, disclosed inline in the UI and
via a toast on file select.

## Branch
`feature/home-dashboard-summary` (checked out from `main` before touching
any file — corrected the branch-order slip from earlier today's task by
branching before running the build/evidence steps this time, but still
after editing the FontAwesome icon file; no commit had happened yet so no
`MAIN_EDIT` landed).

## Diff
| file | why |
|---|---|
| `src/pages/home/PageHome.vue` | Full rebuild. Was a placeholder ("Welcome to ResumeAPI" + a Login link, even though the route requires auth). Now 4 sections per the task, all reading from `candidateStore` (already populated on app mount, no new API calls needed): (1) avatar (real if `candidate.avatar` ever exists on the backend — it currently doesn't, so this always falls back to initials; falls back gracefully, matches "avatar (nếu có)"), full name, `positionDesired`, `openToWork` badge (uses the field added in the prior `open-to-work-field` node), email; (2) CV view count hardcoded `0`, commented as a placeholder — no view-counting API exists; (3) real "Tải CV hiện tại" link reusing the existing `download-pdf` endpoint (same URL pattern as `Header.vue`'s `_settings.getFile()`), plus a file-picker "Đính kèm file mới" button that only captures the filename client-side and shows a toast disclosing it isn't actually uploaded yet (see scope clarification above); (4) hardcoded `72%` progress bar, commented as sample data — no CV-completion-scoring feature exists. |
| `src/plugins/initFontAwesomeIcon.js` | Added `faUser`, `faPaperclip`, `faCircleCheck`, `faCircleXmark` — needed by the new page (avatar fallback icon reasoning, attach button, open-to-work badge icon) and not previously registered. |

Not touched: `src/pages/_layouts/Header.vue`'s logo link (`href="#"`) — it
already correctly routes to `/` under hash history (confirmed: the
reported symptom was the PAGE CONTENT at `/` being a placeholder, not a
routing bug — the link itself works). `src/routers/index.ts` — route `/`
already exists and already requires auth, no change needed.

## Command
```
npm run build
```
(from repo root, per `doctrine/MEMORY.md`.)

## Output
```
> vue-resume-web@0.0.0 build
> vite build

vite v5.3.2 building for production...
transforming...
✓ 1343 modules transformed.
rendering chunks...
computing gzip size...
...
dist/assets/PageHome-CM6erXJz.js                   3.91 kB │ gzip:   1.95 kB
...
✓ built in 4.92s
```
Same pre-existing chunk-size warning only (`VeeForm-*.js` > 500kB, present
before this change too).

## Acceptance
| Criterion | Evidence |
|---|---|
| `npm run build` green | `✓ built in 4.92s`, no errors |
| Section 1: avatar/name/position/open-to-work/email | Live CDP check (below): heading "Thông tin cơ bản" renders; badge found with real text "Không tìm việc" (this test account currently has `openToWork: false`) |
| Section 2: view count = 0, disclosed as placeholder | Heading "Lượt xem CV" renders; source hardcodes `cvViewCount = 0` with an inline comment |
| Section 3: shows current file + attach-new stub | Heading "Đính kèm CV" renders; live check found a real `a[href*="download-pdf"]` with the correct token-bearing URL, plus `input[type=file]` and the attach `<button>` both present in the DOM |
| Section 4: sample completion % | Heading "Profile Information" renders; live check: `.progress-bar` element found with `style="width: 72%"` matching the hardcoded `profileCompletion = 72` |

## Manual verification
No screenshot tool loaded this session — same real-CDP technique used in
both prior tasks today: connected to the already-open debug Chrome (port
9888) via `node_modules/ws`, navigated the existing dev-server tab to
`#/` (Vite HMR already picked up the change), then queried the DOM:

```
4|Thông tin cơ bản||Lượt xem CV||Đính kèm CV||Profile Information
true|true   (input[type=file] present | a <button> is present)
```//also confirmed separately: badge text "Không tìm việc", progress-bar
width "72%", download link href pointing at the real production
`download-pdf` endpoint with a real bearer token.

Read-only navigation only, no form submit, no data mutated, on the
operator's real authenticated dev session.

## Noticed, not done
- No component test exists for `PageHome.vue` (issue #7, components
  untested in general) — not fixed here, out of scope.
- `candidate.avatar` doesn't exist on the backend at all (confirmed via
  `../backend/src/models/candidate.model.ts` — no such field). The
  frontend code defensively checks for it (`info.value?.avatar`) so
  nothing needs to change here if/when the backend adds it — logged for
  awareness, not a bug.
- The "Đính kèm file mới" button is disclosed as non-persisting per the
  operator's own explicit decision this session — not a hidden gap.

## Seal gate
None — no commit/push/merge/deploy happened in this pass. Only local file
edits + local build + local read-only navigation check.
