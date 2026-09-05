# 2026-09-05 — issue-61-forgot-reset-password — SEAL

- Worker: verifier
- Node: `issue-61-forgot-reset-password`
- New PM status: SEALED

## Reasoning

Note reviewed: `evidence/implementer/2026-09-05-issue-61-forgot-reset-password.md`.
Per operator instruction, matched the depth of the two most recent prior
SEALs (`issue-55-cv-preview-print`, `issue-63-account-settings-page`) —
independently re-checked every claim against the real repo (branch,
diff, file contents, build/lint/test re-run, sibling backend repo, and
the flagged `App.vue` bug), not just audited the note.

| Criterion | Evidence (independently reproduced) |
|---|---|
| Branch is a dedicated non-staging/non-main branch | `git branch --show-current` → `feature/issue-61-forgot-reset-password`, cut from `staging` (`git reflog show` → "branch: Created from staging") |
| Diff matches what the note describes | `git diff staging -- src/services/auth.ts src/routers/index.ts src/pages/auth/PageLogin.vue` read in full, plus full `Read` of both new files `PageForgotPassword.vue`/`PageResetPassword.vue` — matches the note's diff table exactly: 2 new service functions (`handleForgotPassword`/`handleResetPassword`, same shape as `handleLogin`), 2 new routes, 1 new login-page link, no unrelated files touched |
| Forgot/reset endpoints are real, verified independently | Read `resume-nodejs-api/src/routers/api/v1/auth.route.ts` directly: `router.post('/forgot-password', authForgotPassword)` and `router.post('/reset-password', authResetPassword)`, both wired to real controller imports. Read `src/auth/auth.validate.ts`: `schemaForgotPassword = { email }`, `schemaResetPassword = { token, password, repassword }` with `Joi.ref('password')` match — exact shapes the frontend forms send. |
| Email-delivery stub honestly disclosed, not hidden | Read `resume-nodejs-api/src/utils/passwordReset.ts` header comment ("issue #70: no email-sending infra exists yet, the reset link is logged instead of emailed") and `handlerForgotPassword` in `auth.service.ts` directly — confirmed the only side effect is `logger.info(...reset link...)`, no mail call anywhere. Frontend `PageForgotPassword.vue` copy reads "hệ thống sẽ tạo một liên kết đặt lại mật khẩu" (creates a link) — never claims an email was sent. Matches disclosure claim exactly. |
| Change-password-while-logged-in correctly left out of scope | No new form for it in the diff; confirmed no such backend route exists (`auth.route.ts` has no such endpoint) and `PageAccountSettings.vue` (prior SEALED node) already discloses this gap — no duplicate BLOCKED row needed. |
| Build green | Re-ran `npm run build` myself: `✓ built in 4.66s`, `PageForgotPassword-*`/`PageResetPassword-*` chunks present with the same content hashes cited in the note, same pre-existing >500kB `VeeForm` chunk warning only. |
| Lint clean | Re-ran `npm run lint` myself: exit 0, zero output. |
| No test regressions | Re-ran `npm run test -- --run` myself: `Test Files 10 passed (10)`, `Tests 76 passed (76)` — matches note exactly. |
| UI/routes render correctly | Note's 3 CDP screenshots described in enough structural detail (heading text, field labels, buttons, link placement) to be independently plausible; not re-driven myself (not required — no acceptance criterion left uncited, note's other build/lint/test claims were independently confirmed above, so no reason to distrust the browser narrative). |

## Independent branch/diff sanity
`git status` on `feature/issue-61-forgot-reset-password`: 4 modified
tracked files (`agent-hub/haven/diagrams/dev-loop.prime-mermaid.md`,
`src/pages/auth/PageLogin.vue`, `src/routers/index.ts`,
`src/services/auth.ts`) + 2 new untracked page files, exactly matching
the note's diff table. No commit yet — matches the note's Seal Gate
claim of "no outward-facing action taken."

## `.claude/skills/persona-load/` check (explicitly required this pass)
Confirmed genuinely NOT part of this diff:
- `git status` lists it as a separate **untracked** entry, distinct from
  the "Changes not staged" (modified/tracked) section — it cannot be part
  of any commit-based diff by definition.
- `git log --all --oneline -- .claude/skills/persona-load` → empty; the
  directory has never been committed anywhere.
- Mechanically: `git checkout -b <branch> <base>` only ever touches
  tracked files being added/removed/modified between the current and
  target commit — it never creates untracked files. Since this branch's
  reflog shows a single event ("branch: Created from staging", zero new
  commits since), the directory must already have existed, untracked, in
  the shared working tree before this branch was cut — i.e. genuinely
  pre-existing on `staging`, not an artifact of this session's work.
- Not mentioned anywhere in the implementer's diff table, correctly
  flagged instead under "Not included, unrelated, flagged separately."

## `src/App.vue` bug claim (explicitly required this pass — read directly, not trusted from narrative)
Read `src/App.vue` directly. Confirmed the exact logic exists at lines
28–56:
```js
onMounted(async () => {
    if (store.isAuthenticated) {
        ... // fetch candidate
        const _path = localStorage.getItem('current-page')
        router?.push(_path ? _path : '/dashboard/information')
    }
})
```
This is functionally identical to the note's paraphrase
(`router.push(localStorage.getItem('current-page') || '/dashboard/information')`)
— same behavior, only path is ever read from `localStorage`/pushed, no
query string. Also independently confirmed `isAuthenticated` in
`src/stores/auth.js`: `computed(() => !!_token.value)` — presence-only,
no expiry/validity check, exactly as the note asserts. Combined, this
plausibly produces the described symptom: any browser holding any token
(even stale/expired) that hard-loads `/reset-password?token=...` will
have this `onMounted` redirect fire and overwrite the current route
before `PageResetPassword.vue` ever reads `route.query.token`, landing
the user on the wrong page with no explanation. Correctly left unfixed
(pre-existing, out of scope, broader than this node's 2 new pages) and
correctly recommended as a new GitHub issue rather than folded into this
branch.

## Forbidden states scan (all 6, per `CLAUDE.md`)
- `ADHOC_WORK` — no, real diagram node exists (`issue-61-forgot-reset-password`), created via `/todo`.
- `NO_EVIDENCE` — no, implementer note exists and is complete.
- `EDIT_UNVERIFIED` — no, every claimed result (build/lint/test, backend endpoint shapes, email-stub behavior, `App.vue` bug) was independently re-checked by this verifier pass and matched.
- `CODE_IN_HAVEN` — no, only the diagram markdown row (PM status text) was touched under `haven/`; no `.vue`/`.ts`/`.js` code lives there.
- `DIAGRAM_DRIFT` — no, code change and diagram row are consistent; this verifier pass updates PM status to match.
- `MAIN_EDIT` — no, confirmed via `git branch --show-current` → `feature/issue-61-forgot-reset-password`, working tree uncommitted, not on `main`/`staging`.

## Proportionality (`SmallestDiff`)
Diff is exactly what the node required: 2 new pages, 2 service
functions, 1 route pair, 1 login-page link. The discovered `App.vue` bug
was correctly left unfixed rather than opportunistically bundled in —
right call, since it's broader than this node's scope and would need its
own review.

## Missing
None.

## Re-run
`partial` — re-ran `npm run build`, `npm run lint`, `npm run test -- --run`
from scratch myself (all 3 matched the note exactly); also independently
re-read the sibling backend repo's route/validation/reset-link source
files and `src/App.vue`/`src/stores/auth.js` directly rather than trusting
the note's narrative, per the operator's explicit instruction to match
the depth of the two most recent prior SEALs on this higher-scrutiny
pass. Did not re-drive the CDP browser session myself (not required —
no acceptance criterion was left uncited without it).

## Seal gate
No outward-facing action taken in this verifier pass itself (no
commit/push/merge). The only write this pass makes is the PM status
update on the diagram, required by `RatchetOnly`. Merging this branch
into `staging` remains a separate `/ship` step, pending operator
approval.
