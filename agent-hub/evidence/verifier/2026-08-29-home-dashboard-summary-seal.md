# 2026-08-29 - home-dashboard-summary - SEAL

- Worker: verifier
- Version: 0.1.0
- Node: `home-dashboard-summary`
- Verdict: **SEAL**

## Refusal check
This session did not write the diff under review — launched fresh as a
verifier subagent specifically to verify this node. `NeverVerifyOwnWork`
satisfied by construction.

## Note read
`evidence/implementer/2026-08-29-home-dashboard-summary.md`.

## Independent re-verification (not trusting the note blindly)

1. **Build**: re-ran `npm run build` myself on
   `feature/home-dashboard-summary` → `✓ built in 4.78s`, no errors, full
   untruncated output read, same pre-existing `VeeForm-*.js` > 500kB
   chunk-size warning only.
2. **Branch**: `git branch --show-current` → `feature/home-dashboard-summary`
   (not `main`). `git log --oneline main..feature/home-dashboard-summary`
   → empty (nothing committed yet, all changes still working-tree diffs).
3. **Diff scope**: `git diff main --stat` → exactly
   `src/pages/home/PageHome.vue` (+158/-3),
   `src/plugins/initFontAwesomeIcon.js` (+8), plus the diagram row. No
   scope creep beyond the task.
4. **Read the changed file directly** (`src/pages/home/PageHome.vue`,
   not just the note's description):
   - Section 1: `fullName`/`initials`/`email`/`position`/`isOpenToWork`
     all derive from `candidate.getCandidate` / `candidate.getGeneralInformation`
     (real computed getters, confirmed present in `src/stores/candidate.ts:20,43`)
     and `auth.getUser` (`src/stores/auth.ts:16,18`). Field names
     `positionDesired` and `openToWork` confirmed to exist for real in
     `src/models/generalInformation.model.ts:22,24` (the latter is the
     already-SEALED `open-to-work-field` node — reused correctly, not
     reinvented).
   - Section 2: `cvViewCount = 0` hardcoded, with an inline disclosure
     span in the template (`chưa có API đếm lượt xem, tạm hiển thị 0`).
   - Section 3 (the flagged claim — checked the code, not the note's
     description of it): `downloadCVUrl` builds the identical URL pattern
     to `Header.vue`'s real `_settings.getFile()`
     (`${host}api/v1/download-pdf?token=${token}`, byte-for-byte same
     construction, confirmed by reading `Header.vue:29-34` directly) — so
     the "current CV" link is real, not a stub. The "attach new file"
     path (`handleSelectFile`) only sets `selectedFileName.value` and
     calls `toast?.(...)` — grepped the function body and the whole file
     for any `axios`/`fetch`/API import used in that path: none. No
     network call is made on file select. The disclosure toast
     (`toast?.({ message: ..., bg: 'info' })`) calls into the real
     `provide('toast', showToast)` wired in `App.vue:71-77`
     (`showToast({ message, bg })` — matching signature, confirmed by
     reading `App.vue` directly), so the disclosure genuinely fires
     through the app's real toast mechanism, it isn't a no-op. There is
     also a second, permanent inline disclosure line below the buttons
     in the template. Conclusion: the stub does exactly what the
     operator approved — shows the picked filename, discloses
     non-persistence twice (toast + inline text), and never silently
     pretends to upload. Claim in the note holds.
   - Section 4: `profileCompletion = 72` hardcoded, rendered in a real
     Bootstrap progress bar, with an inline disclosure line under it.
5. **Router/Header claim checked directly**: read
   `src/pages/_layouts/Header.vue` (logo `href="#"`) and
   `src/routers/index.ts` (`{ path: '/', ..., meta: { requiresAuth: true } }`)
   — confirms the reported symptom was dead placeholder page content at
   `/`, not a routing bug; the note's decision to leave the logo
   link/router untouched is correct, not a missed fix.
6. **Icon registration**: `src/plugins/initFontAwesomeIcon.js` — `faUser`,
   `faPaperclip`, `faCircleCheck`, `faCircleXmark` all imported and added
   to the library, matching the note. Minor nit (not blocking): `faUser`
   is registered but not actually referenced anywhere in `PageHome.vue`
   (the avatar fallback renders text initials, not an icon) — harmless
   unused import, no functional or build impact, doesn't affect any
   acceptance criterion.

## Acceptance criteria
| Criterion | Verified how |
|---|---|
| `npm run build` green | Re-ran myself, `✓ built in 4.78s`, no errors |
| Section 1: avatar/name/position/open-to-work/email, real data | Read `PageHome.vue` + `candidate.ts`/`auth.ts`/`generalInformation.model.ts` directly, all wiring confirmed real |
| Section 2: view count = 0, disclosed | Read template directly, hardcoded + inline disclosure confirmed |
| Section 3: real download + non-persisting attach stub, honestly disclosed | Read code directly: download link reuses real endpoint (matches `Header.vue`); attach path has zero network calls; toast disclosure wired to the real `App.vue` toast provider; second inline disclosure also present |
| Section 4: sample completion %, disclosed | Read template directly, hardcoded `72` + inline disclosure confirmed |

## Forbidden states scan
| State | Result |
|---|---|
| `ADHOC_WORK` | No — node exists on `dev-loop.prime-mermaid.md`, task went through `/worker implementer` |
| `NO_EVIDENCE` | No — implementer note present and complete |
| `EDIT_UNVERIFIED` | No — build output read back verbatim by both implementer and this verifier session (re-run independently, not just re-quoted) |
| `CODE_IN_HAVEN` | No — `git status --short` shows only `src/pages/home/PageHome.vue`, `src/plugins/initFontAwesomeIcon.js`, plus hub bookkeeping (diagram + evidence notes) |
| `DIAGRAM_DRIFT` | Resolved by this SEAL — PM status now matches the shipped diff |
| `MAIN_EDIT` | No — `git branch --show-current` → `feature/home-dashboard-summary`, confirmed by this session directly, zero commits on the branch |

## Proportionality (`SmallestDiff`)
Diff is exactly one page rewrite + one icon-registration addition. No
untasked fixes bundled in (router/Header.vue correctly left alone, with
evidence for why).

## Seal gate
No outward-facing action in this pass (nothing committed — `git log
main..feature/home-dashboard-summary` is empty). Nothing to gate —
commit/merge to `main` deferred to `/ship`, per the note.

## PM status
Updated `haven/diagrams/dev-loop.prime-mermaid.md`:
`home-dashboard-summary` `IN_PROGRESS` → `SEALED`.
