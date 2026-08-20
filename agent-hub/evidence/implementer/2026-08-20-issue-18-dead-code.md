---
node: issue-18-dead-code
worker: implementer
date: 2026-08-20
---

## Task
Fix [issue #18](https://github.com/datvt243/vue-resume-web/issues/18) —
xóa dead code: `handleBaseDelete`, `_part`, `Navbar.js`/`NavbarBrand.js`
không dùng, unused import `ref` trong `PageHome.vue`, unused `TOKEN` trong
`axios.js`.

## Diff
1. `src/services/base.js`: xóa `export const handleBaseDelete` (empty
   function, không làm gì, không import ở đâu — verify bằng
   `grep -rn "handleBaseDelete" src/` chỉ ra 1 kết quả = chính định nghĩa).
2. `src/stores/candidate.js`: xóa `const _part = ['']` (không dùng ở đâu
   trong file).
3. `src/components/navbar/` (thư mục, KHÁC với `src/components/Navbar.vue`
   đang được `Header.vue` import và dùng thật): xóa cả `Navbar.js` và
   `NavbarBrand.js` — verify bằng `grep -rn "Navbar"` src/ trước khi xóa,
   confirmm import duy nhất trỏ tới `@/components/Navbar.vue` (file khác,
   giữ nguyên).
4. `src/pages/home/PageHome.vue`: xóa cả khối `<script setup>` (chỉ có
   `import { ref } from 'vue'` không dùng) — component giờ chỉ còn
   `<template>` tĩnh, hợp lệ với Vue SFC (không bắt buộc phải có script).
5. `src/services/axios.js`: xóa `const TOKEN = ...` — chỉ được tham chiếu
   trong block `/* headers: {...} */` đã comment (code chết), không phải
   code thật thi hành.

## Không làm — ngoài phạm vi verify được
Issue đề xuất thêm bật ESLint rule `no-unused-vars`. KHÔNG làm phần này:
theo `doctrine/domains/PROJECT.md` (trap đã biết), `eslint-plugin-vue`
KHÔNG có trong `node_modules` và không có script `lint` trong
`package.json` — không có cách verify rule mới có chạy được hay không.
Thêm rule vào config không chạy được là claim khống.

## Phát hiện phụ (không sửa)
`src/stores/candidate.js:9` import `formatDateToInput` cũng unused (chỉ
dùng trong 1 dòng đã comment) — tiền tồn tại từ trước, không nằm trong
danh sách 5 mục của issue #18, không sửa ở đây (giữ diff đúng phạm vi
issue).

## Build output (npm run build) — đọc lại nguyên văn
```
> vue-resume-web@0.0.0 build
> vite build
...
✓ built in 4.75s
```
Build xanh, không lỗi. Build-only evidence — không có test suite thật.

## Trạng thái
sealed_pending_verifier
