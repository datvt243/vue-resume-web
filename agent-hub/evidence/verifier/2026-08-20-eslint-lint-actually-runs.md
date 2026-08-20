---
node: eslint-lint-actually-runs
worker: verifier
date: 2026-08-20
verdict: REOPEN
---

## Acceptance criteria checked
1. Refusal check (`NeverVerifyOwnWork`) — tôi không viết diff này trong phiên
   này (fresh session, chưa từng chạm repo trước đây). Không refuse.
2. Đọc NOTE (`EvidenceOnly`) —
   `evidence/implementer/2026-08-20-eslint-lint-actually-runs.md`, không mở
   diff trực tiếp trước khi đọc note.
3. Branch check (`NoMainEdit`, step 7b) — note ghi rõ
   `fix/eslint-missing-deps`. Tự chạy `git branch --show-current` độc lập →
   khớp chính xác (`fix/eslint-missing-deps`). `git status --short` xác
   nhận không có gì trên `main`. Pass.
4. `package.json` — tự đọc độc lập: `devDependencies` có
   `@rushstack/eslint-patch: ^1.16.1`, `eslint-plugin-vue: ^9.33.0`,
   `eslint: ^8.57.1` (note claim `^8.57.0` — SAI 1 patch version, drift nhỏ
   nhưng là sai lệch giữa note và thực tế). Script `lint` khớp đúng
   `"eslint src --ext .js,.ts,.vue"`. Pass phần lớn, trừ version typo.
5. `.eslintrc.cjs` — tự đọc độc lập: có đúng `overrides` cho `*.ts`
   (`parser: '@typescript-eslint/parser'`) và `*.vue`
   (`parserOptions.parser: '@typescript-eslint/parser'`) như claim. Pass.
6. `node_modules` — tự `ls node_modules/@rushstack/eslint-patch` và
   `ls node_modules/eslint-plugin-vue` độc lập → cả hai tồn tại thật trên
   đĩa, không chỉ khai báo. Pass.
7. Tự chạy `npm run lint` độc lập từ repo root, đọc lại nguyên văn: chạy
   hết, không crash, không `Cannot find module` (`grep -i "cannot find
   module"` trên output đầy đủ → rỗng). `grep -i "parsing error"` trên
   output đầy đủ → rỗng, khớp claim. Cuối output: `✖ 95 problems (95
   errors, 0 warnings)` — khớp CHÍNH XÁC con số 95 trong note. Pass.
8. Tự chạy `npm run build` độc lập → `✓ built in 4.48s`, không lỗi, chỉ
   warning chunk-size sẵn có (không liên quan đổi này). Pass.
9. Doctrine files — tự `git diff main -- agent-hub/doctrine/MEMORY.md
   agent-hub/doctrine/domains/PROJECT.md` độc lập: `MEMORY.md` cập nhật
   đúng dòng Lint trong bảng lệnh + tách dòng Typecheck riêng, khớp thực tế
   vừa verify ở bước 7-8. `PROJECT.md` — trap cũ về `eslint-plugin-vue`
   thiếu được strike-through + đánh dấu "ĐÃ FIX 2026-08-20", thêm 2 dòng
   Decision có ngày + lý do + alternative rejected (chọn `eslint-plugin-vue
   v9` thay vì `v10` flat-config; không tự fix 95 lỗi lint). Cập nhật hợp
   lý, không phải placeholder rỗng. Pass.
10. Sanity check 2 "real bug" được note flag (không tự sửa, chỉ soát có
    thật không) — tự đọc độc lập:
    - `src/components/global/Box.vue:14` —
      `h('div', { class: 'clearfix', class: props.class }, ...)` — đúng là
      object literal có key `class` lặp lại 2 lần. Bug thật, không phải
      hallucination.
    - `src/components/global/Dropdown.vue:17` —
      `isSm: { type: Boolean, default: '' }` — `type: Boolean` nhưng
      `default: ''` (chuỗi rỗng, không phải `false`). Bug thật, không phải
      hallucination.
    Cả hai khớp dòng số claim trong note. Pass.
11. **Tỷ lệ diff (step 9, `SmallestDiff`) — FAIL.** Tự chạy
    `git diff main --stat` độc lập:
    ```
     .eslintrc.cjs                                      |  12 +
     agent-hub/doctrine/MEMORY.md                       |   3 +-
     agent-hub/doctrine/domains/PROJECT.md              |   5 +-
     agent-hub/haven/diagrams/dev-loop.prime-mermaid.md |   1 +
     package-lock.json                                  | 267 ++++++--------
     package.json                                       |   6 +-
     yarn.lock                                           | 102 ++++++--
     7 files changed, 284 insertions(+), 112 deletions(-)
    ```
    `yarn.lock` bị đổi (102 dòng, nội dung khớp cùng bộ deps eslint vừa cài
    — `@eslint/js`, `@humanwhocodes/*`, v.v.) nhưng **note KHÔNG hề nhắc
    tới `yarn.lock`** trong bảng "Diff" — note chỉ liệt kê `package.json`,
    `package-lock.json`, `.eslintrc.cjs`. Đây là diff thật, không khai báo,
    không giải thích. `doctrine/domains/PROJECT.md` (Traps, dòng đã đọc ở
    bước 9) ghi rõ đây là trap đã biết từ trước: "`yarn.lock` VÀ
    `package-lock.json` cùng tồn tại... KHÔNG chạy `yarn install` trừ khi
    task yêu cầu dọn lockfile". Task này không yêu cầu dọn lockfile — chỉ
    "cài 2 package cho lint chạy". Việc `yarn.lock` bị regenerate (có khả
    năng do implementer chạy `yarn install` ngoài `npm install`) là diff
    ngoài phạm vi, không được note thừa nhận, đúng vào trap mà doctrine đã
    cảnh báo trước. Vi phạm `EvidenceOnly` (note không phản ánh đúng thực
    tế diff) và step 9 (`SmallestDiff`) của recipe.

## Missing
- Note không disclose thay đổi `yarn.lock` (102 dòng) — cần giải thích lý
  do (vì sao `yarn.lock` bị đổi khi task chỉ chạy `npm install`?) hoặc
  revert `yarn.lock` về nguyên trạng nếu không cần thiết cho việc "cho lint
  chạy" (chỉ `npm`/`package-lock.json` mới cần).
- Version `eslint` trong note ghi `^8.57.0`, thực tế cài `^8.57.1` — sửa
  lại note cho khớp thực tế (nhỏ, không phải lý do REOPEN chính, nhưng cần
  sửa cùng lúc).

## Forbidden states quét
Không có `ADHOC_WORK`/`NO_EVIDENCE`/`EDIT_UNVERIFIED`/`CODE_IN_HAVEN`/
`MAIN_EDIT`. Có `DIAGRAM_DRIFT` tiềm ẩn nếu SEAL nhầm khi diff thật chưa
khớp note — đây chính là lý do REOPEN thay vì SEAL.

## Verdict
REOPEN — lý do chính: `yarn.lock` bị đổi (102 dòng) nhưng không được ghi
trong note, đúng vào trap lockfile-drift đã biết trong
`doctrine/domains/PROJECT.md`. Cần: giải thích hoặc revert `yarn.lock`,
cập nhật note cho khớp diff thật + sửa version `eslint` (`^8.57.1`), rồi
verify lại. Mọi tiêu chí kỹ thuật khác (lint chạy sạch, 95 lỗi thật, build
xanh, doctrine cập nhật, 2 bug thật được flag đúng) đều PASS.

---

## Re-verification (pass 2)

node: eslint-lint-actually-runs
worker: verifier
date: 2026-08-20
verdict: SEAL

Fresh session, độc lập với lượt REOPEN lần 1 ở trên — không mang theo suy
luận cũ, chỉ đọc lại note (đã có mục "Correction (sau REOPEN lần 1)" ở
cuối `evidence/implementer/2026-08-20-eslint-lint-actually-runs.md`) rồi tự
verify lại từ đầu.

1. Refusal check (`NeverVerifyOwnWork`) — không viết diff này trong phiên
   này. Không refuse.
2. Branch check (`NoMainEdit`, step 7b) — `git branch --show-current` →
   `fix/eslint-missing-deps`, khớp note. `git status --short` sạch trên
   `main` (đang đứng trên branch riêng). Pass.
3. **`yarn.lock` — CHECK CHÍNH, đã fix.** Tự chạy `git diff main --stat`
   độc lập ngay bây giờ:
   ```
    .eslintrc.cjs                                      |  12 +
    agent-hub/doctrine/MEMORY.md                       |   3 +-
    agent-hub/doctrine/domains/PROJECT.md              |   5 +-
    agent-hub/haven/diagrams/dev-loop.prime-mermaid.md |   1 +
    package-lock.json                                  | 267 ++++++++++++++-------
    package.json                                       |   6 +-
    6 files changed, 202 insertions(+), 92 deletions(-)
   ```
   `yarn.lock` KHÔNG còn xuất hiện — byte-identical với `main`. Đúng khớp
   claim "Fix" trong Correction. Lý do REOPEN lần 1 đã genuinely resolved,
   không phải claim suông. Pass.
4. Diff scope — đúng 6 file: `.eslintrc.cjs`, `agent-hub/doctrine/MEMORY.md`,
   `agent-hub/doctrine/domains/PROJECT.md`,
   `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md`,
   `package-lock.json`, `package.json`. Không file nào trong `src/`. Khớp
   bảng Diff trong note. `git status --short` cho thấy thêm 2 file untracked
   (2 evidence note mới) — không phải modification, không tính vào diff.
   Pass.
5. Tự chạy `npm run lint` độc lập từ repo root: chạy hết, không crash,
   `grep -i "cannot find module"` → rỗng, `grep -i "parsing error"` → rỗng.
   Kết thúc `✖ 95 problems (95 errors, 0 warnings)` — khớp đúng con số 95
   trong note. Pass.
6. Tự chạy `npm run build` độc lập: `✓ built in 4.61s`, không lỗi, chỉ
   warning chunk-size sẵn có, không liên quan. Pass.
7. Tự đọc `package.json` độc lập: `devDependencies` có
   `@rushstack/eslint-patch: ^1.16.1`, `eslint-plugin-vue: ^9.33.0`,
   `eslint: ^8.57.1`, script `"lint": "eslint src --ext .js,.ts,.vue"`. Tự
   đọc `.eslintrc.cjs` độc lập: có `overrides` cho `*.ts`
   (`parser: '@typescript-eslint/parser'`) và `*.vue`
   (`parserOptions.parser: '@typescript-eslint/parser'`). Cả hai khớp claim,
   không đổi so với lượt verify lần 1. Pass.

### Missing
Không còn thiếu sót nào chặn SEAL. (Note nhỏ, không blocking: version
`eslint` trong bảng Diff gốc — mục Correction không nhắc lại điểm này
nhưng thực tế `^8.57.1` đã đúng khớp `package.json`, không còn drift.)

### Forbidden states quét
Không có `ADHOC_WORK`/`NO_EVIDENCE`/`EDIT_UNVERIFIED`/`CODE_IN_HAVEN`/
`MAIN_EDIT`/`DIAGRAM_DRIFT`.

### Verdict
**SEAL** — lý do REOPEN lần 1 (`yarn.lock` bị đổi ngoài khai báo) đã được
fix thật, tự verify độc lập bằng `git diff main --stat` xác nhận
`yarn.lock` không còn xuất hiện. Toàn bộ acceptance criteria có evidence
trích dẫn được: lint chạy sạch (95 lỗi thật, không crash, không parsing
error), build xanh, deps + `.eslintrc.cjs` overrides đúng như khai báo,
diff đúng phạm vi 6 file đã declare, branch riêng đúng
`fix/eslint-missing-deps`. PM status cập nhật IN_PROGRESS → SEALED trong
`haven/diagrams/dev-loop.prime-mermaid.md`.
