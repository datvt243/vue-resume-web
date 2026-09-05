# 2026-09-05 — issue-63-account-settings-page

- Worker: implementer
- Version: 0.1.0
- Node: `issue-63-account-settings-page`
- Task (verbatim): "#63" via `/todo`, resolved from `gh issue view 63` —
  [ENHANCEMENT] Trang cài đặt tài khoản (view/change email, change
  password, optional delete account).

## Hub bytes before: 80281

## Branch
`feature/issue-63-account-settings-page`, checked out from `staging`
(new-feature prefix — kept after merge per `/ship`'s rule).

## Scope decision (read before judging this as incomplete)
Issue #63's own "Phạm vi đề xuất" section says up front: "Cần backend hỗ
trợ endpoint update email/password cho user hiện tại." Verified directly
against the sibling backend repo (`resume-nodejs-api`, local path
`/Users/_david/Workspace/Project/resume/resume-nodejs-api`) instead of
assuming the issue's own caveat is still accurate:
- `src/routers/api/v1/candidate.route.ts` — only `PUT /update`, `PATCH
  /update` (`fnUpdate`/`fnUpdateFields`), and `DELETE /` (`fnDelete`)
  exist for the authenticated candidate.
- `src/candidate/candidate.validate.ts` — `schemaCandidate` and
  `schemaCandidatePatch` (the Joi schemas both update handlers validate
  against) declare `firstName`/`lastName`/`phone`/`marital`/`gender`/
  `birthday`/`address`/`introduction`/`socialMedia`/`candidateId`/
  `isPublic` — **no `email` or `password` field anywhere in either
  schema.**
- `src/config/joi.config.ts` — `getObject = (fields) => Joi.object(fields)`,
  no `.unknown(true)`. Joi's own default for `Joi.object()` is
  `unknown(false)` (reject unlisted keys), so a request body containing
  `email` or `password` gets rejected by validation before it ever
  reaches `handlerUpdate`/Mongo — this isn't inferred, it's Joi's
  documented default behavior applied to code read directly.
- `DELETE /api/v1/candidate` → `handlerDelete` in
  `src/candidate/candidate.service.ts` — real, working, self-only (uses
  `req.user._id`, never a client-supplied id), cascades: deletes every
  CV-section document (`generalInformation`, `Experience`, `Education`,
  `Reference`, `Project`, `Certificate`, `Award`) for that candidate,
  deletes the uploaded CV file and any project/certificate/award images
  from disk, then deletes the candidate document itself.

Conclusion: email/change and password-change are backend-blocked (same
class as `issue-8-jwt-localstorage` — a real gap, not something the
frontend can paper over with a form that would 400 on submit). Scoped
this node down to what the backend actually supports: an account
settings page with a working delete-account action, plus an honest
"not yet supported" note for the other two — not a fake form.

## Diff
| File | Why |
|---|---|
| `src/pages/dashboard/PageAccountSettings.vue` (new) | Account settings page. Read-only email display (`authStore.getUser.email`) + explicit not-yet-supported notes for email/password change; working "Xoá tài khoản" (delete account) action wired to the real `DELETE /api/v1/candidate` endpoint via `handleBase`, gated by the existing `confirmDelete` swal helper, logs out via `authStore.logOut({router})` on success (same pattern as `Header.vue`'s existing logout). |
| `src/routers/index.ts` | New child route `dashboard/account-settings` → `PageAccountSettings.vue`, same shape as the sibling `preview` route added for issue #55. |
| `src/pages/_layouts/LayoutDefault.vue` | One new sidebar nav entry ("Cài đặt tài khoản"), same array/pattern as the other 9 entries. |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | New PM status row, `IN_PROGRESS` (implementer never sets SEALED — verifier's job). |

**Not included in this diff, flagged separately (not mine, not this
task):** `git status` on the feature branch (inherited from `staging`,
pre-existing before I checked out) also shows `.claude/skills/hub-tokens/
SKILL.md` modified and `.claude/commands/issues-ls.md` untracked. Neither
relates to issue #63 — I did not create or edit them this pass. Left
both untouched (didn't revert, didn't fold into this diff) and am
flagging to the operator directly, since `staging` should not have had
uncommitted changes before this branch was cut (`CLAUDE.md` branching
rule step 5). Recommend the operator `git stash` or separately `/ship`
that pre-existing work — it should not ship bundled with this PR.

## Command
`npm run build` (repo root, exact command from `doctrine/MEMORY.md`)

## Output
```
dist/assets/PageAccountSettings-DxNSs4OO.css        0.17 kB │ gzip:   0.15 kB
dist/assets/PageAccountSettings-DtyWlTGJ.js         1.84 kB │ gzip:   1.05 kB
...
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 4.35s
```
Same pre-existing >500kB chunk warning as every prior SEAL (`VeeForm.js`)
— not a new regression.

Also ran (not this project's "Test" row per NORTHSTAR — `npm run test`
does exist here, no regression):
```
npm run test -- --run
 Test Files  10 passed (10)
      Tests  76 passed (76)
```
Same 76/10 as the last SEAL (`issue-55-cv-preview-print`) — no new test
file added for this page (no existing precedent test file for a
dashboard *page* component beyond `VeeForm.vue` itself, matches how
`PagePreview.vue` shipped with no dedicated spec either).

```
npm run lint
> resume-vuejs-website@1.4.0 lint
> eslint src --ext .js,.ts,.vue
(no output, exit 0)
```

Manual `npm run dev` check (UI/route diff — per `implement.md` step 7):
no browser-automation/screenshot tool available this session (`curl
localhost:9888/json/version` → no debug browser running). Honest
substitute: started `npm run dev`, confirmed via `curl` that
`/resume-vuejs-website/src/pages/dashboard/PageAccountSettings.vue`
returns `200` with a clean Vue-SFC-compiled module (render function
referencing `handleDeleteAccount`, no syntax/compile error), confirmed
`/resume-vuejs-website/src/routers/index.ts` transform includes the new
`account-settings` route entry, and confirmed the app shell
(`/resume-vuejs-website/`) still returns `200`. This is NOT a real
click-through/visual confirmation — stated explicitly, not implied.

## Acceptance
| Criterion | Evidence |
|---|---|
| Node on diagram before code | `issue-63-account-settings-page` row added, `IN_PROGRESS`, before any `src/` file was touched |
| Branch dedicated, not `main`/`staging` | `git branch --show-current` → `feature/issue-63-account-settings-page` |
| Smallest diff for the backend-supported scope | 1 new page + 1 route + 1 nav link; no opportunistic fixes bundled |
| Delete-account action calls a real, verified endpoint | `DELETE /api/v1/candidate` read directly in `resume-nodejs-api` source, confirmed self-only + cascading |
| Email/password change honestly not built, not faked | No form/inputs for email or password anywhere in `PageAccountSettings.vue` — just informational text; backend schema/validator evidence cited above |
| Build green | `✓ built in 4.35s`, new `PageAccountSettings-*` chunks present |
| Lint clean | exit 0, no output |
| No test regressions | `Test Files 10 passed (10)`, `Tests 76 passed (76)` |
| UI/route compiles at runtime | `curl` 200 + clean compiled SFC module + route entry present in transformed router, dev server log has zero errors (only the two pre-existing macro-import warnings, `defineProps`/`defineExpose`) |

## Noticed, not done
- Pre-existing uncommitted diff on `staging` before this branch was cut
  (`.claude/skills/hub-tokens/SKILL.md` modified, `.claude/commands/
  issues-ls.md` untracked) — not part of this task, flagged to operator
  above, not touched.
- `authStore.getUser.email` is trusted as-is for display (same trust
  level as every other page reading `authStore`/`candidateStore`) — no
  new risk introduced, but if `email` is ever missing from the stored
  user object post-login, the page falls back to "Chưa cập nhật" rather
  than throwing (defensive `|| 'Chưa cập nhật'`), not a fix for a bug I
  went looking for, just how the existing pattern already works.
- Issue #63 also lists "Nhân bản (duplicate) một mục dữ liệu"-style scope
  creep risk was avoided — did not add any account-duplication or export
  feature, out of scope for this node.

## Seal gate
No outward-facing action taken in this pass (no commit, no push, no
merge, no real destructive API call — `DELETE /api/v1/candidate` was
never actually invoked, only read/traced in source and confirmed to
compile client-side). Merging this branch into `staging` is a separate
`/ship` step, pending operator approval.
