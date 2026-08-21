> Evidence is who did what and why (`NO_EVIDENCE` if missing). Every
> worker action ends with a note.

## Layout
```
evidence/implementer/<date>-<slug>.md
evidence/verifier/<date>-<slug>-{seal|reopen}.md
```
Date as `YYYY-mm-dd`, slug kebab-case derived from the task name. Flat
files — no nested `<date>/` subfolder (this is the convention actually
used by every note in this directory; ignore any older doc that says
otherwise).

## Format — implementer note
- Title (date - node) · Worker · Version · Node (points to the diagram) ·
  Task (verbatim prompt)
- `## Branch` — the dedicated branch checked out from `main` before
  changing any file (required — see `CLAUDE.md` → Branching rule; missing
  this line = verifier REOPEN with `MAIN_EDIT`)
- `## Diff` — files | file | why |
- `## Command` — the exact command from `doctrine/MEMORY.md` (e.g. `npm
  run build` from repo root — this project has no separate test command)
- `## Output` — verbatim, no paraphrasing
- `## Acceptance` — table | Criterion | Evidence | (evidence points to a
  specific output line — never just say "build passed," quote it
  verbatim, e.g. `✓ built in 3.21s`)
- `## Noticed, not done` — things spotted outside scope but not fixed
  (e.g. another trap in `doctrine/domains/PROJECT.md` not part of this
  task)
- `## Seal gate` — record the approval if there's an outward-facing
  action (commit/push/deploy), or "none"

## Format — verifier verdict
- Worker · Node · New PM status (PENDING/SEALED/REOPEN)
- `## Reasoning` — cite evidence for each criterion
- `## Missing` — only present on REOPEN

## The three rules of this directory
1. **VERBATIM, ALWAYS** — never claim something without a real citable
   quote.
2. **NEVER DELETE** — a wrong note gets a correction appended, not
   deleted.
3. **BAD NOTES STAY** — a "task failed" note is kept; a clean trail
   matters less than preserving the doctrine's actual value.

## Language
New notes from 2026-08-22 onward should be written in English (see
`NORTHSTAR.md` → Language & token policy) — concise, facts first. Notes
written before that date stay in Vietnamese as historical record; don't
retranslate them, only append corrections in English if they need one.
