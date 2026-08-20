---
node: issue-4-veeform-reset-typo
worker: implementer
date: 2026-08-20
---

## Task
Fix [issue #4](https://github.com/datvt243/vue-resume-web/issues/4) —
`VeeForm.vue:93` typo `e.nam` (đáng lẽ `e.name`) trong `reset()`, cộng thêm
`reduce` thiếu `initialValue` nên không tích lũy đúng (overwrite thay vì
merge) và dùng sai key `errors:` thay vì `values:`.

## Diff
`src/components/veevalidate/VeeForm.vue` `reset()`:
- `errors: getFields.value.reduce((obj, e) => ({ [e.nam]: '' }))` →
  `values: getFields.value.reduce((obj, e) => ({ ...obj, [e.name]: '' }), {})`

Áp dụng đúng cách fix đề xuất trong issue: sửa typo, thêm `initialValue`
`{}`, spread `...obj` để tích lũy đúng, đổi `errors` → `values` (reset field
values, không phải set lỗi giả).

## Build output (npm run build) — đọc lại nguyên văn
```
> vue-resume-web@0.0.0 build
> vite build
...
✓ built in 4.76s
```
Build xanh, không lỗi. Build-only evidence (không có test suite thật —
xem doctrine/MEMORY.md). Không chạy `npm run dev` để click qua modal
"Thêm mới" trong phiên này — diff đối chiếu trực tiếp với repro/fix mô tả
trong issue (typo + reduce logic).

## Trạng thái
sealed_pending_verifier
