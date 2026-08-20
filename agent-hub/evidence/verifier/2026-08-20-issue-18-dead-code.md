---
node: issue-18-dead-code
worker: verifier
date: 2026-08-20
verdict: SEAL
---

## Acceptance criteria checked
1. Trace về đúng 1 node (issue-18-dead-code) — OK.
2. Đối chiếu cả 5 mục trong
   [issue #18](https://github.com/datvt243/vue-resume-web/issues/18) với
   `git status --short` + `git diff main -- ...` — cả 5 đều bị xóa đúng,
   không xóa nhầm gì khác:
   - `handleBaseDelete` — xóa khỏi `base.js`.
   - `_part` — xóa khỏi `candidate.js`.
   - `components/navbar/{Navbar,NavbarBrand}.js` — xóa. Tự
     `grep -rn "Navbar" src/` để xác nhận component thật đang dùng là
     `src/components/Navbar.vue` (import bởi `Header.vue`), khác hoàn toàn
     với 2 file `.js` đã xóa — không phải xóa nhầm component đang dùng.
   - `PageHome.vue` unused `ref` import — xóa cả `<script setup>` rỗng,
     hợp lệ với SFC.
   - `axios.js` unused `TOKEN` — xóa, chỉ còn tham chiếu trong comment chết
     (không phải code thật thi hành).
3. Phần đề xuất bật ESLint rule trong issue KHÔNG làm — lý do ghi rõ trong
   evidence note (không có `eslint-plugin-vue`/script `lint`, không verify
   được). Chấp nhận, đúng với NORTHSTAR "không claim khống".
4. `npm run build` — tự chạy lại độc lập, `✓ built in Xs`, không lỗi.
   Build-only evidence.
5. Evidence note implementer tồn tại tại
   `evidence/implementer/2026-08-20-issue-18-dead-code.md`, có ghi phát
   hiện phụ (`formatDateToInput` unused, tiền tồn tại) không nằm trong
   phạm vi issue — không sửa, hợp lý.

## Verdict
SEAL.
