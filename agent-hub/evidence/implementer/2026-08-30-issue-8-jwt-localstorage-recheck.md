# 2026-08-30 — issue-8-jwt-localstorage-recheck-20260830

- Worker: implementer
- Version: 0.1.0
- Node: `issue-8-jwt-localstorage-recheck-20260830` (new node per LAI-13 —
  does not edit the existing `issue-8-jwt-localstorage` or
  `issue-8-jwt-localstorage-recheck-20260825` rows, both stay
  `BLOCKED_ON_BACKEND` as-is)
- Task (verbatim): "#8" (operator, via `/todo`)

## Branch
None — no code change was made (nothing to branch for; see conclusion).

## Recheck performed
1. Confirmed the anti-pattern is still present in this repo: read
   `src/stores/auth.ts` — `localStorage.getItem('token')` /
   `localStorage.setItem('token', val)` unchanged since the 2026-08-25
   recheck.
2. Checked the sibling backend repo (`../backend`, added to session) for
   any change since the last recheck that could unblock this — the
   backend's own `git log` shows real activity through 2026-08-30
   (`0872834 refactor(auth): consolidate duplicate v1/v2 auth
   implementations`, `34e4cd0 feat(auth): add email verification`), so
   this was worth re-checking, not assumed stale:
   - `src/utils/helper-auth.ts:19` — `extractTokenFromRequest()` now has
     a `req.cookies[fieldName]` fallback branch that did NOT exist in the
     2026-08-25 recheck. At first glance this looks like new cookie-auth
     support.
   - Verified it is NOT functional: `grep -rn "cookie-parser"` across
     `package.json` and `node_modules/` in the backend repo returns
     nothing — the `cookie-parser` middleware is not installed or wired
     up anywhere, so Express never populates `req.cookies` and that
     branch is dead code, unreachable at runtime.
   - `grep -rn "res.cookie\|httpOnly"` across the backend's `src/`
     returns zero matches — nothing in the backend ever calls
     `res.cookie(...)` or sets `HttpOnly` on a response. Login still
     returns the token in the JSON response body only (confirmed
     `src/auth/auth.controller.ts` has no `Set-Cookie` logic).
   - Conclusion: the backend added a *read* fallback for a cookie that it
     never *sets*, and the fallback isn't even reachable without
     `cookie-parser`. This does not amount to httpOnly-cookie support —
     the issue's stated precondition (backend sets
     `Set-Cookie: token=<jwt>; HttpOnly; Secure; SameSite=Strict`) is
     still unmet.
3. Issue #5 (XSS via `v-html`) remains CLOSED/SEALED, unchanged from the
   prior recheck — no new information there.

## Conclusion
Same as both prior findings (2026-08-20, 2026-08-25): **still blocked on
backend**. The backend added an inert code path (unreachable cookie read,
no cookie ever set) that superficially resembles progress but changes
nothing about the actual precondition. Not creating a fake frontend diff
to show activity. Issue #8 stays OPEN, diagram node stays
`BLOCKED_ON_BACKEND`.

## Command
None run — no code changed, nothing to build/test.

## Acceptance
| Criterion | Evidence |
|---|---|
| Confirmed the anti-pattern still exists (not stale) | `src/stores/auth.ts` — `localStorage` get/set of `token` still present |
| Checked backend for real change since last recheck, not assumed stale | `../backend` `git log --oneline -15`, `src/utils/helper-auth.ts:19`, `src/auth/auth.controller.ts` |
| Confirmed the apparent new cookie code path is non-functional | `grep -rn "cookie-parser"` in backend `package.json`/`node_modules` → no match; `grep -rn "res.cookie\|httpOnly"` in backend `src/` → no match |
| No fake/cosmetic diff created | `git status --short` in frontend repo — untouched by this note |

## Seal gate
No outward-facing action, no diff — nothing to ship. Per `/todo`'s rule
for a `blocked` implementer result: stop immediately, report to the
operator, do not loop, no verifier pass needed (nothing to verify — no
diff, no build claim).
