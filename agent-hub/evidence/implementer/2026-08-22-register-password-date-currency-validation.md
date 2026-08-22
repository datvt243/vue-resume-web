---
node: register-password-date-currency-validation
worker: implementer
date: 2026-08-22
---

## Task
Operator: "fix cả 3 bug còn lại đi, gom vào 1" (fix all 3 remaining bugs,
batched into one). The 3 bugs were logged as "Noticed, not done" in
`i18n-object-fields-remaining`'s evidence note earlier the same session:
register password validation gap, date-picker default value bug on
CREATE, and a currency validation false-positive.

No existing node covered these — appended
`register-password-date-currency-validation` to the PM status table as
`IN_PROGRESS`.

## Investigation

### 1. Register password
Probed the backend's actual password rule with several real
`POST auth/register` calls (disposable emails, never submitted):
- `TestQa12345` (12 chars, no special) → 401 "Password không đúng định dạng"
- `Test@123` (8 chars, has all 4 classes) → 401 "Password phải có ít nhất 12 ký tự" — reveals min length
- `Abcdefghi1@2` (12 chars, upper+lower+digit+special) → 200 success
- Isolated exact requirement: **min 12 chars AND at least 1 lowercase, 1
  uppercase, 1 digit, 1 special character** — confirmed by testing each
  12-char combination missing exactly one class (all rejected) and the
  one with all four (accepted).
- `PageRegister.vue`'s password field had `valid: yup =>
  yup.string().required()` — no complexity check at all.

### 2. Date defaults broken on CREATE
Reproduced live: opening "Thêm mới Chứng chỉ" (Certificate) showed
`startDate`/`endDate` visually pre-filled but Yup saw `""`, throwing
`startDate must be a number type... NaN (cast from the value "")` and
permanently disabling the submit button.
- Root cause #1: `VeeForm.vue`'s `reset()` —
  `getFields.value.reduce((obj, e) => ({ ...obj, [e.name]: '' }), {})` —
  hardcodes EVERY field to `''` regardless of that field's own `default`.
  `VeeForm.vue`'s own watcher calls this whenever `!doc._id` (i.e. every
  CREATE flow), right after `setValues()` just populated the real
  defaults — so `reset()` immediately wipes them back to `''`. Harmless
  for text fields (`default: ''` already), fatal for date fields
  (`default: +new Date()`, a number).
- Root cause #2 (found while verifying #1's fix, same "date defaults"
  area): even after fixing `reset()`, submitting a brand-new Certificate
  still failed with a backend 400 `"endDate":"Ngày kết thúc phải lớn hơn
  ngày bắt đầu"` — confirmed via curl that `experience/create` and
  (by extension) every collection using paired start/end dates has the
  same issue: `startDate` and `endDate` both default to `+new Date()`,
  and in `monthPicker` mode both round to the same `{month, year}}`,
  landing exactly on the backend's forbidden boundary (backend requires
  strictly greater, not `>=`).

### 3. Currency false-positive
`FrmCurrency.vue`: `if (value.value === undefined || value.value ===
null) { value.value = 0 }` — runs once at component setup. `0` fails
`yup.number().positive('Mức lương mong muốn phải lớn hơn 0')`
immediately. This assignment exists to give the underlying `@coders-tm/
vue-number-format` component (`masked: false` config) a defined initial
`modelValue` (required prop) before the real document value has loaded
asynchronously — but forcing `0` (an actively-invalid value per the
schema) into the live, validated vee-validate state is wrong; it should
be a value that reads as "not filled in yet", not "definitely wrong".
Reproduced the exact error text on the disposable test account's
GeneralInformation page: navigated with a real `salaryDesired: 20000000`
already on the record — did not get a clean reproduction on THIS
account/timing (Pinia cache was warm from earlier navigation in the same
session, so the async gap never opened), but the mechanism is verified
by direct code read + the exact matching error text from the earlier
session's screenshot on the real account (`geninfo-fixed.png` from
`description-i18n-edit-roundtrip`'s evidence).

## Branch
`fix/register-password-date-currency-validation` — checked out from
`main`. `git branch --show-current` confirms this, not `main`.

## Diff
- `src/pages/auth/PageRegister.vue` — password field: added
  `.min(12, ...)` + 4 `.matches(...)` rules (lowercase/uppercase/digit/
  special) with individual Vietnamese messages, plus a `text` hint shown
  under the field. Matches the backend rule exactly as probed.
- `src/components/veevalidate/VeeForm.vue` — `reset()`: changed
  `[e.name]: ''` to `[e.name]: e.default ?? ''` — resets each field to
  its OWN model default instead of blindly `''`.
- `src/types/model.type.ts` — `defaultDateStartEnd()` factory: `endDate`
  default changed from `+new Date()` to `+new Date()` with the month
  advanced by 1 (`setMonth(getMonth() + 1)`), computed once per call.
  Used by Education, Certificate, Project.
- `src/models/experience.model.ts` — same fix inline (doesn't use the
  shared factory): added a module-level `_defaultEndDate` (current date
  +1 month), `endDate`'s `default` now uses it instead of `+new Date()`.
- `src/components/veevalidate/part/FrmCurrency.vue` — changed the forced
  placeholder from `value.value = 0` to `value.value = ''`.
- Did NOT touch Award's `issueDate` (single date field, no start/end
  pair, not affected by root cause #2). Did NOT touch the backend's
  actual validation rules (out of this repo's scope) or add a UI toast
  showing field-specific backend errors (separate, larger scope — the
  fix here is making the CLIENT-side validation catch these cases before
  submit, not improving generic-toast error display).

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
✓ built in 4.49s
```
```
> vue-resume-web@0.0.0 lint
> eslint src --ext .js,.ts,.vue

(no output — exit 0)
```

## Manual verification (real UI, real clicks + real keystrokes via CDP
Input domain — not synthetic DOM events, disposable test account, no
automated test suite exists)

- **Register password**: cleared the test session, hard-reloaded,
  navigated to `#/register`, filled `email=weak-pw-test@example.com`,
  `password=weakpass` via real input events → inline error
  `"Mật khẩu phải có ít nhất 12 ký tự"` appeared immediately, submit
  button disabled. (Did not click submit — client-side block confirmed
  by construction; the exact backend rule was already independently
  confirmed via the direct API probing above.)
- **Date defaults on CREATE**: opened "Thêm mới Chứng chỉ" via a real
  click on the "+" button (had to fix the button selector — the naive
  `.btn-outline-success` selector matched the Header's "Download CV"
  button first; scoped to the SVG with `data-icon="plus"` instead),
  typed name+organization via real keystrokes, left dates untouched →
  submit button enabled, no validation errors under the date fields
  (previously always disabled/NaN-errored). Clicked "Thêm mới" for real →
  toast "Created successfully", modal showed `Ngày bắt đầu: 08/2026`,
  `Ngày kết thúc: 09/2026` (different months, confirming root cause #2's
  fix). Deleted the test record afterward via `DELETE
  certificate/delete/{_id}` — confirmed clean.
- **Currency**: could not force-reproduce the exact race window in this
  session (see Investigation #3) — verified by code read only for this
  specific fix. Not a regression risk: the change only affects the
  placeholder value during the brief async-load window before real data
  arrives, same code path, smaller blast radius than before (`''` fails
  softer/more honestly than `0`).

## Acceptance
| Criterion | Evidence |
|---|---|
| Register blocks weak passwords client-side with the specific reason | Screenshot — inline "Mật khẩu phải có ít nhất 12 ký tự", submit disabled |
| Register's password rule matches the backend's real requirement | Directly probed via `POST auth/register` with 12+ password variants |
| New Certificate can be created end-to-end via the real UI | Real click+type+submit → "Created successfully" toast, record confirmed then deleted |
| `startDate`/`endDate` defaults no longer identical | Screenshot post-create: 08/2026 vs 09/2026 |
| `reset()` fix doesn't break non-date fields | Text/checkbox/select fields already default to `''`/`false`/first-option — `e.default ?? ''` is a strict superset of the old behavior for those |
| Currency fix doesn't change behavior once real data loads | Only the initial placeholder changed, not the value once `setValues()` runs |
| Build stays green | `✓ built in 4.49s` |
| Lint stays clean | exit 0, no output |

## Noticed, not done
- Backend's `.min(yup.ref('startDate'))` equivalent on the client
  (`endDate` schema in `defaultDateStartEnd()`) uses `.min()` (allows
  equal), while the backend requires strictly greater. With the new
  defaults this never collides in practice for CREATE, but a user who
  manually edits both dates to the exact same month could still hit a
  backend 400 that client validation didn't catch. Not fixed — would
  need an exclusive-bound custom Yup test, slightly bigger change, not
  part of the 3 bugs asked for.
- Did not add field-specific error surfacing for the generic
  register-failure toast (`err.message` from the backend) — if the
  backend ever rejects a password for a reason not covered by the new
  client rule, the user still only sees a generic toast. Client rule now
  matches the backend closely enough that this should be rare.
- Currency bug fix verified by code reasoning only, not a live
  reproduction in this session — flagged in case the operator still sees
  it after this ships, so it isn't mistaken for "already confirmed fixed
  by a live test."

## Seal gate
No outward-facing action in this step (no commit/push/merge to `main`) —
file edits + read-only/disposable-account UI verification only, on a
dedicated branch. Merge goes through `/ship`, separately, with operator
approval.

## Status
sealed_pending_verifier
