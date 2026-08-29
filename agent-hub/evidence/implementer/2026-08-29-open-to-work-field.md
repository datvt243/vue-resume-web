# 2026-08-29 - open-to-work-field

- Worker: implementer
- Version: 0.1.0
- Node: `open-to-work-field` (new node — no existing diagram node matched;
  task direct from operator, not a GitHub issue)
- Task (verbatim): "backend tôi vừa bổ sung field hiển thị open-to-work,
  hãy bổ sung field này lên web"

## Branch
`feature/open-to-work-field` (checked out from `main` before touching any
file).

## Backend confirmation (read-only, sibling repo added to session)
`/Users/_david/Workspace/Project/ResumeAPI/backend` — grepped for the new
field before touching frontend code:
- `src/models/generalInformation.model.ts:27` — `openToWork: { type:
  Boolean, default: false, required: false }`, on the `general-information`
  Mongoose collection (comment above it: `/* đang mở tìm việc hay không */`).
- `src/candidate_profile/general_information/generalInformation.validate.ts:23`
  — `openToWork: _boolean` in both `schemaGeneralInformationPatch` and
  `schemaGeneralInformation` (Joi).
- `src/config/swagger.config.ts:192` — `openToWork: { type: 'boolean' }`.

Field is a plain boolean on `GeneralInformation`, not required, defaults
`false`. This app has no public resume-viewer page (`src/pages/` is
entirely the CRUD dashboard — confirmed via `find src/pages -iname
"*.vue"`), so "add this field to the web" means the edit form for that
section, matching how the equivalent boolean `isCurrent` field is exposed
in `education.model.ts`.

## Diff
| file | why |
|---|---|
| `src/models/generalInformation.model.ts` | Added `defaultCheckboxBoolean({ name: 'openToWork', label: 'Đang mở tìm việc' })` as the second field (right after `_id`) — reused the existing shared factory (`src/types/model.type.ts`, already used the same way by `education.model.ts`/`certificate.model.ts`/`project.model.ts` for their own boolean fields) instead of hand-rolling a new field shape. Added the matching `import { defaultCheckboxBoolean } from '@/types/model.type'` line, same import-split style already used in the 3 sibling model files (separate `import type` for `modelItem`). |

No other file needed changes: `PageGeneralInformation.vue`'s
`watch(generalInformation, ...)` already does `document[key] = value` for
every key returned by the backend (generic loop, not a hardcoded field
list), and `handleUpdate()` spreads `...values` from the VeeForm submit
straight into the PUT payload — both already pick up any field present in
`formFields`/the model array with zero extra wiring, same as how
`isCurrent` needed no page-level change in `PageEducation.vue`.

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
✓ 1342 modules transformed.
rendering chunks...
computing gzip size...
...
dist/assets/PageGeneralInformation-CFdtkX7y.js    11.65 kB │ gzip:   4.37 kB
...
✓ built in 4.93s
```
Same pre-existing chunk-size warning only (`VeeForm-*.js` > 500kB, present
before this change too).

## Acceptance
| Criterion | Evidence |
|---|---|
| `npm run build` green | `✓ built in 4.93s`, no errors |
| Field name/type matches backend exactly | Backend grep above: `openToWork`, boolean, on `generalInformation` — frontend field `name: 'openToWork'`, `type: 'checkbox'`/`valid: yup => yup.boolean()` via `defaultCheckboxBoolean()` |
| Field renders in the real running app | Live CDP check (below): label "Đang mở tìm việc" + a `checkbox` input found on `/dashboard/general-information` after the change |
| No other file needed edits (generic read/write path already covers new fields) | Read `PageGeneralInformation.vue` directly — `watch()` loop and `handleUpdate()` are both field-name-agnostic |

## Manual verification
No screenshot tool loaded this session — same real-CDP technique used in
the prior task today (`loading-countdown-redesign`): connected to the
already-open debug Chrome (port 9888) via `node_modules/ws`, navigated the
existing dev-server tab to `#/dashboard/general-information` (Vite HMR
already picked up the model change since `npm run dev` was already
running), waited 1.2s, then queried the DOM:

```json
{
  "hasField": true,
  "matchingLabels": ["Đang mở tìm việc"],
  "checkboxFound": true
}
```

Read-only navigation only (no form submit, no data mutated) on the
operator's real authenticated dev session.

## Noticed, not done
- No component test exists for `PageGeneralInformation.vue` or
  `generalInformation.model.ts` (issue #7, components still untested in
  general) — not fixed here, out of scope for a single-field addition.
- The checkbox's default value comes from `defaultCheckboxBoolean()`
  (`default: false`) for a brand-new record; existing records without this
  field will simply not have `openToWork` in the fetched object until the
  user saves once — consistent with how every other new field on an
  existing collection behaves in this app (no migration script exists),
  not specific to this change.

## Seal gate
None — no commit/push/merge/deploy happened in this pass. Only local file
edit + local build + local read-only navigation check.
