---
node: issue-35-axios-network-error
worker: verifier
date: 2026-08-20
verdict: SEAL
---

## Acceptance criteria checked
1. Trace về đúng 1 node (issue-35-axios-network-error) — OK, node có mặt
   trên diagram với state `IN_PROGRESS` trước khi verify.
2. Branch check (`NoMainEdit`, step 7b) — note ghi rõ branch
   `fix/issue-35-axios-network-error`. Tự chạy `git branch --show-current`
   độc lập → khớp chính xác. `git status` xác nhận không có thay đổi chưa
   commit trên `main` (repo đang đứng trên branch riêng đó). Pass.
3. Diff nhỏ nhất, đúng scope issue #35 — tự chạy `git diff main --
   src/services/axios.js` độc lập để đọc lại (không chỉ tin note):
   ```diff
   -                reject(err.response?.data)
   +                reject(err.response?.data ?? { message: 'Lỗi kết nối, vui lòng thử lại', errors: {}, invalidToken: false })
   ```
   Đúng 1 dòng đổi, khớp 100% với diff trong note. Không có thay đổi nào
   khác trong `src/`.
4. Shape fallback khớp chỗ consume — tự `grep` độc lập `src/services/base.js`
   (dòng 76: `const { message = '', errors = {}, invalidToken = false } = err`)
   và `src/services/auth.js` (dòng 124: `const { message } = err`) → cả hai
   đều destructure đúng các field mà fallback object cung cấp
   (`message`/`errors`/`invalidToken`). Không cần sửa `base.js`/`auth.js` —
   đúng `SmallestDiff`.
5. `npm run build` — tự chạy lại độc lập từ repo root (không tin nguyên văn
   note), output thật: `✓ 1339 modules transformed`, chỉ có warning
   chunk-size sẵn có (không liên quan đổi này), `✓ built in 4.72s`. Không
   lỗi. Build-only evidence, không phải test tự động thật (dự án không có
   test suite — khớp `doctrine/MEMORY.md`).
6. Output "..." trong note (giữa "modules transformed" và "built in
   4.76s") — kiểm tra chéo với các evidence note đã SEALED trước đó
   (issue-1, -2, -3, -4, -5, -9, -10, -17, -18, -19, -34): TẤT CẢ đều dùng
   cùng convention "..." để lược bảng kích thước asset chunk (noise, không
   liên quan tiêu chí), không phải che lỗi. Tự chạy build độc lập ở bước 5
   xác nhận không có lỗi nào bị ẩn trong đoạn lược bỏ đó. Không REOPEN vì
   lý do này.
7. Evidence note implementer tồn tại tại
   `evidence/implementer/2026-08-20-issue-35-axios-network-error.md`,
   không có output bị cắt/che theo nghĩa ẩn lỗi thật (xem mục 6).
8. Quét 6 forbidden states — không chạm cái nào: có node trên diagram
   (không `ADHOC_WORK`), có evidence note (không `NO_EVIDENCE`), build đã
   tự verify lại độc lập (không `EDIT_UNVERIFIED`), không có code lẫn vào
   `haven/` (không `CODE_IN_HAVEN`), PM status sẽ cập nhật ngay sau verdict
   này (không `DIAGRAM_DRIFT`), diff làm trên branch riêng
   `fix/issue-35-axios-network-error`, không phải `main` (không
   `MAIN_EDIT`).
9. Seal gate — diff không chạm outward-facing (không commit/push/merge
   branch → main/`deploy.sh`/API thật) trong bước implementer này. Không
   cần approval ở bước này; merge về `main` là bước outward-facing riêng,
   sau này.
10. Tỷ lệ diff — đúng bằng phạm vi issue #35, không tiện tay sửa thêm gì
    khác. Pass `SmallestDiff`.

## Verdict
SEAL.
