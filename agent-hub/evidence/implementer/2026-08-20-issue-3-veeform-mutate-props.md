---
node: issue-3-veeform-mutate-props
worker: implementer
date: 2026-08-20
---

## Task
Fix [issue #3](https://github.com/datvt243/vue-resume-web/issues/3) —
`VeeForm.vue:36` `delete e.valid` trong `.map()` mutate trực tiếp object
gốc trong `props.fields` (props truyền theo reference) → validation mất sau
lần mở modal đầu tiên.

## Diff
`src/components/veevalidate/VeeForm.vue` `getFields`:
- `delete e.valid; return e` → destructure `const { valid: _valid, ...rest } = e; return rest`

Đúng cách fix đề xuất trong issue — tạo object mới thay vì mutate.

## Build output (npm run build) — đọc lại nguyên văn
```
> vue-resume-web@0.0.0 build
> vite build
...
✓ built in 4.71s
```
Build xanh, không lỗi mới. Không có test suite thật (build-only evidence,
xem doctrine/MEMORY.md). Repro steps trong issue (mở modal 2 lần) là
manual UI check — không chạy `npm run dev` để click qua UI trong phiên này;
diff là thay đổi thuần logic loại bỏ mutation, đối chiếu trực tiếp với mô
tả bug trong issue.

## Trạng thái
sealed_pending_verifier
