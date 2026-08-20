---
node: issue-6-api-url-env-vars
worker: verifier
date: 2026-08-20
verdict: SEAL
---

## Acceptance criteria checked
1. `NeverVerifyOwnWork` — phiên này không viết diff đang xét (viết bởi
   implementer session khác). Pass.
2. Branch check (`NoMainEdit`, step 7b) — note ghi rõ branch
   `fix/issue-6-api-url-env-vars`. Tự chạy `git branch --show-current` độc
   lập → khớp chính xác, không phải `main`. Pass.
3. **Crux claim — asymmetry `Header.vue`:** note claim `getMe()` build URL
   `${host}api/me/${email}` (KHÔNG qua `api/v1/`), còn `getFile()` build
   `${host}api/v1/download-pdf?token=...` (CÓ `api/v1/`) — tự đọc thẳng
   `src/pages/_layouts/Header.vue` (dòng 26-32), xác nhận đúng 100%:
   `getMe()` → `` `${this.host}api/me/${_user.email}` ``, `getFile()` →
   `` `${this.host}api/v1/download-pdf?token=${_token}` ``. Nếu gộp
   `api/v1/` vào `VITE_API_URL` như ví dụ nguyên văn trong issue #6,
   `getMe()` sẽ vỡ thành `.../api/v1/api/me/...`. Deviation của implementer
   khỏi ví dụ trong issue là CÓ CĂN CỨ THẬT, không phải suy luận khống.
4. `src/config/api.config.js` — tự đọc, xác nhận đúng 2 dòng:
   `export const API = import.meta.env.VITE_API_URL` và
   `export const subURL = 'api/v1/'`. Logic cũ
   `window.location.hostname === 'localhost' ? ... : ...` đã biến mất hoàn
   toàn — `git diff main -- src/config/api.config.js` xác nhận (xoá 3 dòng,
   thêm 1 dòng).
5. `.env.development`/`.env.production` — tự `cat` cả 2 file, khớp chính
   xác claim: `VITE_API_URL=http://localhost:3001/` và
   `VITE_API_URL=https://nodejs-resume-api-ts.onrender.com/`, bare host,
   không có `api/v1/`.
6. `git diff main --stat` tự chạy độc lập: chỉ 3 file tracked thay đổi —
   `.env.production`, `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md`
   (implementer tự đặt `IN_PROGRESS` khi pick_next — khớp pattern các node
   trước), `src/config/api.config.js`. `.env.development` là file mới nên
   không tracked (`??` trong `git status`), không hiện trong
   `git diff --stat` mặc định — verify bằng `git add -N` (dry-run, revert
   ngay) để xác nhận nó thực sự chỉ thêm 1 dòng `VITE_API_URL=...`, không
   có nội dung lạ. `axios.ts`/`auth.ts`/`base.ts`/`Header.vue` — 0 diff so
   với `main`, khớp claim "KHÔNG sửa call site nào".
7. `.gitignore` claim — tự tạo `.env.production.local` rồi
   `git check-ignore -v .env.production.local` → khớp
   `.gitignore:13:*.local`, xoá file test ngay sau. Xác nhận đúng: không
   cần sửa `.gitignore`.
8. `npm run build` — tự chạy độc lập (sau khi xoá `dist/` cũ): `✓ built in
   5.36s`, chỉ có warning chunk-size pre-existing (không liên quan). Tự
   `grep -o "onrender.com[^\"']*" dist/assets/*.js` → có kết quả
   `onrender.com/`, khớp claim.
9. `npm run lint` — tự chạy độc lập: exit 0, không output.
10. `npm run dev` — tự khởi động độc lập (background), tự `curl
    http://localhost:5173/vue-resume-web/src/config/api.config.js` (KHÔNG
    tin output note) → response thật:
    `import.meta.env = {"VITE_API_URL": "http://localhost:3001/", ...}`,
    khớp claim dev mode đọc đúng `.env.development`. Đã kill process dev
    server ngay sau khi verify (xác nhận `pgrep -fl vite` → không còn tiến
    trình nào).
11. Secret check — tự đọc `.env.production`: chỉ có
    `VITE_API_URL=https://nodejs-resume-api-ts.onrender.com/`, domain
    public, không có token/credential nào.

## Finding — evidence-accuracy caveat (không chặn SEAL)
Note ghi `.env.production` là file "(mới)". Kiểm tra độc lập
(`git status --short` → `M` không phải `??`, và `git show
main:.env.production`) cho thấy file này ĐÃ TỒN TẠI trên `main` với nội
dung `BASE_URL=/vue-resume-web/` (không có dòng mới cuối file) — bị
implementer ghi đè hoàn toàn thành `VITE_API_URL=...`, không giữ dòng
`BASE_URL` cũ. Đây là claim sai trong note (modified, không phải new).

Không REOPEN vì không phải regression chức năng — đã verify 2 lý do độc
lập:
- `BASE_URL=/vue-resume-web/` vẫn còn nguyên trong `.env` (file base,
  Vite load ở MỌI mode, không riêng production) — giá trị không hề mất.
- Dù có mất, `vite.config.ts` dòng 6 gán
  `const base = process.env.BASE_URL || '/'` nhưng KHÔNG BAO GIỜ dùng biến
  `base` này — `base:` field trong `defineConfig` hardcode thẳng
  `'/vue-resume-web/'`. Dead code từ trước, không phụ thuộc
  `.env.production`.

Ghi nhận là lỗi mô tả trong evidence note (không phải "mới" mà là "ghi đè
nội dung cũ"), không phải lỗi chức năng, không chặn acceptance criterion
nào của issue #6.

## Forbidden states scan
6 state — không chạm cái nào: có node trên diagram trước khi bắt đầu
(không `ADHOC_WORK`), có evidence note implementer (không `NO_EVIDENCE`),
build/lint/dev đã tự chạy lại độc lập, output đọc nguyên văn không bị cắt
(không `EDIT_UNVERIFIED`), không có code lẫn vào `haven/` (không
`CODE_IN_HAVEN`), PM status cập nhật ngay sau verdict này (không
`DIAGRAM_DRIFT`), diff nằm trên `fix/issue-6-api-url-env-vars`, không phải
`main` (không `MAIN_EDIT`).

## Seal gate
Diff không chạm outward-facing (không commit/push/merge → main) ở bước
implementer này — không cần approval ở bước verify. Merge về `main` là
bước riêng, qua `/ship`.

## Verdict
SEAL.

## Re-verification (pass 2)
Second pass, fresh session, verifying only the "## Correction (sau SEAL
lần 1)" section of the implementer note — original SEAL content above left
untouched (never-delete doctrine).

1. `NeverVerifyOwnWork` — this session did not write the correction diff.
   Pass.
2. Branch (`NoMainEdit`, step 7b) — ran `git branch --show-current`
   independently → `fix/issue-6-api-url-env-vars`, not `main`. Pass.
3. `.env.production` content — `cat .env.production` →
   `BASE_URL=/vue-resume-web/` + `VITE_API_URL=https://nodejs-resume-api-ts.onrender.com/`,
   both lines present. `git diff main -- .env.production` confirms: old
   content `BASE_URL=/vue-resume-web/` (no trailing newline) kept intact,
   only `VITE_API_URL=...` line added. The line-loss from pass 1 is
   genuinely fixed, not just claimed.
4. `.env.development` — `cat` → only `VITE_API_URL=http://localhost:3001/`,
   no `BASE_URL` (correctly, since it never had one to lose). Confirmed
   genuinely new: `git show main:.env.development` → `fatal: path
   '.env.development' exists on disk, but not in 'main'`.
5. `src/config/api.config.js` — unchanged from pass-1 verification: `export
   const API = import.meta.env.VITE_API_URL` / `export const subURL =
   'api/v1/'`, no hostname conditional.
6. `npm run build` — ran independently after `rm -rf dist`: `✓ built in
   4.75s`, only pre-existing chunk-size warning. `grep -o
   "onrender.com[^\"']*" dist/assets/*.js` → `dist/assets/index-_zg9pd-w.js:onrender.com/`.
   Production URL still correctly baked in after the `.env.production`
   fix.
7. `npm run lint` — ran independently: exit 0, no output.
8. `git diff main --stat` → exactly `.env.production` (modified, now
   correctly — not silently destroyed), `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md`
   (modified — IN_PROGRESS marker, same pattern as other nodes), `src/config/api.config.js`
   (modified). `git status --short` additionally shows untracked
   `.env.development` (new, as expected — untracked files don't show in
   `diff --stat` against a commit) and the two evidence `.md` files under
   `agent-hub/evidence/`. No unexpected files.
9. `vite.config.ts` sanity check (independent read, not evidence-only —
   this is my own judgment call per the recipe, not re-litigating pass 1's
   crux claim): line 6 `const base = process.env.BASE_URL || '/'` is
   assigned but the identifier `base` does not appear anywhere else in the
   file — the `base:` key inside `defineConfig` (line 10) is a separate
   hardcoded string literal `'/vue-resume-web/'`. Confirms the "BASE_URL
   is dead code" reasoning from pass 1 was correct — though moot now since
   the line was restored anyway.

## Forbidden states scan (pass 2)
No `ADHOC_WORK` (node exists, evidence note exists), no `NO_EVIDENCE`, no
`EDIT_UNVERIFIED` (build/lint/grep re-run independently, output read in
full, not truncated), no `CODE_IN_HAVEN`, no `DIAGRAM_DRIFT` (diagram row
updated below to resolve the caveat text), no `MAIN_EDIT` (branch
confirmed `fix/issue-6-api-url-env-vars`).

## Diagram update
Edited the existing SEALED row for `issue-6-api-url-env-vars` in
`haven/diagrams/dev-loop.prime-mermaid.md` — per `RatchetOnly` did NOT
change SEALED status (already SEALED, stays SEALED), only appended a
"CẬP NHẬT (re-verify pass 2, sau correction)" sentence noting the caveat
is resolved, with evidence cited.

## Verdict (pass 2)
SEAL.
