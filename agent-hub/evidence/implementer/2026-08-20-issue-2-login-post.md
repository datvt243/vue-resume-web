---
node: issue-2-login-post
worker: implementer
date: 2026-08-20
---

## Task
Fix [issue #2](https://github.com/datvt243/vue-resume-web/issues/2) — login
gửi password qua GET query params, lộ trong browser history / server logs
(OWASP A02:2021).

## Diff
`src/services/auth.js` `handleLogin`:
- `method: 'get'` → `method: 'post'`
- `params: {...}` → `data: {...}` (request body thay vì query string)

Diff nhỏ nhất, đúng cách fix đề xuất trong issue.

⚠️ Issue ghi rõ: "Backend cũng phải thay đổi để nhận POST body thay vì GET
query params." Backend (`nodejs-resume-api-ts`) không nằm trong repo này —
không thể verify phía backend đã chấp nhận POST chưa. Đây là giới hạn ngoài
phạm vi sửa của repo frontend; ghi rõ trong PR.

## Build output (npm run build) — đọc lại nguyên văn
```
> vue-resume-web@0.0.0 build
> vite build
...
✓ built in 4.69s
```
Build xanh. Có 1 TS diagnostic tiền tồn tại, không liên quan tới diff này:
`'tokenRefresh' is declared but its value is never read` (dòng 42) — đây là
phạm vi của [issue #12](https://github.com/datvt243/vue-resume-web/issues/12),
không sửa ở đây.

Không có test suite thật (build-only evidence, xem doctrine/MEMORY.md).

## Trạng thái
sealed_pending_verifier
