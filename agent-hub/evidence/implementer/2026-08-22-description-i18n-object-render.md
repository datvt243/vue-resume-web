---
node: description-i18n-object-render
worker: implementer
date: 2026-08-22
---

## Task
Bug reported by operator while looking at the Experience section: "mục
exp, các item đang hiển thị [object] [object]" (Experience items show
`[object Object]`).

No existing diagram node matched — appended `description-i18n-object-render`
to the PM status table as `IN_PROGRESS` (per `pick_next.md` step 3).

## Investigation
- `src/components/global/ItemTemplate.vue:62` renders
  `div.item-description.post-content(v-if="model.description" v-html="model.description")`.
  `v-html` sets `innerHTML` — if `model.description` is a plain object,
  the browser coerces it to `"[object Object]"` via its default
  `toString()`.
- Confirmed the real data shape by calling the production API directly
  from the authenticated browser tab (Chrome remote-debugging port 9888,
  CDP `Runtime.evaluate` with a `fetch()` using the real session token):
  `GET https://nodejs-resume-api-ts.onrender.com/api/v1/experience/` →
  every record's `description` field is `{ "vi": "<ul>...</ul>", "en": "" }`
  — an object, not a string. The `experience.model.ts` field is typed
  `yup.string()` and CKEditor expects a `String` model — this is a
  backend contract change the frontend model doesn't account for.
- Grepped for every place that could hit the same bug:
  `grep -rln "ckediter" src/models` → `generalInformation.model.ts`,
  `award.model.ts`, `experience.model.ts`. `education.model.ts` uses the
  shared `defaultDescription()` factory in `src/types/model.type.ts`,
  which is also `type: 'ckediter'`. All 4 collections share the same
  description contract.
- Of those, only Experience, Education, and Award render their
  description through `ItemTemplate.vue`'s `v-html` (confirmed:
  `ExperienceItem.vue`, `EducationItem.vue` both build
  `item.description = model.value.description` and pass to
  `ItemTemplate`; `PageAward.vue` inlines `<ItemTemplate>` directly with
  `description: item.description`). `generalInformation` is a
  single-record edit form, not a list rendered through `ItemTemplate` —
  not affected by this specific display bug.
- Asked the operator (AskUserQuestion) whether to fix only Experience
  (literal scope of the report) or all 3 affected collections at once,
  since it's one root cause. Operator chose: fix all 3.

## Branch
`fix/description-i18n-object-render` — checked out from `main`. Before
starting, stashed the in-progress `dashboard-sidebar-layout` diff
(`git stash push -u -m "wip: dashboard-sidebar-layout
(feature/default-layout-redesign)"`, still on `feature/default-layout-redesign`
at the time) since that work is a separate, already-sealed-pending-`/ship`
node with a different scope (layout structure, not this data bug).
`git branch --show-current` confirms `fix/description-i18n-object-render`,
not `main`.

## Diff
- `src/utilities/index.ts` — added `getLocalizedText(value, lang = 'vi')`:
  returns the string as-is if already a string, or `value[lang] ||
  value.vi || value.en || ''` if given a `{ vi, en }`-shaped object, `''`
  for null/undefined. Pure function, no side effects, matches the
  existing `formatDate`/`formatDateToInput` style in this file.
- `src/components/global/ItemTemplate.vue` — the ONLY file changed
  besides the utility: imported `getLocalizedText`, added a `description`
  computed (`getLocalizedText(props.modelValue.description)`), changed
  the template to `v-if="description" v-html="description"` (was
  `model.description` both places). Widened the `Props.description` TS
  type to `string | { vi?: string; en?: string }` to match reality.
  Fixing at this single shared choke point covers Experience, Education,
  and Award without touching `ExperienceItem.vue`, `EducationItem.vue`,
  or `PageAward.vue` — none of them needed changes.
- Did NOT touch the edit/submit path (CKEditor initial value population
  when opening "Sửa", or what gets PUT back to the backend on save) — see
  "Noticed, not done" below. This diff is display-only.

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
✓ built in 4.52s
```
```
> vue-resume-web@0.0.0 lint
> eslint src --ext .js,.ts,.vue

(no output — exit 0)
```
Build-only + lint-only evidence, no automated test suite exists (see
`doctrine/MEMORY.md`).

## Manual UI check (npm run dev, Chrome remote-debugging port 9888 + CDP)
Used the already-authenticated tab (real login session, token from
`.env.development.local` pointed at production backend), same dev server
still running at port 5174 (file watcher picks up the branch's current
working-tree state since it's the same directory).

- `#/dashboard/experience`: screenshot shows the "Laidon Group" and
  "JOBTEST" items rendering full bullet-point HTML descriptions (`Develop
  enterprise web applications using SAPUI5...`) instead of
  `[object Object]`.
- `#/dashboard/education`: screenshot shows the education item
  ("Cao Đẳng Kỹ Thuật Cao Thắng") with no `[object Object]` text below the
  date range — this record's `description.vi` is apparently empty, so
  `getLocalizedText` correctly returns `''` and `v-if="description"`
  hides the block entirely (no crash, no garbage text; this is correct
  behavior for an empty description, not a new regression).
- `#/dashboard/award`: 0 award records for this account right now
  ("Không có data để hiển thị") — could not visually confirm with real
  data. Confirmed via code instead: `PageAward.vue` uses the exact same
  `<ItemTemplate>` component and prop shape as Experience/Education, so
  the fix applies identically; no Award-specific code path exists to
  diverge.

## Acceptance
| Criterion | Evidence |
|---|---|
| Experience items show real description text, not `[object Object]` | Screenshot at `#/dashboard/experience` — full bullet list rendered |
| Education items don't show `[object Object]` | Screenshot at `#/dashboard/education` — no `[object Object]`, empty description hidden cleanly |
| Award covered by the same fix | Code-confirmed: `PageAward.vue` uses the same `ItemTemplate` component/prop, no separate render path |
| Fix scope matches operator's confirmed answer (all 3) | Single choke-point fix in `ItemTemplate.vue` inherently covers all 3, no per-collection file touched |
| GeneralInformation not touched (not affected by this display bug) | 0 diff in `PageGeneralInformation.vue`/`VeeFormGeneralInformationUpdate.vue` |
| Build stays green | `✓ built in 4.52s` |
| Lint stays clean | exit 0, no output |

## Noticed, not done
- **Edit-form / round-trip risk (not fixed, needs a separate decision):**
  when opening "Sửa" on an item whose `description` is the `{ vi, en }`
  object, `showModalEditDoc()` in each Page component does
  `document[f] = doc[f]` — this puts the raw object into VeeForm's
  managed `document`, which feeds `FrmCkediter`'s `value` prop (typed
  `[String, Number, Date]`) and then CKEditor's `model` (typed `String`).
  Did not test what CKEditor actually does with an object value (render
  blank? throw? silently stringify?) — did not want to open an edit
  modal against real production data to find out without a plan for the
  write side. Separately: if a user saves an item WITHOUT touching the
  description field, whatever CKEditor currently holds gets sent back to
  the backend on PUT — if that write should preserve the `{ vi, en }`
  shape (i.e., backend now requires the object, not a bare string), this
  needs its own explicit fix (extract for editing, re-wrap into
  `{ vi: <edited>, en: <original en, preserved> }` on submit) rather than
  guessing at the backend's write contract. Left untouched pending an
  operator decision — flagging so it doesn't get silently lost.
- Did not check `PageGeneralInformation.vue`'s description field (also
  `ckediter`-typed) for the same read/write concern — it's a single-record
  edit form, not rendered through `ItemTemplate`, so the specific
  `[object Object]` display bug does not apply there, but the same
  edit-form risk noted above may still apply. Out of scope for this note.

## Seal gate
No outward-facing action in this step (no commit/push/merge to `main`) —
file edits only, on a dedicated branch. Merge goes through `/ship`,
separately, with operator approval.

## Status
sealed_pending_verifier
