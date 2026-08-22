---
node: description-i18n-edit-roundtrip
worker: verifier
date: 2026-08-22
verdict: SEAL
---

## Input
`agent-hub/evidence/implementer/2026-08-22-description-i18n-edit-roundtrip.md`

## Process
Read the note only (did not open the diff as a review pass). Then
independently confirmed each citable claim against real files/commands,
per `verify_seal.md` + operator instruction.

## Checks performed

1. **Branch** — `git branch --show-current` → `fix/description-i18n-object-render`,
   matches the note, not `main`. `NoMainEdit` satisfied.

2. **`wrapLocalizedText` preserves original `en` in all 5 files** —
   grepped `src/utilities/index.ts:71-74`:
   ```
   export const wrapLocalizedText = (newText, original) => {
       const en = original && typeof original === 'object' ? original.en || '' : ''
       return { vi: newText || '', en }
   }
   ```
   Confirmed each of the 5 page files sets an `originalX` ref from the raw
   (pre-`getLocalizedText`) value at edit-open time, and calls
   `wrapLocalizedText(val, originalX.value)` right before `updateDoc()`:
   - `PageExperience.vue:71-72,49` — `originalDescription.value = doc.description`
     / `wrapLocalizedText(val.description, originalDescription.value)`
   - `PageEducation.vue:75-76,54` — identical pattern
   - `PageAward.vue:63-64,48` — identical pattern
   - `PageInformation.vue:74-75,100` — `originalIntroduction.value =
     _candidate.introduction`, unwrap set AFTER the generic
     `document[k]=_candidate[k]` loop (correct order, no overwrite bug)
   - `PageGeneralInformation.vue:57-58,76` — `originalCareerGoal.value =
     _val.careerGoal` inside the `watch(generalInformation, ...)`
     callback, same ordering, correct
   All 5 confirmed.

3. **Write-back shape matches operator's confirmed choice** (preserve
   `{ vi, en }`, not revert to string) — `wrapLocalizedText` always
   returns an object `{ vi, en }`, never a bare string. Matches note's
   claim exactly.

4. **No regression to the sealed display-only fix** —
   `ItemTemplate.vue:10,44` still imports and uses `getLocalizedText`
   unchanged; not touched by this diff (confirmed by reading the file,
   not just the note's claim).

5. **Build reproduced independently** — ran `npm run build` myself:
   `✓ built in 4.65s`, matches note's `✓ built in 4.36s` claim (timing
   differs, trivially, output shape identical, no errors).

6. **Lint reproduced independently** — ran `npm run lint` myself: exit 0,
   no output. Matches note's claim.

7. **Visual evidence cross-checked** — the note's screenshots exist in
   the shared scratchpad
   (`.../scratchpad/edit-modal.png`,
   `edit-modal-fixed2.png`, `info-fixed.png`, `geninfo-fixed.png`, etc.):
   - `edit-modal.png` (before): shows the exact crash described — empty
     CKEditor + raw dumped Yup error `description must be a \`string\`
     type, but the final value was: \`{ "vi": ...`.
   - `edit-modal-fixed2.png` (after): full real bullet-list content
     rendered in the CKEditor, "Cập nhật" button green/enabled. Matches
     "Experience Sửa no longer crashes" claim.
   - `info-fixed.png`: "Giới thiệu bản thân" shows the real bio paragraph
     — matches the "previously-hidden bio now visible" claim.
   - `geninfo-fixed.png`: "Mục tiêu công việc" editor loads cleanly
     (empty, no crash) — matches claim. Same screenshot ALSO
     independently corroborates the note's "Noticed, not done" section:
     "Ngành nghề" literally shows `[object Object]` and "Mức lương mong
     muốn phải lớn hơn 0" fires despite a populated value — both
     precisely as disclosed, unfixed, out of scope. This cross-confirms
     the note is not overclaiming/hiding anything.

8. **Forbidden states scan** — `ADHOC_WORK` no (node exists on diagram,
   was IN_PROGRESS), `NO_EVIDENCE` no (note present), `EDIT_UNVERIFIED`
   no (build/lint independently reproduced), `CODE_IN_HAVEN` no (only
   `.md` under `agent-hub/`), `DIAGRAM_DRIFT` no (node already reflects
   this diff), `MAIN_EDIT` no (see #1).

9. **Proportionality** — diff stayed exactly in scope: 5 page files + 1
   utility function. The 2 unrelated bugs found (`career` field
   `[object Object]`, `salaryDesired` validation) were explicitly NOT
   touched, confirmed visually in `geninfo-fixed.png`. `SmallestDiff`
   satisfied.

10. **Seal gate** — no outward-facing action in this step; `git status`
    confirms all changes are uncommitted working-tree edits on the
    dedicated branch. Correctly deferred to `/ship`.

## Verdict
**SEAL** — every acceptance criterion has citable, independently
reproduced evidence (code, build, lint, screenshots). No forbidden state
hit.

## PM status update
`description-i18n-edit-roundtrip`: `IN_PROGRESS` → `SEALED` in
`agent-hub/haven/diagrams/dev-loop.prime-mermaid.md`.
