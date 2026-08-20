---
node: issue-17-suburl-dry
worker: implementer
date: 2026-08-20
---

## Task
Fix [issue #17](https://github.com/datvt243/vue-resume-web/issues/17) —
`const subURL = 'api/v1/'` bị hardcode lặp lại (DRY violation). Issue đề
xuất gộp chung với issue #6 (migrate sang env var `VITE_API_URL`), nhưng
#6 là thay đổi kiến trúc lớn hơn nhiều, KHÔNG nằm trong phạm vi 13 issue đã
thống nhất với operator cho phiên này. Ở đây chỉ làm đúng phần lõi DRY của
#17: gom `subURL` về MỘT chỗ (`api.config.js`), không đổi sang env var.

## Diff
- `src/config/api.config.js`: thêm `export const subURL = 'api/v1/'`.
- `src/services/base.js`, `src/services/auth.js`: xoá `const subURL =
  'api/v1/'` cục bộ, import từ `@/config/api.config`.
- `src/services/axios.js`: cũng có `const subURL = 'api/v1/'` (mới thêm
  trong [issue #12](https://github.com/datvt243/vue-resume-web/issues/12)
  ở phiên này) — gộp luôn vào cùng lần dọn dẹp, import từ
  `@/config/api.config` thay vì khai báo riêng lần 3.

Đã `grep -rn "const subURL" src/` — xác nhận chỉ còn đúng 1 định nghĩa ở
`api.config.js`.

## Build output (npm run build) — đọc lại nguyên văn
```
> vue-resume-web@0.0.0 build
> vite build
...
✓ built in 4.76s
```
Build xanh. TS diagnostic `TOKEN` unused trong `axios.js` tiền tồn tại,
không liên quan diff này. Build-only evidence.

## Trạng thái
sealed_pending_verifier
