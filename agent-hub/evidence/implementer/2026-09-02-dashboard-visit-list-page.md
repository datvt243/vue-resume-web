# 2026-09-02 — dashboard-visit-list-page

- Worker: implementer
- Version: 0.1.0
- Node: `dashboard-visit-list-page` (new node, per LAI-13 — follow-up to the just-SEALED `dashboard-visit-count-integration`)
- Task: "bổ sung, tạo thêm 1 link tới page hiển thị danh sách visit" → "đồng thời update lại text hiển thị ở dashboard" (operator)

## Why this node
The sibling node wired the visit *count* into the dashboard (2
placeholders → real number). The backend's `GET candidate/visits`
response also includes the full `visits` array (ip/location/timestamp per
visit) — not surfaced anywhere yet. This node adds a detail page + a link
to it.

## Branch
`feature/dashboard-visit-count` — same branch as the sealed sibling node
(not yet shipped), checked out from `staging`.

## Diff
| File | Why |
|---|---|
| `src/composables/useVisits.ts` | Extended to also cache `visits` (the array) on `candidateStore`, not just `visitCount` — the one API call already returns both, no extra request needed |
| `src/pages/dashboard/PageVisits.vue` (new) | Read-only table of visits (`TableDefault`, no `#control` slot → no edit/delete). Reads the cache via `computed`, doesn't call `useVisits()` again |
| `src/routers/index.ts` | New child route `visits` under `/dashboard` → `PageVisits.vue` |
| `src/pages/home/PageHome.vue` | Added `<RouterLink to="/dashboard/visits">` under the stat-highlight card's disclosure text |

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
dist/assets/PageVisits-C51YFhiy.js   0.82 kB │ gzip: 0.61 kB
...
✓ built in 5.00s
```
Same pre-existing chunk-size warning only. `PageVisits.vue` confirmed
code-split into its own lazy chunk (matches every other dashboard page).

```
> resume-vuejs-website@1.3.0 lint
> eslint src --ext .js,.ts,.vue
```
Exit 0, no output.

```
 Test Files  10 passed (10)
      Tests  76 passed (76)
```
No regressions. No new spec file — same disclosed gap as the sibling
node.

## Live manual verification (UI + new route — build+test alone isn't enough)
Reused the same disposable `qa-test-visits-1788292259@example.com`
account from the sibling node's verification (already has exactly 1 real
Visit document from that earlier test). Pointed `.env.development` at the
real deployed backend temporarily (reverted after — confirmed via `git
diff .env.development` empty at the end), started a fresh `npm run dev`,
injected the same account's JWT via the same CDP technique as the sibling
node.

1. **Table renders real data.** Read `.table-container`'s live
   `innerText` at `#/dashboard/visits` directly:
   ```
   #  Thời Gian    Vị Trí    Địa Chỉ IP
   1  02/09/2026             ::1
   ```
   Matches the real Visit document from the earlier `curl` test exactly
   (`ip: "::1"`, `location: ""` — correct, `geoip-lite` has no entry for
   a loopback address, not a bug).

2. **The link genuinely works, not just the destination page.** Found the
   real `<a>` element by its text content on the live `PageHome.vue`
   (`"Xem chi tiết từng lượt truy cập"`) and called `.click()` on it (a
   real DOM click, not a direct hash-navigation that would bypass testing
   whether the link itself is wired correctly). Result: landed at
   `#/dashboard/visits`, heading rendered `"LƯỢT TRUY CẬP HỒ SƠ"`
   (uppercase from CSS `text-transform`, expected — matches every other
   `Heading` component usage in this app).

3. **Console check**: subscribed to `Log.entryAdded`/
   `Runtime.exceptionThrown` across a fresh reload + the click — zero
   entries.

4. **Cleanup**: `git checkout -- .env.development` (confirmed empty diff
   after), dev-server process killed (`lsof -t -i:5173 | xargs kill`,
   confirmed port free after).

## Acceptance
| Criterion | Evidence |
|---|---|
| New page shows the real visit list | Live DOM read: table row matches the real Visit document (date/location/IP) |
| Link from the dashboard actually navigates there | Real `.click()` on the real `<a>` element (not a hash-nav bypass), landed on the right page |
| No duplicate fetch (reuses the sibling node's cache mechanism) | `PageVisits.vue` has no `useVisits()` call — grep-confirmable, only a `computed` reading `candidateStore` |
| Requested text update on the dashboard | The link itself (`"Xem chi tiết từng lượt truy cập →"`) is new text on `PageHome.vue`, directly under the existing disclosure paragraph |
| No console error | CDP `Log.entryAdded`/`Runtime.exceptionThrown`: empty across reload + click |
| No stray env/process side effect | `git diff .env.development` empty; port 5173 confirmed free after |
| Build/lint/test green | `✓ built in 5.00s`; lint exit 0; `76 passed (76)` |

## Noticed, not done
- No spec file for `PageVisits.vue` or the extended `useVisits.ts` —
  same disclosed gap as the sibling node, a future `issue-7-*`-style pass
  could add one.
- The visits table has no pagination/sort — matches every other
  dashboard list in this app (education, reference, ...), none of which
  paginate either; not a new gap introduced here.
- Link was added in exactly 1 place (`PageHome.vue`'s stat card), per the
  operator's literal "1 link" — did not also add a sidebar nav entry
  (`LayoutDefault.vue`'s `routers` array), which would be a reasonable
  follow-up if wanted but wasn't asked for here.

## Seal gate
None — no outward-facing action taken (no commit/push/merge). The
disposable QA account's live HTTP/browser interaction reused an account
already created in the sibling node's evidence, no new account created.
Branch left uncommitted, deferred to `/ship` with operator approval.

## Status
`sealed_pending_verifier`
