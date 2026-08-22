---
node: register-password-date-currency-validation
worker: verifier
date: 2026-08-23
verdict: SEAL
---

## Input
`agent-hub/evidence/implementer/2026-08-22-register-password-date-currency-validation.md`

## Branch check (`NoMainEdit`)
`git branch --show-current` → `fix/register-password-date-currency-validation`,
not `main`. `git status` shows exactly the 5 claimed files modified (plus the
diagram file), matches the note's branch claim.

## Diff check — read the 5 changed files directly (`git diff main -- <file>`)
All 5 match the note's Diff section exactly, no extra/missing changes:
- `src/pages/auth/PageRegister.vue` — password `valid:` now
  `.min(12, ...)` + 4 `.matches(...)` (lowercase/uppercase/digit/special)
  + `.required()`, plus a `text:` hint. Confirmed verbatim.
- `src/components/veevalidate/VeeForm.vue` — `reset()` line is exactly
  `[e.name]: e.default ?? ''` (not a narrower/conditional form). Confirmed.
  Also confirmed the causal chain the note describes: `watch(...)` calls
  `setValues(_newDoc)` then `if (!doc._id) { reset() }` (lines 79-81) —
  reset() really does run right after setValues() on every CREATE.
- `src/types/model.type.ts` — `defaultDateStartEnd()`: `_defaultEndDate`
  computed once (`new Date()` + `setMonth(getMonth()+1)`), `endDate.default`
  now `+_defaultEndDate`. Confirmed verbatim.
- `src/models/experience.model.ts` — identical pattern applied inline
  (module-level `_defaultEndDate`). Confirmed verbatim.
- `src/components/veevalidate/part/FrmCurrency.vue` — placeholder changed
  from `value.value = 0` to `value.value = ''`. Confirmed verbatim.

## Build / lint — reproduced independently, not copy-pasted from the note
- `npm run build` → `✓ built in 4.63s`, no errors (only the pre-existing
  >500kB chunk-size warning, unrelated to this diff).
- `npm run lint` → exit 0, no output. Matches the note's claim.
  (`doctrine/MEMORY.md`'s "95 real lint errors" line is stale as of
  2026-08-20 — my own independent run today shows 0, consistent with the
  note. Doctrine staleness noted, not a blocker for this verification.)

## Password rule sanity check — found one evidentiary defect in the note
Confirmed the implemented rule (min 12 + require lower/upper/digit/special)
against the note's own cited probe examples:
- `Abcdefghi1@2` (12 chars, all 4 classes) → note claims success. Verified
  by direct count: **12 chars**, matches.
- `Test@123` (8 chars, all 4 classes) → note claims rejected specifically
  for length. Verified by count: **8 chars**, consistent with the
  "min 12" conclusion.
- `TestQa12345`, labeled by the note as "(12 chars, no special)" → **I
  independently counted this string: it is 11 characters, not 12**
  (`python3 -c "print(len('TestQa12345'))"` → `11`). This specific probe
  was used to isolate "missing the special-char class alone causes
  rejection," but since the string is actually below the 12-char minimum
  too, the rejection this probe observed could equally be explained by
  insufficient length — the note's isolation claim for this one example
  is not clean.

This is a real arithmetic error in the note's write-up. It does **not**
undermine the delivered code, though: the implemented rule is a superset
of what's proven safe by the two arithmetically-correct probes (12 chars
+ all 4 classes → success; <12 chars → rejected on length regardless of
classes) — the code cannot let through anything the backend would reject,
it can at worst be overly strict on some untested edge (e.g. a genuine
12-char password missing exactly one class that the backend might
actually accept), which is a UX inconvenience, not a correctness bug or a
validation-bypass risk. Flagging per instructions; not blocking SEAL.

## Currency fix — code inspected, note's non-reproduction disclosure confirmed honest
Read `FrmCurrency.vue` in full plus the consuming field's schema
(`generalInformation.model.ts` → `salaryDesired`: `default: ''`,
`yup.number().integer().positive().required()`). Checked the actual yup
runtime behavior (`node_modules/yup/index.js` `NumberSchema` transform,
v1.4.0): an empty-string input is explicitly transformed to `NaN` (not
`0`) before type-checking — so `value.value = ''` no longer trips
`.positive()`'s "phải lớn hơn 0" message; it instead fails the type-check
against the custom `.number('Vui lòng nhập vào số')` message. That's a
different, more honest message than before, achieving what the note
claims, though the note attributes it to `required()` rather than the
`.number()` typeError — a minor imprecision in the note, not in the code.
The fix is low-risk (`value` prop already accepts `String`, default `''`
in the model already matches) and the note's own "Manual verification"
and "Noticed, not done" sections both clearly disclose this was
code-reasoned, not live-reproduced — exactly as the task instructed me to
check. Does not block SEAL.

## Acceptance criteria — one by one
| Criterion | Verdict |
|---|---|
| Register blocks weak passwords client-side | Code confirmed (yup rules present); note's UI screenshot claim not independently re-clicked, but code + backend-probe evidence sufficient |
| Password rule matches backend's real requirement | Confirmed for the arithmetically-clean probes; one probe example (`TestQa12345`) mislabeled 12→11 chars, flagged above, does not change the delivered rule's safety |
| `reset()` fix is `e.default ?? ''`, not narrower | Confirmed verbatim in diff |
| `startDate`/`endDate` defaults no longer identical | Confirmed in both `model.type.ts` and `experience.model.ts` diffs |
| Currency fix doesn't change post-load behavior | Confirmed by reading the file — only the pre-load placeholder branch changed |
| Build green | Reproduced independently: `✓ built in 4.63s` |
| Lint clean | Reproduced independently: exit 0 |
| Branch is not `main` | Confirmed: `fix/register-password-date-currency-validation` |
| Diff proportionate to the 3 bugs (no scope creep) | Confirmed: exactly 5 files, matches the 3-bug scope, `git status` shows nothing extra |

## Forbidden states scan
`ADHOC_WORK` no (node exists on diagram) · `NO_EVIDENCE` no · `EDIT_UNVERIFIED`
no (build/lint reproduced independently; currency non-reproduction is
disclosed, not claimed) · `CODE_IN_HAVEN` no · `DIAGRAM_DRIFT` — being
resolved by this note (updating PM status to SEALED) · `MAIN_EDIT` no.

## Seal gate
No outward-facing action reviewed here (no commit/push/merge) — this
verification is read/build/lint-only. Merge to `main` still requires a
separate `/ship` approval.

## Verdict
**SEAL.** One evidentiary defect found and flagged (password probe
`TestQa12345` mislabeled as 12 chars, is actually 11) — does not
invalidate the delivered fix per the reasoning above. All 5 diffs verified
verbatim against the note's claims. Build and lint independently
reproduced green. Currency fix's disclosed non-reproduction inspected and
found sound on code-read. PM status updated to SEALED on the diagram.
