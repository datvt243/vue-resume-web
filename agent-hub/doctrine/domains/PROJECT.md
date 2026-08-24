# doctrine/domains/PROJECT.md — vue-resume-web ground truth

## What is it
A personal resume/CV management SPA. The user logs in, enters structured
data (basic info, education, experience, projects, awards, certificates,
references) via forms, saved through a separate REST API (Node.js
resume-api, not in this repo). Author: Đạt Võ (@datvt243), used for his
own CV.

## Stack + shape
| Thing | Value |
|---|---|
| Language/runtime | Vue 3 (Composition API + `<script setup>`) + TypeScript (partial, mixed with `.js`) |
| Entry point | `src/main.js` → `src/App.vue` |
| Data store | No local DB — all data goes through an external REST API (`src/services/`, `src/config/api.config.js`) |
| Routing | Vue Router 4, config at `src/routers/index.js` |
| State | Pinia — `src/stores/{auth,candidate}.js` |

## Invariants (things that never happen here)
- The frontend never talks to a database directly — always through the
  REST API (`services/`).
- `Authorization: Bearer <token>` is attached to every request that needs
  auth; token lives in `localStorage` key `"token"`, user in `"user"`.
- Whether `_id` is present decides POST (create) vs PUT (update) in
  `useDocument.updateDoc` — not a separate flag.
- Components in `src/components/global/` are auto-registered via
  `src/plugins/GlobalComponents.js` — used directly in templates, NO
  `import` needed.
- Each data section (education, experience, project...) has one
  `src/models/*.model.ts` file defining both the UI fields and the Yup
  validation schema in ONE place — `VeeForm.vue` reads it to auto-render.

## Diagram-first
The diagram (`haven/diagrams/`) is the source of truth for progress —
code must match it.

## Forbidden states
See `CLAUDE.md` — `ADHOC_WORK`, `NO_EVIDENCE`, `EDIT_UNVERIFIED`,
`CODE_IN_HAVEN`, `DIAGRAM_DRIFT`.

## Traps (append when you find a new one)
> Verified directly from source at hub-init time (2026-08-20). These are
> REAL bugs/tech debt currently in the codebase — don't repeat the
> pattern, and don't "just fix it" outside a `/worker` task unless asked.

| Trap | Why | What to do instead |
|---|---|---|
| `src/routers/index.js` uses `createMemoryHistory` | URL doesn't work on page refresh (route is lost) — [issue #1](https://github.com/datvt243/vue-resume-web/issues/1) | If the task is a routing fix, switch to `createWebHashHistory` or `createWebHistory` — don't do it outside the assigned task |
| `src/services/auth.js:28-34` login uses `method: 'get'` with `password` in `params` | Password leaks into URL/logs/browser history — [issue #2](https://github.com/datvt243/vue-resume-web/issues/2) | Switch to POST + body when working on an auth-related task |
| `src/components/veevalidate/VeeForm.vue:36` `delete e.valid` inside `.map()` | Mutates the object directly inside `props.fields` (props array mutated from inside) — [issue #3](https://github.com/datvt243/vue-resume-web/issues/3) | Use destructuring to build a new object instead of `delete` on the original element |
| `src/components/veevalidate/VeeForm.vue:93` `e.nam` (should be `e.name`) in `reset()` | Reset sets the wrong key, silent bug — [issue #4](https://github.com/datvt243/vue-resume-web/issues/4) | Fix `e.nam` → `e.name` when working on a form-reset task |
| `src/components/Toasts.vue:44` `v-html="props.content"` renders the server error message directly | XSS if the server returns a message containing HTML/script — [issue #5](https://github.com/datvt243/vue-resume-web/issues/5) | Sanitize or switch to text interpolation when fixing |
| `src/composables/useHelper.js:14` `loading: toValue(refSpinner)` | Snapshots the Ref's value at `useHelper()` call time instead of returning the Ref itself — loses reactivity with the spinner afterward — [issue #9](https://github.com/datvt243/vue-resume-web/issues/9) | Return the Ref (`refSpinner`) instead of `toValue(refSpinner)` |
| `GroupTags.vue:20` `tags.value.push(tag.value)` on `toRef(props, 'modelValue')` | Mutates the `modelValue` prop array directly | Copy the array before pushing, then emit instead of mutating props |
| `subURL = 'api/v1/'` hardcoded in BOTH `src/services/auth.js` AND `src/services/base.js` | DRY violation — changing the base path means editing 2 places — [issue #17](https://github.com/datvt243/vue-resume-web/issues/17) | Consolidate into `src/config/api.config.js` when working on a related task |
| Both `yarn.lock` AND `package-lock.json` exist at repo root | Lockfile drift risk — 2 package managers can resolve different versions | Use npm (`package-lock.json` is newer); do NOT run `yarn install` unless the task explicitly asks to clean up the lockfile |
| ~~`.eslintrc.cjs` extends `plugin:vue/vue3-essential` but `eslint-plugin-vue` was NOT in `node_modules`~~ **FIXED 2026-08-20** | Original trap: `.eslintrc.cjs:2` was also missing `@rushstack/eslint-patch` (the actual first failure, blocking even before `eslint-plugin-vue`), and `.ts`/`<script lang="ts">` couldn't parse because `parser: '@typescript-eslint/parser'` was missing. Installed `@rushstack/eslint-patch` + `eslint-plugin-vue@^9` + `eslint@^8.57.0` (declared explicitly in `devDependencies`, previously only transitive), added `.ts`/`.vue` `overrides` in `.eslintrc.cjs`, added the `lint` script. | `npm run lint` now runs for real — currently reports **95 real errors** (mostly `no-unused-vars`, `vue/multi-word-component-names`) NOT fixed, separate tech debt, not auto-fixed just because a task says "make lint run" |
| `src/composables/useDocument.ts` `getValue()` uses `f.default \|\| ''` | Any falsy-but-valid field default (`0`, `false`) is silently collapsed to `''` on document init — a numeric default of `0` can never actually be the initial value. Found while writing `useDocument.spec.ts` (2026-08-25), not fixed (out of that task's scope) | If a task touches this function, use `f.default ?? ''` instead (matches the fix already applied to `VeeForm.vue`'s `reset()` for the same class of bug, issue #4/register-password-date-currency-validation) |
| ~~No test suite at all (0 test files, no `test` script)~~ **PARTIALLY FIXED 2026-08-25, EXTENDED same day** | [issue #7](https://github.com/datvt243/vue-resume-web/issues/7) — Vitest installed (`vitest@2.1.9`, pinned below `^3`/`^4` to match the project's `vite@^5.3.1`; `jsdom` pinned to `26.1.0` — `27.x`+ throws `ERR_REQUIRE_ESM` from a transitive `@asamuzakjp/css-color` dependency under this Node/vitest combo). `npm run test` now covers `src/utilities/`, `src/stores/{auth,candidate}`, `src/composables/{useDocument,useCandidate}` — 50 tests. Composables needing DI (`useHelper`'s `inject()`) or an active component (`onBeforeMount`) are tested via `@vue/test-utils` `mount()` + `vi.mock()` on `@/services/base`, `@/composables/useHelper`, `@/lib/swal.lib`. Issue #7 stays OPEN — `useInitTable` and all Vue components (incl. `VeeForm.vue`, the issue's own 4th-priority target) are still untested. | For code inside the covered files, add/run real Vitest tests. For everything else, still use `npm run build` + manual `npm run dev` check, state clearly this is NOT a real test — see `doctrine/MEMORY.md` → Test row |

## Decisions, with reasoning
> A decision without a reason gets "cleaned up" by a future agent — the
> WHAT is already in the code, only the WHY is load-bearing.

| Date | Decision | Why | Alternative rejected |
|---|---|---|---|
| 2026-08-20 | Installed `eslint-plugin-vue@^9` (not the latest `^10`) | `eslint-plugin-vue@10` requires ESLint 9 + flat config; the repo is on ESLint 8.57 with `.eslintrc.cjs` (legacy format). `v9` is the newest version still supporting `eslint: '^8.0.0'` per peerDependencies, no need to migrate to flat config at the same time | Installing `v10` + migrating to `eslint.config.js` flat config in the same pass — rejected as a much bigger change than the assigned task ("install packages so lint runs"), left as a separate task if ever needed |
| 2026-08-20 | Installed lint deps + fixed `.eslintrc.cjs` overrides for `.ts`/`.vue`, but did NOT auto-fix the 95 lint findings | The assigned task was "make lint actually run," not "clean up all lint errors" — 95 errors is separate tech debt, different scope, needs an operator decision on whether to clean it up | Running `eslint --fix` or hand-fixing all 95 — rejected as out of task scope; some errors (`vue/multi-word-component-names`) would rename components and could break imports elsewhere |
| 2026-08-25 | Pinned `vitest@2.1.9` (not the latest `^4`) and `jsdom@26.1.0` (not the latest `^30`) for issue #7 | `vitest@^4` depends on `vite@^6\|\|^7\|\|^8`; installing it alongside the project's `vite@^5.3.1` produced a duplicate nested `vite@6.4.3` inside `node_modules/vitest/`, which broke `vitest.config.ts`'s TypeScript types (`Plugin<Api>` from two different `vite` copies aren't assignable). `vitest@2.1.9` depends on `vite@^5.0.0` — no duplicate, no type conflict. Separately, `jsdom@27.0.1` (latest at install time before this pin) throws `ERR_REQUIRE_ESM` on every test run — one of its transitive deps (`@asamuzakjp/css-color` → `@csstools/css-calc`) ships ESM-only and jsdom's own code still `require()`s it; `jsdom@26.1.0` predates that regression and ran clean. Only wrote the smallest test file (`src/utilities/index.spec.ts`) to prove the setup works — did not attempt the full 20-30 test / 60% coverage plan from issue #7's own write-up, that's separate follow-up scope | Installing latest `vitest`/`jsdom` and living with the type error / `ERR_REQUIRE_ESM` — rejected, `EDIT_UNVERIFIED` risk (couldn't get a clean `npm run test` run at all) |
