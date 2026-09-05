# 2026-09-05 — issue-61-forgot-reset-password

- Worker: implementer
- Version: 0.1.0
- Node: `issue-61-forgot-reset-password`
- Task (verbatim): "#61" via `/todo`, resolved from `gh issue view 61` —
  [ENHANCEMENT] Quên mật khẩu / Đổi mật khẩu (forgot-password email flow,
  reset-password via token, change-password while logged in).

## Hub bytes before: 81491

## Branch
`feature/issue-61-forgot-reset-password`, checked out from `staging`
(new-feature prefix — kept after merge per `/ship`'s rule).

## Scope decision
Verified directly against the sibling backend repo (`resume-nodejs-api`)
rather than assuming the issue's own "cần backend hỗ trợ" caveat is still
accurate:
- `src/routers/api/v1/auth.route.ts` — `POST /auth/forgot-password`
  (`authForgotPassword`) and `POST /auth/reset-password`
  (`authResetPassword`) are both real, wired, working routes — NOT the
  same gap as `issue-63-account-settings-page`'s candidate-update path.
- `src/auth/auth.validate.ts` — `schemaForgotPassword = { email }`,
  `schemaResetPassword = { token, password, repassword }` (`repassword`
  must match `password` via `Joi.ref`) — exact shapes the frontend needs
  to send.
- `src/utils/passwordReset.ts` (top-of-file comment, issue #70 in the
  backend repo) — reset tokens are real (Redis-or-in-memory, 15 min TTL,
  single-use, consumed atomically) but the reset LINK is only **logged**
  server-side, not actually emailed — no mail provider wired yet. This is
  a real, disclosed limitation, not something I can fix from this repo
  (no email infra lives here) — surfaced in the UI copy, not hidden.
- No dedicated "change password while already logged in" endpoint exists
  anywhere (`auth.route.ts` has no such route; `candidate.route.ts`'s
  `PATCH/PUT /update` schemas don't accept `password` — already
  established with evidence in `issue-63-account-settings-page`'s note).
  `PageAccountSettings.vue` (shipped in that PR) already discloses this
  exact gap ("Đổi mật khẩu hiện chưa được hỗ trợ...") — no new
  BLOCKED_ON_BACKEND row needed for an already-documented gap.

Scope: build the 2 pages the backend genuinely supports
(`PageForgotPassword.vue`, `PageResetPassword.vue`), wire real endpoints,
disclose the email-delivery stub honestly, leave "change password while
logged in" as already covered by the existing account-settings
disclosure.

## Diff
| File | Why |
|---|---|
| `src/services/auth.ts` | New `handleForgotPassword`/`handleResetPassword` functions, same shape/pattern as existing `handleLogin`/`handleRegister` (spinner/toast via props, `_axios` + `subURL`). |
| `src/pages/auth/PageForgotPassword.vue` (new) | Email-only form → `POST auth/forgot-password`. Same `VeeForm` + auth-card layout pattern as `PageLogin.vue`/`PageRegister.vue`. Link back to `/login`. |
| `src/pages/auth/PageResetPassword.vue` (new) | Reads `token` from `route.query` (the link the backend logs), password+repassword form (same Yup rules as `PageRegister.vue`'s password field — matches backend's `passwordRegex`/12-char minimum) → `POST auth/reset-password`. Shows an inline warning if `token` is missing from the URL. Redirects to `/login` on success. |
| `src/pages/auth/PageLogin.vue` | One new "Quên mật khẩu?" link → `/forgot-password`. |
| `src/routers/index.ts` | 2 new top-level routes (`/forgot-password`, `/reset-password`), same shape as sibling `/login`/`/register` (no `requiresAuth`). |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | New PM status row, `IN_PROGRESS`. |

**Not included, unrelated, flagged separately:** `git status` shows
`.claude/skills/persona-load/` untracked on `staging` before this branch
was cut — not touched, not mine, not part of this task.

## Command
`npm run build` (repo root, exact command from `doctrine/MEMORY.md`)

## Output
```
dist/assets/PageForgotPassword-B8uB2jfE.css   ...
dist/assets/PageForgotPassword-ZwQeXiCw.js    ...
dist/assets/PageResetPassword-Cdvn0gab.css    ...
dist/assets/PageResetPassword-ByCectte.js     ...
(!) Some chunks are larger than 500 kB after minification. Consider:
...
✓ built in 4.72s
```
Same pre-existing >500kB chunk warning as every prior SEAL (`VeeForm.js`)
— not a new regression.

```
npm run test -- --run
 Test Files  10 passed (10)
      Tests  76 passed (76)
```
Same 76/10 as the last SEAL — no regression, no new test file (no
existing precedent for a dedicated spec on an auth *page* component,
matches `PageLogin.vue`/`PageRegister.vue` — logic lives in
`services/auth.ts`, which also has no existing spec file for
`handleLogin`/`handleRegister` to follow a precedent from).

```
npm run lint
> resume-vuejs-website@1.4.0 lint
> eslint src --ext .js,.ts,.vue
(no output, exit 0)
```

## Manual verification — REAL browser this time, not just curl
A CDP debug browser was actually running on port 9888 this session
(unlike the `issue-63` pass). Per the implementer's own recorded
correction (`haven/workers/implementer/MEMORY.md`, 2026-08-25 entries),
used it for real: opened new tabs via `PUT /json/new?<url>`, drove them
over the raw CDP websocket (`Page.navigate`, `Runtime.evaluate`,
`Page.captureScreenshot`) — genuine visual confirmation, not inferred.

1. **Forgot-password page** (`/#/forgot-password`) — after the app's
   existing Render cold-start countdown finished, screenshot shows
   heading "QUÊN MẬT KHẨU", description text, email field with the
   correct placeholder, "Gửi yêu cầu" button, "Quay lại đăng nhập" link.
   Renders correctly.
2. **Reset-password page** (`/#/reset-password?token=abc123`) — **first
   attempt caught a real bug** (see "Noticed, not done" below): with a
   stale `token` already sitting in this browser's `localStorage`
   (leftover from earlier unrelated testing), the page rendered with
   `token` MISSING from `route.query` (showed the "Thiếu token" warning
   even though the URL clearly had `?token=abc123`). Re-tested after
   `localStorage.clear()` + a real `Page.navigate` (the realistic
   scenario — a user with no stale session clicking the link) —
   `location.hash` correctly retained `#/reset-password?token=abc123`,
   and the screenshot confirms the "Thiếu token" warning is gone, both
   password fields (with the same show/hide icon as `PageLogin.vue`) and
   the "Tối thiểu 12 ký tự..." helper text render correctly.
3. **Login page** (`/#/login`, hard-reloaded with `localStorage`
   cleared) — screenshot confirms the new "Quên mật khẩu?" link renders
   directly under the Login button, correct style (matches the existing
   link convention already used elsewhere in the app).

All 3 screenshots taken via real `Page.captureScreenshot`, not simulated.
Test tabs closed and dev server stopped after verification.

## Acceptance
| Criterion | Evidence |
|---|---|
| Node on diagram before code | `issue-61-forgot-reset-password` row added, `IN_PROGRESS`, before any `src/` file touched |
| Branch dedicated, not `main`/`staging` | `git branch --show-current` → `feature/issue-61-forgot-reset-password` |
| Smallest diff for backend-supported scope | 2 new pages + 2 service functions + 1 route pair + 1 login-page link; no opportunistic fixes bundled |
| Forgot/reset endpoints are real, verified | `auth.route.ts`/`auth.validate.ts` read directly in `resume-nodejs-api` |
| Email-delivery stub honestly disclosed | UI copy says "hệ thống sẽ tạo một liên kết" (creates a link), not "đã gửi email" (email sent) — evidence note also states it plainly |
| Change-password-while-logged-in correctly left out of scope | No new form for it; already covered by `PageAccountSettings.vue`'s existing disclosure from the prior SEALED node |
| Build green | `✓ built in 4.72s`, new `PageForgotPassword-*`/`PageResetPassword-*` chunks present |
| Lint clean | exit 0, no output |
| No test regressions | `Test Files 10 passed (10)`, `Tests 76 passed (76)` |
| UI/routes actually render correctly | 3 real screenshots via CDP, described above — a stronger check than the curl-only substitute used on the prior node |

## Noticed, not done
- **Real bug found, NOT fixed here (out of scope for this node):**
  `src/App.vue`'s `onMounted` hook — when `store.isAuthenticated` is true
  at hard-mount time, it unconditionally runs
  `router.push(localStorage.getItem('current-page') || '/dashboard/information')`,
  using only the cached PATH (no query string). If a user has any token
  in `localStorage` (even a stale/expired one — `isAuthenticated` only
  checks token *presence*, not validity) and opens a
  `/reset-password?token=...` link in that same browser, this redirect
  fires on mount and silently drops the token before `PageResetPassword.vue`
  ever reads `route.query.token` — the user sees "Thiếu token đặt lại mật
  khẩu" instead of the reset form, with no indication why. Reproduced
  directly via CDP (documented above). This is pre-existing logic I
  didn't write and is not scoped to my 2 new pages (it would affect
  *any* route with a query string, hit via hard-reload, for an
  authenticated-or-stale-token user) — recommend the operator open a new
  GitHub issue for it rather than folding a fix into this branch.
- Password strength rule duplicated (already duplicated by
  `PageRegister.vue` before this diff) between frontend Yup validation
  and backend Joi validation — not a new instance of the DRY gap, just
  reusing the exact existing pattern; not fixing the duplication itself,
  out of scope.

## Seal gate
No outward-facing action taken in this pass (no commit, no push, no
merge, no real destructive API call — `POST auth/forgot-password`/
`reset-password` were never actually invoked against a real backend,
only the frontend routes/rendering were exercised locally). Merging this
branch into `staging` is a separate `/ship` step, pending operator
approval.
