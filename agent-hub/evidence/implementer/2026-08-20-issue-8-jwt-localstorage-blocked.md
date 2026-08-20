---
node: issue-8-jwt-localstorage
worker: implementer
date: 2026-08-20
status: BLOCKED_ON_BACKEND
---

## Task
[Issue #8](https://github.com/datvt243/vue-resume-web/issues/8) — JWT lưu
trong `localStorage` (`src/stores/auth.js:12-13`), đọc được bởi bất kỳ JS
nào chạy trên trang nếu có XSS.

## Vì sao KHÔNG fix trong phiên này
Cách fix đúng theo issue là chuyển sang httpOnly cookie:
```
Set-Cookie: token=<jwt>; HttpOnly; Secure; SameSite=Strict; Path=/
```
Điều này đòi hỏi **backend** (`nodejs-resume-api-ts`, repo riêng, không nằm
trong `vue-resume-web`) set cookie thay vì trả token trong response body,
và frontend bỏ hẳn việc tự đọc/gắn `Authorization: Bearer <token>` — một
thay đổi kiến trúc xuyên suốt `services/axios.js`, `stores/auth.js`, mọi
`composables/useDocument.ts` gọi API.

Không có quyền/khả năng sửa backend từ phiên này. Bất kỳ "fix" chỉ ở
frontend (vd đổi sang `sessionStorage`) đều KHÔNG giải quyết root cause
(vẫn đọc được qua JS nếu có XSS) — sẽ là một diff giả tạo cảm giác "đã
fix" mà không đúng bản chất. Theo NORTHSTAR: claim khống = `EDIT_UNVERIFIED`.

Issue #8 note đã ghi rõ: "Fix issue #5 (XSS) trước — nếu không có XSS thì
risk của localStorage giảm đáng kể." → [issue #5](https://github.com/datvt243/vue-resume-web/issues/5)
đã SEAL (xem `issue-5-xss-vhtml-toast` trên diagram), risk hiện tại đã giảm
đáng kể dù chưa loại bỏ hoàn toàn.

## Trạng thái
Không tạo branch/PR — không có code thay đổi. Issue #8 giữ nguyên OPEN trên
GitHub, cần task riêng có phối hợp backend.
