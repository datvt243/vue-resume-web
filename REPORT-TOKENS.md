# REPORT-TOKENS.md — agent-hub token cost & duplicate-reading audit

Date: 2026-08-30
Scope: `vue-resume-web` (this repo) as primary subject, plus a read-only
check of 3 sibling projects at the operator's request.
Method note: `/hub-tokens`'s own script uses `bytes / 4` as a documented
proxy for token count (no real tokenizer available in this environment)
— good for spotting size regressions and comparing categories, not a
real billed-token number. Anything below marked "measured" uses this
proxy; anything marked "reported" is a real number the harness itself
returned (e.g. subagent usage).

---

## 1. What was measured — vue-resume-web

### 1a. `/hub-tokens` — BEFORE this session's cleanup
```
READ EVERY WORKER SESSION (recurring cost):
  root files (NORTHSTAR/CLAUDE/etc)            11574 B  ~    2893 tok
  doctrine/                                    26765 B  ~    6691 tok
  haven/diagrams/ (active file only)           30122 B  ~    7530 tok
  haven/workers/implementer/                   12608 B  ~    3152 tok
  haven/workers/verifier/                       5130 B  ~    1282 tok
  = per-session total                          86199 B  ~   21549 tok

COLD STORAGE (opened on demand only):
  haven/diagrams/*archive*                     41638 B  ~   10409 tok
  evidence/implementer/                       241162 B  ~   60290 tok
  evidence/verifier/                          214339 B  ~   53584 tok
  = cold storage total                        497139 B  ~  124284 tok

TOTAL agent-hub/ on disk: 583338 B  ~145834 tok
Recurring per-session cost: 86199 B  ~21549 tok (15% of total)

FLAG: ⚠ dev-loop.prime-mermaid.md is 30122B (>15KB threshold),
      8 full SEALED entries not yet archived
```

### 1b. `/hub-tokens` — AFTER this session's archiving pass
```
haven/diagrams/ (active file only): 13000 B  ~3250 tok  (was 30122B/7530tok)
haven/diagrams/*archive*:           99944 B  ~24986 tok (was 41638B/10409tok — moved, not deleted)

FLAG: ✓ dev-loop.prime-mermaid.md is 13000B, under the 15KB threshold
```
Recurring per-session cost drops from **~21,549 → ~17,269 tok** (the
diagram's own contribution: 7,530 → 3,250 tok). Total bytes on disk is
unchanged (nothing was deleted, only moved to cold storage) — only the
**recurring** cost every implementer/verifier session pays actually
shrank.

### 1c. Real (reported, not measured) token numbers seen this session
- Verifier subagent for `issue-7-veeform-component-tests`: **47,071
  tokens**, 14 tool calls, 77s — a fresh subagent re-reading the entire
  hub from zero, by design (`NeverVerifyOwnWork`).
- Main-thread (this conversation)'s own token usage for a specific task
  slice: **not measurable** — no introspection tool exposes that,
  distinct from the file-size proxy above.

---

## 2. Duplicate/redundant reading found this session

| # | What | Cause | Fixed this session? |
|---|---|---|---|
| 1 | `agent-hub/CLAUDE.md` content appeared twice in context during `/boot` | Explicit `cat` by the assistant, THEN the harness's own automatic nested-CLAUDE.md injection (triggers once any file under `agent-hub/` is touched) — same content landed twice | ✅ `boot/SKILL.md` step 2 rewritten to rely on the auto-injection, no explicit read |
| 2 | Diagram file (`dev-loop.prime-mermaid.md`) re-surfaced almost in full (~90 lines) after the verifier subagent edited it | Harness's "file was modified externally" notice reprints the changed region — size scales with the file's own size | ✅ indirectly — file is now 13KB instead of 30KB, so future re-surfacing events are smaller |
| 3 | 2 wasted `ls -lat <dir>` calls on `evidence/implementer/` and `evidence/verifier/` returned the wrong (repo-root) listing, had to retry with `find` | Environment/shell quirk in this sandbox, reproducible | ✅ `boot/SKILL.md` step 7 now specifies the proven `find`-based command |
| 4 | Every verifier subagent (and every fresh implementer session) re-reads the full hub bootstrap bundle from zero — the single largest recurring "duplication" in the whole system | Deliberate: `NeverVerifyOwnWork` requires the verifier to have zero shared context with the implementer | Not "fixed" — this is the correctness/cost trade-off the hub is built on. Only lever available: keep what gets re-read as small as possible (→ item 1a/1b above) |

---

## 3. What was fixed this session (repo: vue-resume-web)

1. **Archived 7 SEALED nodes** (dated 2026-08-29) from
   `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` into
   `dev-loop-archive.md`, verbatim, no rewording. Active diagram:
   30,122B → 13,000B.
2. **`.claude/skills/boot/SKILL.md` step 2** — stopped instructing an
   explicit read of `agent-hub/CLAUDE.md` (the harness auto-injects it).
3. **`.claude/skills/boot/SKILL.md` step 7** — replaced `ls -lat <dir>`
   with the proven-reliable `find <dir> -maxdepth 1 -type f -name "*.md"
   -exec ls -t {} +` for listing recent evidence notes.

Branch: `chore/agent-hub-token-cleanup` (from `main`, separate from the
still-unshipped `feature/vitest-veeform-tests`). `npm run build` →
green (`✓ built in 4.85s`), no app code touched. Evidence:
`agent-hub/evidence/implementer/2026-08-30-agent-hub-token-cleanup.md`.
Not yet shipped — awaiting `/ship`.

---

## 4. Sibling-repo check (read-only, operator-requested)

Reused the same `/hub-tokens` byte-counting script against each repo's
own `agent-hub/`. No files in these repos were modified — measurement
only.

### `datvt243.github.io`
```
READ EVERY WORKER SESSION (recurring cost):
  root files                                    9753 B  ~    2438 tok
  doctrine/                                    20972 B  ~    5243 tok
  haven/diagrams/ (active file only)           14722 B  ~    3680 tok
  haven/workers/implementer/                    9270 B  ~    2317 tok
  haven/workers/verifier/                       5167 B  ~    1291 tok
  = per-session total                          59884 B  ~   14971 tok

COLD STORAGE: 272438 B ~68109 tok
TOTAL: 332322 B ~83080 tok

FLAG: ✓ dev-loop.prime-mermaid.md is 14722B, under 15KB threshold
      (7 full SEALED entries, 10 archived pointers)
```
**Status: healthy, no action needed.**

### `ResumeAPI/backend`
```
READ EVERY WORKER SESSION (recurring cost):
  root files                                    9152 B  ~    2288 tok
  doctrine/                                    13370 B  ~    3342 tok
  haven/diagrams/ (active file only)           24649 B  ~    6162 tok
  haven/workers/implementer/                    6431 B  ~    1607 tok
  haven/workers/verifier/                       4828 B  ~    1207 tok
  = per-session total                          58430 B  ~   14607 tok

COLD STORAGE: 317968 B ~79492 tok
TOTAL: 376398 B ~94099 tok

FLAG: ⚠ dev-loop.prime-mermaid.md is 24649B (>15KB threshold),
      7 full SEALED entries not yet archived
```
**Status: same pattern as vue-resume-web BEFORE this session's fix.**
Recommend the same archiving pass, run from within that repo's own hub
session (not done here — separate repo, separate worker identity, out
of this task's authorization which was "kiểm tra" / check, not fix).

### `agent-hub-init`
No `agent-hub/` directory. This is a **template/scaffold repo**
(`agent-hub-structure.md`, `agent-hub-templates.md`,
`init-agent-hub-prompt.md`, `CLAUDE.md`, etc.) used to bootstrap a NEW
hub in some other project — not itself a live hub instance. The
token-measurement script does not apply here; nothing to report.

---

## 5. Recommendations (not yet acted on)

- **`ResumeAPI/backend`**: run the same archive pass (7 SEALED nodes,
  same shape of fix as here) — needs a session working directly in that
  repo.
- **General**: re-run `/hub-tokens` periodically (the active diagram file
  header now says so explicitly) rather than waiting for it to be
  noticed indirectly through duplicate-reading symptoms.
- **Verifier re-read cost (~17K–21K tok/session recurring)** is accepted
  as a deliberate trade-off for `NeverVerifyOwnWork` correctness — no
  further action recommended beyond keeping the recurring-read files
  (NORTHSTAR/doctrine/diagram/worker bundles) as lean as possible.
