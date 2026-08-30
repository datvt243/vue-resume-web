# Evidence — verifier seal: github-pages-base-path-rename

Date: 2026-08-31
Worker: verifier
Branch verified: `fix/issue-pages-base-path`
Node: `github-pages-base-path-rename`
Verdict: **SEAL**

## Method
Independent re-derivation, not trust of the implementer's evidence note
(`evidence/implementer/2026-08-31-github-pages-base-path-rename.md`).
Every command below was run fresh in this session.

## 1. Branch check
```
$ git branch --show-current
fix/issue-pages-base-path
```
Confirmed on the correct branch.

## 2. Diff scope
```
$ git diff staging --stat
 agent-hub/haven/diagrams/dev-loop.prime-mermaid.md |   1 +
 package-lock.json                                  |   4 +-
 package.json                                        |   2 +-
 vite.config.ts                                       |   4 +-
 yarn.lock                                            | 952 +++++++++++++++++++--
 5 files changed, 876 insertions(+), 87 deletions(-)
```
In-scope files for this node: `vite.config.ts` (the fix) and
`package.json` (name sync, cosmetic, flagged by implementer). The
`agent-hub/haven/diagrams/...` line is this verifier's own PENDING→SEALED
edit, made after the checks below passed. `package-lock.json`/`yarn.lock`
are the pre-existing uncommitted `staging` changes the implementer
stashed onto this branch per operator instruction — not this node's
diff, not touched or examined further here, per task instructions.

`git diff staging -- package.json`:
```diff
-    "name": "vue-resume-web",
+    "name": "resume-vuejs-website",
```
Matches the claim — cosmetic name sync only.

`git diff staging --name-only` confirms no file under `src/` appears —
zero unrelated app-code changes.

## 3. vite.config.ts read directly
```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const base = process.env.BASE_URL || '/resume-vuejs-website/'

export default defineConfig({
    plugins: [vue()],
    base,
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            components: path.resolve(__dirname, 'src/components'),
            views: path.resolve(__dirname, 'src/views'),
        },
    },
})
```
Confirmed: no hard-coded `/vue-resume-web/` anywhere in the file. `base`
constant now defaults to `/resume-vuejs-website/` and is actually wired
into `defineConfig({ base })` (previously this const existed but was
dead code — line 10 had a literal string instead).

## 4. Live GitHub Pages status
```
$ gh api repos/datvt243/resume-vuejs-website/pages
{"url":"https://api.github.com/repos/datvt243/resume-vuejs-website/pages",
"status":"built","cname":null,"custom_404":false,
"html_url":"https://datvt243.github.io/resume-vuejs-website/",
"build_type":"legacy","source":{"branch":"gh-pages","path":"/"},
"public":true,"protected_domain_state":null,
"pending_domain_unverified_at":null,"https_enforced":true}
```
`status: "built"`, `html_url` matches the new repo name. Pages
infrastructure itself is healthy (matches implementer's root-cause
diagnosis that this was never a Pages-config problem).

## 5. Fresh build + dist path check
```
$ rm -rf dist && npm run build
...
✓ built in 4.50s
```
Only the pre-existing "chunks larger than 500 kB" warning (VeeForm
chunk) — known, unrelated, present before this change.

```
$ grep -o '/resume-vuejs-website/[^"]*' dist/index.html
/resume-vuejs-website/favicon.png
/resume-vuejs-website/assets/index-DTuaUGlH.js
/resume-vuejs-website/assets/index-r57Lbdk2.css

$ grep -o '/vue-resume-web/[^"]*' dist/index.html
(no output, exit code 1)
```
Confirmed: 3 asset references, all under the new path. Zero references
to the old `/vue-resume-web/` path. This is the direct evidence that the
blank-page symptom (asset 404s under the mismatched old base path) is
fixed.

## 6. Unrelated src/ code
`git diff staging --name-only` (see check 2) — no `src/**` file appears
in the diff. Confirmed scope is exactly `vite.config.ts` + `package.json`
(+ the pre-existing lockfile stash, +this verifier's diagram edit).

## Conclusion
All 6 checks pass independently, matching the implementer's claims with
directly re-run commands (not paraphrase). Diff is minimal, root cause
correctly diagnosed and fixed, build is green, dist output verified
clean of the old path. No unrelated code touched.

**SEAL.** No outward-facing action taken by this verifier (no commit,
push, or merge) — that stays behind the Seal Gate for the operator via
`/ship`.
