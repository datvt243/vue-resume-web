# 2026-09-02 — issue-8-jwt-localstorage-recheck-20260902

- Worker: implementer
- Version: 0.1.0
- Node: `issue-8-jwt-localstorage-recheck-20260902` (new node per LAI-13 —
  does not edit `issue-8-jwt-localstorage`, `-recheck-20260825`, or
  `-recheck-20260830`, all three stay `BLOCKED_ON_BACKEND` as-is)
- Task (verbatim): "#8" (operator, via `/todo`)

## Branch
None — no code change was made (nothing to branch for; see conclusion).

## Recheck performed
1. Confirmed the anti-pattern is still present in this repo: read
   `src/stores/auth.ts` directly —
   `localStorage.getItem('token')`/`setItem('token', val)` (line 13, 44),
   same for `user` and `tokenRefresh`. Unchanged since the 2026-08-30
   recheck.
2. Checked the sibling backend repo (now at
   `/Users/_david/Workspace/Project/resume/resume-nodejs-api`, renamed
   from `../backend` since the last recheck — confirmed same repo, not a
   different one, via `git log` continuity) for real activity since
   2026-08-30 that could unblock this — there IS real activity
   (`git log --oneline -20`, staging branch): a visit-tracking feature
   (`feat(candidate): add profile visit tracking`, PR #98), 2 release
   bumps (v1.2.0, v1.2.1), a Visit-schema bugfix, and 2 agent-hub/CI
   chores — none of it touches auth.
3. Re-checked the specific precondition (backend sets
   `Set-Cookie: ...; HttpOnly; Secure; SameSite=Strict` and stops
   returning the token in the response body):
   - `src/utils/helper-auth.ts:19` — the `req.cookies[fieldName]` read
     fallback found in the 2026-08-30 recheck is still there, unchanged.
   - `grep -rn "cookie-parser" package.json` in the backend → no match;
     `ls node_modules | grep -i cookie` → only `cookie`/`cookie-signature`
     (transitive deps of other packages, not the `cookie-parser`
     middleware) — `req.cookies` is still never populated, same dead code
     path as last time.
   - `grep -rn "res.cookie|httpOnly" src/` in the backend → zero matches,
     same as last time.
   - `grep -n "cookie|token" src/auth/auth.controller.ts` → login/refresh
     still return `{ token, tokenRefresh }` in the JSON response body
     only (`res.json({ ..., data: { token: newAccess, tokenRefresh:
     newRefresh } }` at the refresh endpoint; no `Set-Cookie` logic
     anywhere in the file).
4. Conclusion: the backend added a real feature (visit tracking) since
   the last recheck, but nothing touching auth/cookies. The dead
   `req.cookies` read fallback and the missing `cookie-parser`/`res.cookie`
   wiring are byte-for-byte the same state observed on 2026-08-30 — this
   is not a stale assumption, it was re-verified directly this session.

## Conclusion
Same as all three prior findings (2026-08-20, 2026-08-25, 2026-08-30):
**still blocked on backend**. No frontend diff is possible without the
backend adding real httpOnly-cookie support. Not creating a fake/cosmetic
frontend diff to show activity — that would violate `SmallestDiff`/honesty
over `NORTHSTAR.md`'s "no unproven 'should be done'" rule. Issue #8 stays
OPEN, diagram node stays `BLOCKED_ON_BACKEND`.

## Command
None run — no code changed, nothing to build/test.

## Acceptance
| Criterion | Evidence |
|---|---|
| Confirmed the anti-pattern still exists (not stale) | `src/stores/auth.ts:13,44` — `localStorage` get/set of `token` still present |
| Checked backend for real change since last recheck, not assumed stale | `resume-nodejs-api` `git log --oneline -20` on `staging` — real commits since 2026-08-30, none touching auth/cookies |
| Confirmed the precondition (httpOnly cookie) is still unmet | `grep -rn "cookie-parser" package.json` → no match; `grep -rn "res.cookie\|httpOnly" src/` → no match; `auth.controller.ts` still returns token in JSON body only |
| No fake/cosmetic diff created | `git status --short` in frontend repo — untouched by this note |

## Noticed, not done
Nothing new outside scope — same dead `req.cookies[fieldName]` fallback
in `helper-auth.ts:19` already logged in the 2026-08-30 note, still inert,
still not this repo's (frontend's) code to fix even if it were live.

## Seal gate
No outward-facing action, no diff — nothing to ship. Per `/todo`'s rule
for a `blocked` implementer result: stop immediately, report to the
operator, do not loop, no verifier pass needed (nothing to verify — no
diff, no build claim).
