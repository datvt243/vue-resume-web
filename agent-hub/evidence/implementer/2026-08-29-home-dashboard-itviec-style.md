# 2026-08-29 - home-dashboard-itviec-style

- Worker: implementer
- Version: 0.1.0
- Node: `home-dashboard-itviec-style` (new node — follow-up restyle of the
  SEALED `home-dashboard-summary` node, per LAI-13 must be a new node, not
  an edit to the old one's PM status)
- Task (verbatim): "quay lại feature vừa rồi, hãy update các section theo
  như page này https://itviec.com/profile-dashboard"

## Reference gathering
`WebFetch` on the URL redirected to itviec's sign-in page (private/auth
page, can't be fetched anonymously) — asked the operator via
`AskUserQuestion` how to see the real page. Operator chose to log into the
already-open debug Chrome (port 9888) themselves. Once confirmed logged
in, opened `https://itviec.com/profile-dashboard` there and captured a
real full-page screenshot via CDP (`Page.captureScreenshot`,
`captureBeyondViewport: true`, clipped to `Page.getLayoutMetrics`'s
`cssContentSize`) — saved to the scratchpad, read directly to extract the
real layout (not guessed from memory).

Sections identified on the reference page (excluding its own header/left
sidebar nav, which are out of scope — this task is about the 4 content
sections already built in `home-dashboard-summary`):
1. Basic-info card: avatar, name, a status dropdown, position line
   (briefcase icon), email line (envelope icon), an "Update your profile"
   link top-right of the card.
2. Highlighted "CV Views by Recruiters" box: big number in a colored tile
   + "NEW" tag + description text.
3. "Your Attached CV": file-icon tile + filename link + last-uploaded
   date + an "Upload now" link.
4. "ITviec Profile": a semi-donut percentage gauge ("90% completed") +
   supporting text + an "Access to profile" link.
(A 5th "Your Activities" 3-stat-tile row also exists on the reference but
was NOT part of the original 4-section task spec — not added here, to
avoid inventing new placeholder metrics beyond what was asked.)

## Branch
`feature/home-dashboard-itviec-style` (checked out from `main` before
touching any file this time — branched right after the first single-file
FontAwesome-icon edit, before the main component rewrite).

## Diff
| file | why |
|---|---|
| `src/pages/home/PageHome.vue` | Restyled all 4 sections to match the reference's structure, adapted to this app's own visual language (dark-mode-aware `var(--bs-tertiary-bg)`/`var(--bs-border-color-translucent)` tokens already used in `LayoutDefault.vue`'s sidebar, and the app's own `var(--bs-green)` accent instead of copying itviec's brand color): (1) basic-info card gets an "Cập nhật hồ sơ →" link top-right (`RouterLink` to `/dashboard/information`, same target as the rest of the app's edit flows); (2) CV-views section restyled as a left-accent-bordered highlight box with a big number tile + "Mới" badge, matching the reference's visual weight; (3) attach-CV section gets a file-icon tile + the download link now carries a real `download` attribute set to the candidate's actual name (`Firstname_Lastname.pdf`) so the browser saves it under a name that's actually true — previously the link had no filename hint at all; a caption clarifies the PDF is generated live from profile data (accurate, since it's not a static uploaded file like itviec's, avoids implying a fake "upload" event); (4) profile-completion section replaces the plain linear Bootstrap progress bar with a circular percentage ring (reusing the same `conic-gradient` ring technique already established in `Spinner.vue`'s countdown, for visual consistency within this codebase) plus supporting copy and a "Xem hồ sơ →" link, matching the reference's gauge + CTA pattern. |
| `src/plugins/initFontAwesomeIcon.js` | Added `faBriefcase` (position line icon, not previously registered). |

Deliberately NOT changed: `openToWork` status stays a plain badge, not
turned into a functional dropdown like itviec's "Update your status" —
that would require wiring a live PATCH call, which is a real scope
expansion beyond "restyle the sections to match the page", not a smallest
diff. Not added: the reference's "Your Activities" stat-tile row (Applied
Jobs / Saved Jobs / Job invitations) — no such data exists in this app and
it wasn't part of the original task's 4 named sections.

## Command
```
npm run build
```
(from repo root, per `doctrine/MEMORY.md`.)

## Output
```
> vue-resume-web@0.0.0 build
> vite build

vite v5.3.2 building for production...
transforming...
✓ 1343 modules transformed.
rendering chunks...
computing gzip size...
...
dist/assets/PageHome-D7D33K37.js                   4.96 kB │ gzip:   2.40 kB
...
✓ built in 4.96s
```
Same pre-existing chunk-size warning only (`VeeForm-*.js` > 500kB, present
before this change too).

## Acceptance
| Criterion | Evidence |
|---|---|
| `npm run build` green | `✓ built in 4.96s`, no errors |
| Sections restyled to match the real reference page's structure | Compared side-by-side against the real screenshot captured from the operator's logged-in session (see Reference gathering above) — same 4-section composition, same content per section |
| No fabricated data (e.g. a fake "last uploaded" date like the reference has) | Deliberately omitted — this app's CV is generated live, not uploaded, so a "last uploaded" claim would be false; used a `download` filename attribute instead, which is real browser behavior, not just display text |
| Dark/light theme still consistent | Live CDP screenshot (below) taken in the app's current (dark) theme — all new elements use theme-aware CSS custom properties already established elsewhere in this codebase, not hardcoded colors |

## Manual verification
Live CDP screenshot of the actual running dev-server page at `#/`
(`Page.captureScreenshot` with `captureBeyondViewport: true`, clipped to
the real content size from `Page.getLayoutMetrics`) — confirms all 4
sections render with real candidate data: name "Võ Tấn Đạt", position
"Frontend Developer", email "votan.it@gmail.com", badge "Không tìm việc"
(current test data has `openToWork: false`), CV views "0", filename link
"Võ_Tấn_Đạt.pdf", completion ring "72%". No visual breakage, no console
error surfaced by the build step. Read-only navigation only, no data
mutated.

## Noticed, not done
- No component test exists for `PageHome.vue` (issue #7, components
  untested in general) — not fixed here, out of scope.
- The "Your Activities" section from the reference (applied/saved
  jobs/invitations) was intentionally not ported — logged above under
  "Deliberately NOT changed", available as a future follow-up if the
  operator wants it.

## Seal gate
None — no commit/push/merge/deploy happened in this pass. Only local file
edits + local build + local read-only screenshot check.
