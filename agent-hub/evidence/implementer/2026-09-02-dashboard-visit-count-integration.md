# 2026-09-02 — dashboard-visit-count-integration

- Worker: implementer
- Version: 0.1.0
- Node: `dashboard-visit-count-integration` (new node, per LAI-13)
- Task: "backend (../resume-nodejs-api) vừa bổ sung API đếm số lượt visit, hãy kiểm tra và bổ sung vào dashboard" (operator, via `/todo`)

## Investigation (backend, sibling repo `../resume-nodejs-api`)
Confirmed real, already released — `main` @ v1.2.1 (`feat(candidate): add
profile visit tracking`, PR #98, plus a bugfix PR #101 for a Visit-model
`_id` crash).

- `GET /api/v1/candidate/visits` (bearer auth, self only) →
  `{ success, message, errors, data: { count, visits } }`.
  `src/candidate/candidate.service.ts:111-114`.
- `POST /api/me/{email}/visit` (public, no auth) — records one Visit
  document (`candidateId`, `ip`, `location` via `geoip-lite`,
  timestamped). `src/candidate_me/index.ts` `handlerRecordVisit`.
  This is the ONLY thing that increments the count — and nothing in
  this frontend calls it yet (the public share-link profile page,
  issue #56, doesn't exist).

## Branch
`feature/dashboard-visit-count`, checked out from `staging`.

## Diff
| File | Why |
|---|---|
| `src/composables/useVisits.ts` (new) | Fetch-once-and-cache composable, same shape as `useCandidate.ts` — GET `candidate/visits`, cache `data.count` on `candidateStore` under `visitCount` via the existing generic `setCandidateByField`/`getCandidateByField` mechanism |
| `src/composables/index.ts` | Registered `useVisits` in the barrel, same as every other composable |
| `src/pages/_layouts/LayoutDefault.vue` | `const cvViewCount = 0` → `const { count: cvViewCount } = useVisits()`. This is the ONE ancestor wrapping every dashboard page (`App.vue` renders it for every authenticated route) — the fetch happens here. Template: `{{ ' ' + cvViewCount }}` → `{{ ' ' + (cvViewCount ?? 0) }}` (avoids literally rendering "null" during the brief pre-fetch window) |
| `src/pages/home/PageHome.vue` | `const cvViewCount = 0` → `const cvViewCount = computed(() => info.value?.visitCount ?? 0)` — reads the value `LayoutDefault.vue` already fetched/cached, does NOT fetch its own copy (`LayoutDefault` always mounts first, being the parent). Also corrected the disclosure copy (see below) |

## Command
```
npm run build
```
```
npm run lint
```
```
npm run test
```

## Output
```
✓ 1343 modules transformed.
...
✓ built in 5.07s
```
Same pre-existing chunk-size warning only.

```
> resume-vuejs-website@1.3.0 lint
> eslint src --ext .js,.ts,.vue
```
Exit 0, no output.

```
 Test Files  10 passed (10)
      Tests  76 passed (76)
```
No regressions. No new spec file for `useVisits.ts` — see "Noticed, not
done".

## Live manual verification (UI diff — build+test alone isn't enough, see `implement.md` step 7)

1. **Backend contract, proven with real HTTP calls** (not inferred from
   reading source): registered a disposable
   `qa-test-visits-1788292259@example.com` account directly against the
   real deployed backend (`https://nodejs-resume-api-ts.onrender.com`,
   Render free tier, real cold start observed ~40s on first call).
   ```
   POST auth/register → 200, success
   POST auth/login → 200, real JWT
   GET candidate/visits (bearer) → {"count":0,"visits":[]}
   POST /api/me/{email}/visit → 200, success
   GET candidate/visits (bearer) → {"count":1,"visits":[{...}]}
   ```
   Confirms `useVisits.ts`'s assumption (`res.data.count`) matches the
   real response shape exactly.

2. **Frontend UI, live in a real browser**: temporarily pointed
   `.env.development`'s `VITE_API_URL` at the same deployed backend
   (reverted immediately after — `git diff .env.development` confirmed
   empty before finishing). Along the way found and killed 2 broken dev-
   server states: one stale instance still serving the pre-`github-pages-
   base-path-rename` `/vue-resume-web/` base path (would have given a
   false negative), one that silently died after being background-
   tracked. Started a clean `npm run dev` (confirmed via `curl` HTTP 200
   + `lsof -i :5173`).

   Injected the disposable account's real JWT into `localStorage` via a
   raw CDP script (`ws` against the already-open port-9888 debug
   browser — same technique logged in
   `haven/workers/implementer/MEMORY.md` from `issue-62-dark-mode-body-
   attr-override`). First attempt used a hash-only navigation
   (`location.hash = '#/'`) after setting `localStorage` — bounced back
   to `/login` despite `hasToken: true`, because Pinia's `authStore` only
   reads `localStorage` once at module-init time; a hash change alone
   doesn't re-run that init. Corrected: real `Page.reload` (CDP), which
   does force the JS to re-initialize from the new `localStorage` —
   landed authenticated at `#/dashboard/information`.

   Read the live DOM directly (not inferred):
   ```
   .dashboard-sidebar-welcome innerText:
     "👋 Chào mừng\n\nChưa cập nhật\n\nTìm việc: Off\n\nLượt xem CV: 1"
   ```
   Then a client-side hash nav to `#/` (no reload, proving the cached
   value survives without a re-fetch):
   ```
   .stat-highlight innerText:
     "1\nlượt xem\n\nLượt truy cập hồ sơ của bạn\n\nMới\n\n
      Số lần trang hồ sơ công khai của bạn được xem ..."
   ```
   Both show `1`, matching the real backend count from step 1. No crash,
   no stale "0", no duplicate-fetch artifact.

3. **Console check**: subscribed to `Log.entryAdded`/
   `Runtime.exceptionThrown` CDP events across a fresh `Page.reload` —
   zero entries.

4. **Bug caught by this live check, fixed in this same node**: the
   disclosure copy under the stat block originally said "Hiện sẽ luôn là
   0" ("will always be 0") — literally false, since step 2 just proved a
   nonzero count renders correctly. Softened to "Số này sẽ không tăng
   qua app hiện tại" (won't increase *through this app*, still true and
   honest — nothing in the frontend calls the recording endpoint — but
   not a false absolute).

## Acceptance
| Criterion | Evidence |
|---|---|
| Backend visit-count API is real and matches the composable's assumptions | Live `curl` round-trip: register → login → GET (0) → POST /visit → GET (1) |
| Both dashboard placeholders now show the real count | Live DOM read: sidebar `"Lượt xem CV: 1"`, `PageHome.vue` `"1\nlượt xem"` |
| No duplicate fetch (LayoutDefault fetches once, PageHome reads cache) | `PageHome.vue`'s `cvViewCount` has no `useVisits()` call, only `computed(() => info.value?.visitCount ...)` |
| No console error introduced | CDP `Log.entryAdded`/`Runtime.exceptionThrown` subscription across a fresh reload: empty |
| No stray env/branch side effect left behind | `git diff .env.development` empty; `git status --short` shows only the 4 intended files |
| Build/lint/test green | `✓ built in 5.07s`; lint exit 0; `76 passed (76)` |

## Noticed, not done
- No dedicated spec file for `useVisits.ts` (unlike `useInitTable`/
  `useHelper` from the recent issue #7 work) — this task was "wire the
  API into the dashboard," not "extend test coverage." A future
  `issue-7-*`-style node could add `useVisits.spec.ts` following the
  exact `useCandidate.spec.ts`/`mount()` + `vi.mock()` pattern.
- If two `LayoutDefault`-wrapped pages ever mount close enough together
  that `useVisits()` gets called from more than one place before the
  first fetch resolves, they'd both fire a GET (no request-dedup
  infrastructure exists in this app for any composable, not just this
  one — same as `useCandidate`/`useDocument`). Not a new class of bug,
  not fixed here — matches the app's existing behavior everywhere else.
- The `visits` array itself (per-visit ip/location/timestamp) is fetched
  by the backend response but not surfaced anywhere in the UI, only
  `count`. Out of scope — the task was "bổ sung vào dashboard" for the
  count stat that already had 2 placeholder spots; a detailed visit-log
  view would be new UI, not requested.
- `.claude/CLAUDE.md`'s "Known Bugs" table / `doctrine/domains/PROJECT.md`
  don't need updates from this node — no new trap introduced, no bug
  fixed.

## Seal gate
None — no outward-facing action taken (no commit/push/merge). The
disposable QA account's live HTTP calls (register/login/GET/POST) are
real API calls but non-destructive, isolated to a throwaway account,
same precedent as `register-password-date-currency-validation` and
`open-to-work-field`'s verification method — not a new pattern. Branch
left uncommitted, deferred to `/ship` with operator approval.

## Status
`sealed_pending_verifier`
