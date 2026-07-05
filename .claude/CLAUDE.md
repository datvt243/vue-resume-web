# CLAUDE.md — vue-resume-web

## Project
Resume/CV management SPA. Users manage structured resume data (education, experience, projects, awards, certificates, references) via a Node.js REST API.

- **Repo:** https://github.com/datvt243/vue-resume-web
- **Live:** https://datvt243.github.io/vue-resume-web/
- **Backend:** https://nodejs-resume-api-ts.onrender.com/api/v1/ (Render free tier, cold start ~30s)
- **Branch:** `main` → auto-deploys to `gh-pages` (manual via `deploy.sh` for now)

## Stack
Vue 3 + Vite 5 · Pinia · Vue Router 4 · VeeValidate 4 + Yup · Axios · Bootstrap 5 · CKEditor 5 · FontAwesome 6 · SweetAlert2 · TypeScript (partial — see gotchas)

## Commands
```bash
npm run dev      # http://localhost:5173
npm run build    # output: dist/
npm run preview
```

## Key Architecture Patterns

### 1. Model-Driven Forms
Every data section has a `src/models/*.model.ts` file — an array of `modelItem[]` that defines both UI config and Yup validation in one place. `VeeForm.vue` consumes it to auto-render fields.
```ts
// modelItem shape (src/types/model.type.ts)
{ name, label, type, default, valid?: (yup) => schema, col?, convertTo?, options? }
```

### 2. Composables CRUD Pattern
- `useCandidate(field, collection?)` — fetches & caches list data by field name into Pinia, exposes `addRecordToList`, `removeRecordById`
- `useDocument(collection, fields)` — generic CRUD: `updateDoc` (POST/PUT by `_id` presence), `deleteDoc`, `updatePatchDoc`
- `useHelper()` — injects `spinner` (Ref) and `toast` (fn) provided by `App.vue`

### 3. Global State (Pinia)
- `authStore` (`src/stores/auth.js`) — token, user, isAuthenticated; persists to localStorage
- `candidateStore` (`src/stores/candidate.js`) — full resume object, caches to avoid re-fetching

### 4. Global Components
All `src/components/global/*.vue` are auto-registered globally via `src/plugins/GlobalComponents.js`. Use without import: `<Heading>`, `<Button>`, `<NoData>`, `<ListTransition>`, `<Box>`, `<Dropdown>`.

## Directory Map
```
src/
├── components/
│   ├── global/          # Auto-registered: Button, Heading, NoData, ListTransition, Box, Dropdown
│   ├── veevalidate/     # VeeForm.vue (main), VeeFormGeneralInformationUpdate.vue, part/Frm*.vue
│   ├── table/           # TableDefault.vue + render-fn parts
│   ├── convert/         # convert.js — date/boolean/truncate display components
│   ├── {education,experience,project}/  # Domain item cards
│   ├── Modal.vue · Spinner.vue · Toasts.vue
├── composables/         # useCandidate.ts · useDocument.ts · useHelper.js · useInitTable.ts
├── config/              # api.config.js (URL) · regex.config.js
├── lib/                 # swal.lib.js (confirmDelete helper)
├── models/              # *.model.ts — form field definitions per entity
├── pages/
│   ├── _layouts/        # LayoutDefault.vue (pug) · LayoutAuth.vue · Header · Footer · Main
│   ├── auth/            # PageLogin · PageRegister
│   ├── dashboard/       # PageDashboard + Page{Information,GeneralInformation,Education,...}
├── plugins/             # GlobalComponents.js · initFontAwesomeIcon.js
├── routers/index.js     # Routes + beforeEach auth guard
├── services/            # axios.js · base.js (handleBase) · auth.js (handleLogin/Register)
├── stores/              # auth.js · candidate.js
├── types/               # api.type.ts · model.type.ts · table.type.ts · ...
└── utilities/index.ts   # formatDate · formatDateToInput
```

## API
- Base: `http://localhost:3001/` (dev) or `https://nodejs-resume-api-ts.onrender.com/` (prod)
- Auth header: `Authorization: Bearer <token>` on every request
- URL pattern: `api/v1/{collection}/{action}` — e.g. `api/v1/education/update`
- Token stored in `localStorage` key `"token"`; user in `localStorage` key `"user"`

## Known Bugs (do not replicate these patterns)

| # | Location | Issue |
|---|---|---|
| [#1](https://github.com/datvt243/vue-resume-web/issues/1) | `routers/index.js` | `createMemoryHistory` used — must change to `createWebHashHistory` |
| [#2](https://github.com/datvt243/vue-resume-web/issues/2) | `services/auth.js:28` | Login uses GET with password in query params — must be POST body |
| [#3](https://github.com/datvt243/vue-resume-web/issues/3) | `VeeForm.vue:36` | `delete e.valid` mutates prop object — use destructuring instead |
| [#4](https://github.com/datvt243/vue-resume-web/issues/4) | `VeeForm.vue:93` | Typo `e.nam` → `e.name` in reset() |
| [#5](https://github.com/datvt243/vue-resume-web/issues/5) | `Toasts.vue:44` | `v-html` renders unsanitized server error messages — XSS risk |
| [#9](https://github.com/datvt243/vue-resume-web/issues/9) | `useHelper.js:13` | `toValue(refSpinner)` snapshots at setup — return the Ref itself |
| [#10](https://github.com/datvt243/vue-resume-web/issues/10) | `GroupTags.vue:20` | `tags.value.push()` mutates prop array — copy first |

Full backlog: https://github.com/datvt243/vue-resume-web/issues

## Gotchas

- **TypeScript is mixed** — `.js` files exist alongside `.ts`. When editing `.js` files, no type checking. Migration tracked in [#13](https://github.com/datvt243/vue-resume-web/issues/13).
- **Pug in LayoutDefault** — `src/pages/_layouts/LayoutDefault.vue` uses `<template lang="pug">`. Other files use standard HTML templates.
- **`_id` drives create vs update** — `useDocument.updateDoc` sends POST if `_id` is falsy, PUT if truthy. Always ensure `_id` is set correctly before calling.
- **`useCandidate` collection heuristic** — if `collection` prop omitted, strips trailing `s` from field name (`educations` → `education`). Explicit `collection` is safer.
- **`subURL = 'api/v1/'`** is hardcoded in both `services/auth.js` and `services/base.js` — DRY violation, tracked in [#17](https://github.com/datvt243/vue-resume-web/issues/17).
- **No tests** — zero test setup. Adding Vitest tracked in [#7](https://github.com/datvt243/vue-resume-web/issues/7).
- **`tokenRefresh`** returned from login API but never stored or used — tracked in [#12](https://github.com/datvt243/vue-resume-web/issues/12).

## Error Handling Convention
`handleBase(axiosOptions, { loading, toast }, callback)` in `services/base.js` is the standard wrapper — handles spinner, toast success/error, and auto-logout on `invalidToken`. Use this for all API calls except auth (which uses `services/auth.js` directly).

## Preferred Patterns
- Prefer `async/await` + `try/catch` over `.then()/.catch()` chains
- Prefer `computed` over `onMounted` for derived data
- Never mutate props — copy with spread or destructuring
- New form sections → create a `models/*.model.ts`, use `useCandidate` + `useDocument` + `VeeForm`
