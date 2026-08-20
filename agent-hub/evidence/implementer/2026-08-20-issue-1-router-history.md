---
node: issue-1-router-history
worker: implementer
date: 2026-08-20
---

## Task
Fix [issue #1](https://github.com/datvt243/vue-resume-web/issues/1) — router dùng
`createMemoryHistory`, URL không đổi trên browser, mất route khi refresh.

## Diff
`src/routers/index.js`:
- import `createWebHashHistory` thay vì `createMemoryHistory`
- `history: createWebHashHistory()` thay vì `createMemoryHistory()`

Diff nhỏ nhất, 2 dòng, đúng như fix đề xuất trong issue (phù hợp GitHub Pages,
không cần server config).

## Build output (npm run build) — đọc lại nguyên văn
```
> vue-resume-web@0.0.0 build
> vite build

vite v5.3.2 building for production...
transforming...
✓ 1340 modules transformed.
...
✓ built in 4.78s
```
Build xanh, không lỗi. (Không có test suite thật — xem doctrine/MEMORY.md.
Đây là build-only evidence, không phải test thật.)

Ghi chú: có 1 TS diagnostic tồn tại từ trước ở dòng 82 (`'from' is declared
but its value is never read`) — không liên quan tới thay đổi này, không sửa
vì ngoài phạm vi issue #1.

## Trạng thái
sealed_pending_verifier
