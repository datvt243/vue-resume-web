# 2026-08-25 — issue-8-jwt-localstorage-recheck

- Worker: implementer
- Version: 0.1.0
- Node: `issue-8-jwt-localstorage` (existing node, state `BLOCKED_ON_BACKEND`
  since 2026-08-20 — this is a recheck, not new work)
- Task (verbatim): "#7 và #8" (operator, via `/todo`) — this note covers #8

## Branch
None — no code change was made (nothing to branch for; see conclusion).

## Recheck performed
1. Read current `src/stores/auth.ts` (path changed from `.js` to `.ts`
   since the 2026-08-20 original evidence, post issue #13 TS migration —
   confirmed the actual anti-pattern is unchanged):
   `localStorage.getItem('token')` / `localStorage.setItem('token', val)`
   still present (lines 13, 44), same for `user` and `tokenRefresh`.
2. Checked the one thing the GitHub issue itself says should happen
   first: "Fix issue #5 (XSS) trước" — confirmed issue #5 is CLOSED and
   SEALED on this diagram (`v-html` removed from `Toasts.vue`, verified
   earlier this session). Reduces the practical risk somewhat but does
   NOT change the fix itself, which still requires backend cooperation
   (issue's own text: "Cách fix (cần phối hợp backend)" — backend must
   set `Set-Cookie: token=<jwt>; HttpOnly; Secure; SameSite=Strict`).
3. No indication anywhere in this frontend repo (routes, services, env
   config) that the backend now supports cookie-based auth — nothing to
   react to on the frontend side.

## Conclusion
Same as the original 2026-08-20 finding: **still blocked on backend**, no
real frontend diff is possible without the backend adding httpOnly cookie
support. Not creating a fake diff (e.g. cosmetic token handling) just to
show activity — that would violate `SmallestDiff`/honesty over the
`NORTHSTAR.md` "no unproven 'should be done'" rule. Issue #8 stays OPEN,
diagram node stays `BLOCKED_ON_BACKEND`.

## Command
None run — no code changed, nothing to build/test.

## Acceptance
| Criterion | Evidence |
|---|---|
| Confirmed the anti-pattern still exists (not stale) | `src/stores/auth.ts:13,44` (paths updated post-TS-migration) |
| Confirmed the one stated precondition (#5 fixed) | Issue #5 CLOSED, SEALED on diagram |
| No fake/cosmetic diff created | `git status --short` — untouched by this note (only the `feature/vitest-test-setup` branch's #7 changes exist, unrelated) |

## Seal gate
No outward-facing action, no diff — nothing to ship for this half of the
task. Per `/todo`'s rule for a `blocked` implementer result: stop
immediately, report to the operator, do not loop, no verifier pass needed
(nothing to verify — no diff, no build claim).
