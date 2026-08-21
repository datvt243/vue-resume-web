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
| No test suite at all (0 test files, no `test` script) | [issue #7](https://github.com/datvt243/vue-resume-web/issues/7) tracks adding Vitest | Use `npm run build` + manual `npm run dev` check as temporary evidence, state clearly in evidence this is NOT a real test |

## Decisions, with reasoning
> A decision without a reason gets "cleaned up" by a future agent — the
> WHAT is already in the code, only the WHY is load-bearing.

| Date | Decision | Why | Alternative rejected |
|---|---|---|---|
| 2026-08-20 | Installed `eslint-plugin-vue@^9` (not the latest `^10`) | `eslint-plugin-vue@10` requires ESLint 9 + flat config; the repo is on ESLint 8.57 with `.eslintrc.cjs` (legacy format). `v9` is the newest version still supporting `eslint: '^8.0.0'` per peerDependencies, no need to migrate to flat config at the same time | Installing `v10` + migrating to `eslint.config.js` flat config in the same pass — rejected as a much bigger change than the assigned task ("install packages so lint runs"), left as a separate task if ever needed |
| 2026-08-20 | Installed lint deps + fixed `.eslintrc.cjs` overrides for `.ts`/`.vue`, but did NOT auto-fix the 95 lint findings | The assigned task was "make lint actually run," not "clean up all lint errors" — 95 errors is separate tech debt, different scope, needs an operator decision on whether to clean it up | Running `eslint --fix` or hand-fixing all 95 — rejected as out of task scope; some errors (`vue/multi-word-component-names`) would rename components and could break imports elsewhere |
