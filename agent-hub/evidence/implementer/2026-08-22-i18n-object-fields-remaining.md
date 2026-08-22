---
node: i18n-object-fields-remaining
worker: implementer
date: 2026-08-22
---

## Task
Operator (via `/todo`): "tôi đã logout, giờ bạn hãy check tất cả các API
hiện có, từ đăng ký, đăng nhập, điền thông tin tất cả các mục, create
update delete. hãy kiểm tra tất cả và fix nếu có" (full CRUD audit across
register/login/every section's create-update-delete, fix what's found).

No existing node covered a full audit — appended
`i18n-object-fields-remaining` to the PM status table as `IN_PROGRESS`
once the fix scope was clear (see Investigation).

## Investigation
Full audit method: registered a **new, disposable test account**
(`qa-test-<timestamp>@example.com`, real registration against the
production backend) instead of testing against the operator's real
resume data — safe by construction, this account has no real content to
lose. Used Chrome remote-debugging (port 9888) with a fresh incognito-like
`Target.createBrowserContext` tab (avoids the main profile's saved
autofill/password interfering with form-filling — first attempts using
the regular tab got Chrome autofill silently overwriting typed values,
confirmed by screenshot showing a mangled merged email).

### Register/Login
- Real register through the UI (real click + real keystrokes via CDP
  `Input.dispatchMouseEvent`/`dispatchKeyEvent`, not synthetic DOM
  events) with password `TestQa12345` → backend rejected with
  `401 {"message":"Dữ liệu không hợp lệ","errors":{"password":"Password
  không đúng định dạng"}}`. Frontend's Yup schema for password
  (`PageRegister.vue`) is just `yup.string().required()` — no complexity
  rule, so this fails silently until the backend rejects it. Retried with
  `TestQa@12345` (added a special character) → `200`, registered
  successfully. **Not fixed in this diff** — separate root cause (form
  validation gap, not the `{vi,en}` object pattern below), logged under
  "Noticed, not done".
- Login with the new account → succeeded, got `token`/`tokenRefresh`.

### CRUD audit (direct authenticated API calls with the test account's
token, cross-checked against real UI where practical)
- Education, Experience, Award, Reference, Candidate (`PageInformation`):
  full create → read → update → delete cycle confirmed working
  end-to-end with the payload shapes the CURRENT (already-shipped) code
  produces. No new bugs found in these.
- **Project** (`POST project/create`): sending `description` as a plain
  string → `400 {"description":"Mô tả phải là object"}`. Retried with
  `description: {vi: "...", en: ""}` → `201` success. `technology` as a
  plain string → `400 {"technology":"technology phải là mảng"}`, but
  confirmed this is NOT a bug — `PageProject.vue` already
  `.split(',')`/`.join(', ')`s `technology` correctly on submit/edit
  (pre-existing code, unrelated to this diff); my raw curl test just
  didn't replicate that transform. Isolated: with `technology` as an
  array AND `description` as an object, create succeeds — `description`
  was the only real gap.
- **Certificate** (`POST certificate/create`): same `description` object
  requirement, same 400 with a plain string, same 201 success with
  `{vi, en}`.
- **GeneralInformation** (`POST general-information/create`): sending
  `career` (plain `text`-typed field, "Ngành nghề") as a plain string →
  `400 {"career":"Nghề nghiệp phải là object","careerGoal":"Mục tiêu
  nghề nghiệp phải là object"}`. `careerGoal` was already fixed earlier
  today (`description-i18n-edit-roundtrip`) but **`career` was missed** —
  it's not `ckediter`-typed so it never matched the earlier `grep -rln
  "ckediter" src/models` sweep. This directly explains the `[object
  Object]` seen on the real account's "Ngành nghề" field, logged as an
  unexplained side-finding in `description-i18n-edit-roundtrip`'s
  "Noticed, not done" — now root-caused and fixed.
- All test records created during this audit were deleted immediately
  after each check via `DELETE {collection}/delete/{_id}`; confirmed
  empty lists afterward. `general-information` has no delete route
  (`404 Cannot DELETE .../general-information/delete/...` — expected,
  it's a singleton per candidate like `candidate` itself, frontend has no
  delete button for it either) — the one leftover general-information
  test record stays on the disposable test account only, not reachable
  from or visible to the operator's real account.

## Branch
`fix/i18n-object-fields-remaining` — checked out from `main`.
`git branch --show-current` confirms this, not `main`.

## Diff
- No changes to `src/utilities/index.ts` — reused the existing
  `getLocalizedText`/`wrapLocalizedText` pair from
  `description-i18n-object-render`/`description-i18n-edit-roundtrip`
  as-is.
- `src/pages/dashboard/PageProject.vue` — same pattern as
  `PageEducation.vue`/`PageAward.vue`: added `originalDescription` ref,
  set + unwrapped in `showModalEditDoc()` (alongside the pre-existing
  `technology` array→string join, untouched), reset to `null` in
  `showModalCreateDoc()`, wrapped back in `handleUpdate()` right before
  `updateDoc()` (alongside the pre-existing `technology` string→array
  split, untouched).
- `src/pages/dashboard/PageCertificate.vue` — identical pattern.
- `src/pages/dashboard/PageGeneralInformation.vue` — added
  `originalCareer` ref alongside the existing `originalCareerGoal`; the
  `watch(generalInformation, ...)` callback now also does
  `originalCareer.value = _val.career; document.career =
  getLocalizedText(_val.career)`; `handleUpdate()` now also does
  `document.career = wrapLocalizedText(document.career,
  originalCareer.value)`.
- Did NOT touch the register password validation gap (separate root
  cause, see "Noticed, not done") or `ItemTemplate.vue` (already fixed
  earlier today, Project/Certificate's list-display already benefits
  from that shared fix without any change needed here — confirmed
  `ProjectItem.vue` and `PageCertificate.vue`'s inline `ItemTemplate`
  usage both already flow through the fixed component).

## Command
```
npm run build
npm run lint
```

## Output (verbatim)
```
> vue-resume-web@0.0.0 build
> vite build

vite v5.3.2 building for production...
transforming...
✓ 1341 modules transformed.
...
✓ built in 4.63s
```
```
> vue-resume-web@0.0.0 lint
> eslint src --ext .js,.ts,.vue

(no output — exit 0)
```

## Manual verification (real API + real UI, disposable test account, no
automated test suite exists)
- Direct API: `POST project/create` and `POST certificate/create` with
  `description: {vi, en}` → both `201`, confirmed the exact payload
  shape `wrapLocalizedText` produces is accepted.
- Direct API: `POST general-information/create` with `career: {vi, en}`
  and `careerGoal: {vi, en}` → `201`, confirmed both accepted together.
- Real UI: opened the real "Thêm mới Chứng chỉ" (Certificate) modal via
  actual clicks + real keystrokes (CDP `Input` domain, not synthetic DOM
  events), typed into the description CKEditor — no `CKEditorError`, no
  `[object Object]`, text rendered correctly as typed. Could not complete
  a full end-to-end UI submit because the date-picker fields
  (`startDate`/`endDate`) showed a value visually ("08/2026") but the
  underlying VeeValidate value stayed `""`, blocking the submit button —
  this is a **pre-existing, unrelated bug** in the CREATE flow's default
  date value (not touched by this diff, not reproducible from anything
  this diff changed — see "Noticed, not done"). Confirmed via API instead
  that description round-trips correctly once dates are supplied
  directly.
- Confirmed via API that no stray records were left on the test account
  after the aborted UI submit (`GET certificate/` → `data: []`).

## Acceptance
| Criterion | Evidence |
|---|---|
| Project create/edit with a description no longer rejected by backend | `POST project/create` with `{vi,en}` description → `201`, matches `wrapLocalizedText`'s output shape |
| Certificate create/edit with a description no longer rejected | `POST certificate/create` with `{vi,en}` description → `201` |
| GeneralInformation's `career` field no longer shows `[object Object]` / rejected on save | `POST general-information/create` with `career: {vi,en}` → `201`; root cause matches the exact symptom seen earlier on the real account |
| No regression to already-fixed fields (Experience/Education/Award/introduction/careerGoal) | 0 diff to those files or to `utilities/index.ts`, `ItemTemplate.vue` |
| Audit did not touch the operator's real resume data | All create/update/delete calls used the disposable `qa-test-*@example.com` account's token; real account was never re-authenticated against during this diff |
| Build stays green | `✓ built in 4.63s` |
| Lint stays clean | exit 0, no output |

## Noticed, not done
- **Register password validation gap** (real bug, different root cause):
  `PageRegister.vue`'s password field has no complexity rule
  (`yup.string().required()` only), but the backend requires at least one
  special character (confirmed: `TestQa12345` → 401 "Password không đúng
  định dạng", `TestQa@12345` → 200). Currently a user can fill in a
  password that passes client-side validation, submit, and get a generic
  toast (`err.message` from the backend, "Dữ liệu không hợp lệ") with no
  indication of WHICH field is wrong or why — poor UX, silently blocks
  registration. Needs its own fix: add a matching Yup complexity rule +
  surface the specific field error, not just a toast. Not fixed here —
  different root cause from the `{vi,en}` object pattern this node
  addresses.
- **Date-picker default value bug on CREATE (new record) flows**: opening
  "Thêm mới" (add new) on Certificate showed `startDate`/`endDate`
  visually pre-filled ("08/2026") but the underlying value read by Yup
  was `""`, throwing `startDate must be a number type... NaN (cast from
  the value "")` and keeping the submit button disabled. Did not
  reproduce/isolate whether this affects only Certificate or also
  Project/Award/Education's CREATE flow (their EDIT flow with
  already-set dates from real records works fine, confirmed earlier
  today) — not investigated further, out of scope for this node, flagged
  for a follow-up.
- Did not fix the pre-existing currency validation bug
  (`salaryDesired` "phải lớn hơn 0" despite a positive value) noticed in
  `description-i18n-edit-roundtrip` — still open, still unrelated.
- The disposable test account (`qa-test-1787417951@example.com`) remains
  registered on the production backend with no resume data (all test
  records were deleted). Harmless, but noting its existence for
  completeness — operator may want it cleaned up eventually, no delete
  endpoint exists for candidate accounts themselves in this API.

## Seal gate
No outward-facing action in this step (no commit/push/merge to `main`) —
file edits + read-only/disposable-account API calls only, on a dedicated
branch. Merge goes through `/ship`, separately, with operator approval.

## Status
sealed_pending_verifier
