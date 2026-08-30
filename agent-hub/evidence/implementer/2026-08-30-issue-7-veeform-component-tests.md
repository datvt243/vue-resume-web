# 2026-08-30 — issue-7-veeform-component-tests

- Worker: implementer
- Version: 0.1.0
- Node: `issue-7-veeform-component-tests` (new node, `IN_PROGRESS` — no
  existing node covered VeeForm.vue; the 2 SEALED `issue-7-*` nodes only
  cover utilities/stores/composables)
- Task (verbatim): "#7" (operator, via `/todo`)

## Branch
`feature/vitest-veeform-tests` — checked out from `main`. (Also carries
2 files from the immediately prior `/todo #8` session that were mistakenly
left uncommitted directly on `main` — self-corrected by branching before
any new diff this session; see "Noticed, not done".)

## Why this node
Issue #7's own "Ưu tiên viết test" list has 4 tiers: (1) utilities, (2)
stores, (3) composables, (4) components — `VeeForm.vue` named explicitly
as the 4th/last tier. Tiers 1-3 are SEALED (`issue-7-vitest-setup`,
`issue-7-stores-composables-tests`). `VeeForm.vue` is the only named
target left, and per `doctrine/domains/PROJECT.md`'s Traps table it was
still explicitly called out as untested. `useInitTable` (not named in the
issue) and other components are out of scope for this node.

## Diff
| File | Why |
|---|---|
| `src/components/veevalidate/VeeForm.spec.ts` (new) | 11 tests covering: visible-field rendering (hidden fields skipped), submit-button disabled state, submitFn call/no-call, `reset()`'s per-field defaults (issue #4-shaped regression test), `document` prop watcher (reset-on-no-`_id` vs load-on-`_id`), `resetAfterSave`. |

No production code touched — test-only diff, matches `SmallestDiff`.

### A real environment blocker hit and worked around (not a scope change)
`VeeForm.vue` unconditionally imports every `Frm*` child via the
`@/components/veevalidate` barrel, including `FrmCkediter` ->
`CKEditor.vue` -> `@ckeditor/ckeditor5-vue`, which `require()`s the
ESM-only `lodash-es` — throws `ERR_REQUIRE_ESM` under Vitest/jsdom
regardless of whether a field of type `'ckediter'` is ever used (same
class of ESM/CJS interop problem already on record for `jsdom@27+` in
`doctrine/domains/PROJECT.md`, different package). `vi.importActual` on
the barrel doesn't help — it still re-evaluates the same chain. Fix:
`vi.mock('@/components/veevalidate', ...)` re-exporting the REAL
`FrmInput`/`FrmCheckbox`/etc. by importing each part file directly
(bypassing both the barrel and `FrmCkediter.vue`), with only
`FrmCkediter` swapped for a trivial stub — the suite only uses `'text'`
and `'checkbox'` fields, so this doesn't weaken what's actually being
tested.

## Command
```
npm run test
```
(from `doctrine/MEMORY.md` — real command, this file's code is covered by
it.)

## Output (verbatim)
```
> vue-resume-web@0.0.0 test
> vitest run

 RUN  v2.1.9 /Users/_david/Workspace/Project/ResumeAPI/frontend

 ✓ src/utilities/index.spec.ts (13 tests) 8ms
 ✓ src/stores/auth.spec.ts (9 tests) 7ms
 ✓ src/stores/candidate.spec.ts (11 tests) 7ms
 ✓ src/composables/useTheme.spec.ts (6 tests) 106ms
 ✓ src/composables/useDocument.spec.ts (9 tests) 20ms
 ✓ src/composables/useCandidate.spec.ts (8 tests) 72ms
 ✓ index.spec.ts (1 test) 2ms
 ✓ src/components/veevalidate/VeeForm.spec.ts (11 tests) 82ms

 Test Files  8 passed (8)
      Tests  68 passed (68)
   Start at  17:53:25
   Duration  1.22s (transform 460ms, setup 0ms, collect 1.20s, tests 305ms, environment 3.09s, prepare 508ms)
```
(57 tests before this session -> 68 after: +11, all new, all passing, no
regressions in the other 7 files.)

Also ran `npm run build` (repo root, exact command from
`doctrine/MEMORY.md`) since this diff touches a component file's test —
confirming the production bundle is unaffected:
```
✓ 1343 modules transformed.
...
dist/assets/VeeForm-CNnT-CVN.js                  997.61 kB │ gzip: 283.12 kB
(!) Some chunks are larger than 500 kB after minification. ...
✓ built in 4.82s
```
Same pre-existing chunk-size warning as every prior SEALED node (VeeForm's
own chunk, not caused by this diff — `.spec.ts` files are excluded from
`vite build`, picked up only by `vitest`).

## Acceptance
| Criterion | Evidence |
|---|---|
| New tests exist for VeeForm.vue (issue #7 tier 4) | `src/components/veevalidate/VeeForm.spec.ts`, 11 cases |
| Real test command run, output read back | `✓ src/components/veevalidate/VeeForm.spec.ts (11 tests) 82ms`, `Tests  68 passed (68)` |
| No regression in existing suite | Same 7 pre-existing files still show `✓`, same total pass count minus the 11 new ones (57) |
| Build still green | `✓ built in 4.82s`, no errors |
| SmallestDiff — no production code touched | `git diff main --stat` (see below) limited to the new spec file + hub bookkeeping |

## Noticed, not done
1. **New finding, higher severity than this task's scope, real and
   verified — not an assumption:** `VeeForm.vue`'s client-side validation
   gate is effectively dead in real usage. Isolated repro (plain
   `vee-validate` `useForm`/`useField`, no VeeForm.vue involved) confirms
   `meta.valid` only updates after an EXPLICIT `form.validate()` call —
   neither `handleChange` (fired on typing) nor `handleBlur` updates it on
   its own with this vee-validate `4.13.1` setup. `VeeForm.vue` never
   calls `validate()` anywhere. Net effect: both the submit button's
   `:disabled="!meta.valid"` guard AND `onSubmit()`'s own `if
   (!meta.value.valid) return false` guard never actually block an invalid
   submit in the type-then-click flow a real user follows — confirmed by
   3 passing tests in the new spec file that assert this exact (broken)
   behavior, labeled `BUG (real, verified)` in their test names. Not fixed
   here — this task's scope was "add tests," not "fix validation
   plumbing," and a real fix (likely an explicit `validate()` call inside
   `onSubmit()`, or wiring `validateOnValueUpdate` on each `useField`) is
   a behavior change to every form in the app, needing its own reviewed
   diff. Logged as a new row in `doctrine/domains/PROJECT.md` → Traps.
   Recommend the operator decide whether this warrants a new GitHub issue
   (this is a genuinely different/worse finding than issue #4, which was
   only about `reset()`).
2. `VeeForm.vue:132` template — `<template v-for="el in ..." :key="el.nam">`
   — `nam` is not a real field property (should be `el.name`, same typo
   *shape* as the already-fixed issue #4, but a different, still-live
   occurrence in the template, not `reset()`). Every rendered field gets
   `key === undefined`, so Vue can't distinguish list items by identity on
   reorder/insert. Not fixed here (out of this task's "add tests" scope,
   and fixing a `:key` binding isn't provable by a unit test the way logic
   is). Logged as a new row in `doctrine/domains/PROJECT.md` → Traps.
3. Self-correction, not a code finding: the previous `/todo #8` session
   (same operator turn sequence, different implementer session) left 2
   files edited directly on `main`, uncommitted — a `MAIN_EDIT`-shaped
   slip (agent-hub bookkeeping only, no application code). Caught at the
   start of this session before any new diff was written; fixed by
   branching (`git checkout -b feature/vitest-veeform-tests`) before
   touching anything else, which carries those 2 uncommitted files onto
   this branch instead of leaving them on `main`. Disclosed here rather
   than silently absorbed. No `main` commit ever happened — nothing to
   revert, just a branch that should have existed one session earlier.

## Seal gate
No outward-facing action taken this session (no commit/push/merge) —
everything is uncommitted on `feature/vitest-veeform-tests`, deferred to
`/ship`.
