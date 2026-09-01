# 2026-09-02 — dashboard-visit-count-integration (verifier)

- Worker: verifier
- Version: 0.1.0
- Node: `dashboard-visit-count-integration`
- Verdict: **SEAL**
- Fresh subagent session, no memory of writing this diff (`NeverVerifyOwnWork` satisfied by construction — launched specifically for this verify pass).

## Method
Per operator instruction for this task, went beyond the default `EvidenceOnly`
note-only read: independently re-ran build/lint/test AND read the actual diff
of all 4 changed/new files directly (not just the evidence note's prose),
because the note's central technical claims are exactly the kind of thing
that must be confirmed against real evidence, not inferred from a
description of it.

## Branch / scope
- `git branch --show-current` → `feature/dashboard-visit-count` (checked out
  from `staging`, matches the note; correct `feature/*` prefix per
  `CLAUDE.md`'s branching rule since this is new functionality, not a
  bugfix). Not `main` → `NoMainEdit` clear.
- `git diff staging --stat` → exactly 4 files: `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md`
  (this row), `src/composables/index.ts`, `src/pages/_layouts/LayoutDefault.vue`,
  `src/pages/home/PageHome.vue` — plus untracked `src/composables/useVisits.ts`
  (new) and the evidence note. Matches exactly what the note claims, no
  scope creep.

## Independent re-run (repo root)
```
npm run build   → ✓ built in 4.83s, same pre-existing chunk-size warning only
npm run lint    → exit 0, no output
npm run test    → Test Files 10 passed (10); Tests 76 passed (76)
```
No truncation, no regressions. Matches the note's reported output exactly
(note reported `built in 5.07s`; timing differs trivially run-to-run, same
warning, same pass counts).

## Static code review (read the 4 files directly, not the note's description)

**(a) `useVisits.ts` genuinely calls the API and caches on the store —
CONFIRMED.** Full file read. `getData()` calls
`handleBase({ method: 'get', url: 'candidate/visits' }, ...)` (services/base.js
prefixes with hardcoded `subURL = 'api/v1/'` → real request path
`api/v1/candidate/visits`, matches backend contract in the note). On success:
`count.value = data?.count ?? 0; candidate.setCandidateByField({ visitCount: count.value })`.
`setCandidateByField`/`getCandidate` verified to genuinely exist on
`src/stores/candidate.ts` (not invented). Null-check (`!== null`), not
falsy-check, guards the fetch-once behavior — a real cached `0` won't
re-trigger a fetch, correctly avoiding the `useDocument`-style falsy-check
bug class the file's own comment calls out.

**(b) `LayoutDefault.vue` calls `useVisits()`; `PageHome.vue` does NOT —
CONFIRMED BY GREP**, not by trusting the note:
```
grep -n "useVisits" src/pages/_layouts/LayoutDefault.vue
  17:import { useVisits } from '@/composables/useVisits'
  33:const { count: cvViewCount } = useVisits()
grep -n "useVisits" src/pages/home/PageHome.vue
  12: (comment only) / 55: (comment only) — no import, no call
grep -n "^import" src/pages/home/PageHome.vue  → no useVisits import at all
```
`PageHome.vue`'s `cvViewCount` is `computed(() => info.value?.visitCount ?? 0)`
— reads the cache only. No duplicate fetch.

**(c) `.env.development` unchanged — CONFIRMED.**
`git diff staging -- .env.development` → empty output. The implementer's
claimed temporary edit during live testing was genuinely reverted before
this branch's diff was finalized.

**(d) Disclosure copy no longer makes the false "always 0" claim —
SUBSTANTIVELY CONFIRMED**, with one minor note-accuracy nit: the note
quotes the original copy as literally "Hiện sẽ luôn là 0" ("will always be
0"); the actual original text on `staging` (verified via
`git show staging:src/pages/home/PageHome.vue`) was
`"CV ẩn danh của bạn được nhà tuyển dụng xem khi tìm kiếm ứng viên (chưa có
API đếm lượt xem thật, tạm hiển thị 0)"` — a paraphrase-quality mismatch (the
note's English gloss captures the substance correctly — no real API meant
the number was permanently pinned at 0 — but isn't a verbatim quote of the
Vietnamese original). Not treated as evidence fabrication: the *outcome* the
note claims (old text implied a permanently-0 count; new text
`"Số này sẽ không tăng qua app hiện tại — trang xem hồ sơ công khai qua link
chia sẻ chưa được xây dựng ở frontend, chưa có nơi nào ở đây gọi API ghi
nhận lượt xem."` is accurate and no longer an absolute claim) is verified
true by direct diff read. Logged as a minor precision gap, not grounds for
REOPEN.

## Live browser verification (not re-run, per operator instruction)
Not redone — hits the real deployed backend with a throwaway account,
unnecessary given the static review above independently confirms the code
does what the note claims. Judged on internal consistency/specificity
instead: exact curl-shaped request/response pairs quoted
(`{"count":0,"visits":[]}` → `{"count":1,...}`), a specific CDP technique
cross-referenced to a named prior precedent
(`issue-62-dark-mode-body-attr-override` in implementer `MEMORY.md`), a
specific root-cause explanation for a real corrected mistake (hash-nav vs.
`Page.reload` not re-initializing Pinia's `authStore`), and two direct DOM
text quotes (`"Lượt xem CV: 1"`, `"1\nlượt xem"`) rather than vague
assertions. Specific and internally consistent — credible corroboration,
and the precondition (static review confirms the code genuinely does what
the note claims) holds, so accepted as sufficient evidence per instruction.

## Acceptance criteria (from the note, cross-checked against diagram node)
| Criterion | Verified how | Result |
|---|---|---|
| Backend API real, matches composable's assumption | `url: 'candidate/visits'` in code + `subURL` prefix read directly | PASS |
| `LayoutDefault` fetches once, `PageHome` reads cache only | grep on both files | PASS |
| No stray env/branch side effect | `git diff staging -- .env.development` empty | PASS |
| Disclosure copy no longer literally false | diff read + `git show staging:...` for original text | PASS (minor note-quote nit only) |
| Build/lint/test green | independently re-run, matched | PASS |

## Forbidden states scan (agent-hub/CLAUDE.md)
| State | Hit? |
|---|---|
| `ADHOC_WORK` | No — node exists on diagram, went through implementer worker |
| `NO_EVIDENCE` | No — evidence note present |
| `EDIT_UNVERIFIED` | No — build/lint/test independently re-run and matched |
| `CODE_IN_HAVEN` | No — no `.ts`/`.js`/`.vue` under `haven/`, diagram row is status text only |
| `DIAGRAM_DRIFT` | No — diagram row added this diff, correctly still PENDING (implementer doesn't self-seal) |
| `MAIN_EDIT` | No — branch is `feature/dashboard-visit-count` |

## Seal gate
Note correctly records none needed — no commit/push/merge happened (branch
left uncommitted, deferred to `/ship`). Nothing to approve here.

## Ratchet
Node was `PENDING` (new node, never previously SEALED) → advancing to
`SEALED` is forward-only. `RatchetOnly` respected.

## Verdict
**SEAL.** Every acceptance criterion has citable evidence confirmed by
direct file/diff reads and independently reproduced command output, not
just the note's prose. No forbidden state hit. PM status updated on
`haven/diagrams/dev-loop.prime-mermaid.md`.
