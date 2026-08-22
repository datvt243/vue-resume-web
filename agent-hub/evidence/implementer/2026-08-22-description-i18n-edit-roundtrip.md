---
node: description-i18n-edit-roundtrip
worker: implementer
date: 2026-08-22
---

## Task
Follow-up requested by operator in the same session as
`description-i18n-object-render`: "kiểm tra tiếp phần Sửa" (check the Edit
form too), after that node's "Noticed, not done" flagged the edit-form
round-trip risk without fixing it.

No existing node covered this (the prior node was already SEALED,
display-only) — appended `description-i18n-edit-roundtrip` to the PM
status table as `IN_PROGRESS`.

## Investigation
Opened the real Experience "Sửa" (edit) modal for a record with an
object-shaped `description` via Chrome remote-debugging (port 9888) + CDP,
capturing `Runtime.consoleAPICalled`/`Runtime.exceptionThrown` — did NOT
click "Cập nhật"/submit, this was read-only observation:
- Vue prop-type warning: `Invalid prop: type check failed for prop
  "modelValue". Expected String ... got Object` (CKEditor's `model` prop).
- `CKEditorError: datacontroller-set-non-existent-root` — the CKEditor
  instance genuinely fails to initialize its data from a non-string value.
- `TypeError: val.trim is not a function` thrown repeatedly from
  `yup`'s `StringSchema._cast` — the `description: yup.string()...trim()`
  validator crashes when the live value is an object.
- Screenshot confirmed the visible result: the "Mô tả" editor renders
  empty (placeholder only, real content lost from view) and the raw Yup
  error string is dumped directly onto the page below the editor.
- The submit button (`:disabled="!meta.valid"` in `VeeForm.vue`) stayed
  disabled throughout — confirmed no accidental corrupted save was
  possible through the UI as-is, but editing was fully blocked for any
  affected record.
- The same console trace incidentally also showed the identical crash for
  the `introduction` field on `PageInformation.vue` (`Giới thiệu bản
  thân`) — traced this to `information.model.ts:67`
  (`defaultDescription({ name: 'introduction', ... })`, same `ckediter`
  factory). Confirmed by navigating to `#/dashboard/information` directly:
  the bio text field rendered completely EMPTY even though the account
  has real bio content (confirmed after the fix — see Manual UI check).
- Grepped `src/models` for every `ckediter`-typed field (see
  `description-i18n-object-render`'s evidence note) → 2 more affected
  beyond the 3 already fixed: `introduction` (`information.model.ts`) and
  `careerGoal` (`generalInformation.model.ts`).
- Asked operator (AskUserQuestion, 2 questions): (1) fix scope — all 5
  fields vs. only the original 3 → operator chose all 5. (2) write-back
  shape on save — preserve `{ vi, en }` object (update `vi`, keep
  original `en`) vs. revert to plain string → operator chose preserve
  the object, since that matches what the backend's GET response
  currently shows it expects (did not attempt a real test PUT to confirm
  the backend's actual write contract — that would mutate real
  production resume data without a clear plan, out of scope for this
  investigation).

## Branch
Same branch as the parent node: `fix/description-i18n-object-render`
(from `main`). `git branch --show-current` confirms this, not `main`.

## Diff
- `src/utilities/index.ts` — added `wrapLocalizedText(newText, original)`:
  inverse of `getLocalizedText()`. Returns `{ vi: newText, en: <original.en
  if original was an object, else ''> }`. Pure function, no side effects.
- 5 page files, same pattern applied to each (unwrap for editing → keep
  original raw value in a local `ref` → re-wrap right before the API
  call):
  - `src/pages/dashboard/PageExperience.vue` — `showModalEditDoc()` now
    also does `originalDescription.value = doc.description;
    document.description = getLocalizedText(doc.description)`.
    `showModalCreateDoc()` resets `originalDescription.value = null`.
    `handleUpdate()` now does `val.description =
    wrapLocalizedText(val.description, originalDescription.value)` before
    `updateDoc()`.
  - `src/pages/dashboard/PageEducation.vue` — identical pattern, same
    field name `description`.
  - `src/pages/dashboard/PageAward.vue` — identical pattern, same field
    name `description`.
  - `src/pages/dashboard/PageInformation.vue` — different shape (no
    modal, loads once in `onMounted` from `candidate.getCandidate`):
    added `originalIntroduction` ref, set alongside the existing
    `document[k] = _candidate[k]` loop, unwraps `document.introduction`
    right after. `handleUpdate()`'s data-building step now also does
    `val.introduction = wrapLocalizedText(val.introduction,
    originalIntroduction.value)`.
  - `src/pages/dashboard/PageGeneralInformation.vue` — different shape
    again (`watch(generalInformation, ...)` populates `document`): added
    `originalCareerGoal` ref, set inside the watch callback alongside the
    existing `document[key] = value` loop, unwraps
    `document.careerGoal`. `handleUpdate()` (which has a local variable
    also named `document`, pre-existing shadowing, not touched) now does
    `document.careerGoal = wrapLocalizedText(document.careerGoal,
    originalCareerGoal.value)` before `updateDoc()`.
- Did NOT touch `VeeForm.vue`, `FrmCkediter.vue`, `CKEditor.vue`, the yup
  schemas in any `*.model.ts` file, or the display-side fix from the
  parent node (`ItemTemplate.vue`) — this diff is entirely in the 5 page
  components + the 1 new utility function.

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
rendering chunks...
computing gzip size...
...
(!) Some chunks are larger than 500 kB after minification. — pre-existing
warning, unrelated to this diff.
✓ built in 4.36s
```
```
> vue-resume-web@0.0.0 lint
> eslint src --ext .js,.ts,.vue

(no output — exit 0)
```
Build-only + lint-only evidence, no automated test suite exists.

## Manual UI check (npm run dev, Chrome remote-debugging port 9888 + CDP)
Did a hard `Page.reload({ ignoreCache: true })` before each check to rule
out stale Vite HMR module state from earlier in the same long-lived dev
session (first attempt without reload still showed the pre-fix errors —
confirmed this was stale state, not the fix failing, by reloading and
re-testing).

- `#/dashboard/experience`, opened "Sửa" on "Laidon Group": CKEditor now
  renders the full real bullet-point content (same HTML seen in the raw
  API response), no `CKEditorError`, no Yup `TypeError`, no console
  errors at all, "Cập nhật" button enabled (green, not disabled).
  Screenshot confirms.
- `#/dashboard/information`: the "Giới thiệu bản thân" field now shows
  the real bio text ("I am a Frontend Developer with over 5 years of
  experience...") — this field was rendering completely EMPTY before this
  fix (confirmed in this same session's earlier screenshots), silently
  hiding real profile data. No console errors.
- `#/dashboard/education`, opened "Sửa" on "Cao Đẳng Kỹ Thuật Cao Thắng":
  editor loads cleanly (this record's `description.vi` is empty, matches
  what the parent node's display fix already showed), "Cập nhật" enabled,
  no errors.
- `#/dashboard/general-information`: the "Mục tiêu công việc"
  (`careerGoal`) CKEditor loads cleanly with no `CKEditorError` (field is
  empty on this account, no content to lose). Did NOT click "Cập nhật" —
  not touching a real write without a clearer need.
- `#/dashboard/award`: still 0 records on this account — could not
  visually confirm with real data, same as the parent node. Code is
  identical pattern to Experience/Education, no Award-specific divergence.

## Acceptance
| Criterion | Evidence |
|---|---|
| Experience "Sửa" no longer crashes, shows real content | Screenshot + empty console-error capture after hard reload |
| Information's "Giới thiệu bản thân" shows real (previously hidden) bio text | Screenshot — full bio paragraph visible |
| Education "Sửa" works cleanly | Screenshot, "Cập nhật" enabled, no console errors |
| GeneralInformation's careerGoal editor loads without crashing | No `CKEditorError` in console capture |
| Award covered by the same fix | Code-identical pattern to Experience/Education, confirmed by reading `PageAward.vue` diff |
| Save button gate (`meta.valid`) still functions, no accidental corrupted writes | Confirmed both before AND after the fix — button was disabled pre-fix (blocking edits), enabled post-fix once the value validates as a proper string |
| Build stays green | `✓ built in 4.36s` |
| Lint stays clean | exit 0, no output |
| Scope matches operator's 2 confirmed answers (all 5 fields, object write-back) | 5 files touched, `wrapLocalizedText` always returns `{ vi, en }` |

## Noticed, not done
- **Did not perform a real test save (PUT) to confirm the backend
  actually accepts the `{ vi, en }` write shape.** The operator's chosen
  strategy (preserve object shape) is the safer INFERENCE based on what
  GET currently returns, not an empirically-confirmed write contract. A
  real save against production data was avoided to not risk an
  unconfirmed guess mutating the operator's real resume. If the operator
  saves an item through the UI and it fails or behaves unexpectedly, that
  needs its own follow-up — this note does not close that loop.
- **Found 2 unrelated pre-existing bugs on `#/dashboard/general-information`**
  while checking `careerGoal` (out of scope, not touched):
  - "Ngành nghề" (`career` field, plain `text` type, NOT rich-text)
    displays literally `[object Object]` in the input box, and its Yup
    validation (`yup.string()...trim()...required()`) throws the same
    `TypeError: val.trim is not a function` — this is a DIFFERENT root
    cause from the `{ vi, en }` description pattern (this field was never
    `ckediter`-typed), likely the backend returns an object for `career`
    too, or a different data-shape issue entirely. Not investigated
    further.
  - "Mức lương mong muốn" (`salaryDesired`, currency field) shows a
    validation error "Mức lương mong muốn phải lớn hơn 0" even though the
    displayed value is "VND 25,000,000" (clearly > 0) — looks like a
    number-parsing bug in `FrmCurrency`, unrelated to this task.
- Did not add any UI language toggle or expose the `en` field anywhere —
  out of scope, the app has no i18n UI at all; `en` is preserved silently
  as a pass-through only.

## Seal gate
No outward-facing action in this step (no commit/push/merge to `main`,
no real API write) — file edits + read-only manual verification only, on
the same dedicated branch as the parent node. Merge goes through `/ship`,
separately, with operator approval.

## Status
sealed_pending_verifier
