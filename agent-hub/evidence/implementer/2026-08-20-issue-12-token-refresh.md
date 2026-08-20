---
node: issue-12-token-refresh
worker: implementer
date: 2026-08-20
---

## Task
Fix [issue #12](https://github.com/datvt243/vue-resume-web/issues/12) —
`tokenRefresh` được destructure trong `handleLogin` nhưng không bao giờ
lưu/dùng. Access token hết hạn → mọi call 401 → force logout, không có
silent refresh.

## Diff
- `src/stores/auth.js`: thêm `_refreshToken` ref (đọc từ
  `localStorage.tokenRefresh`), `getRefreshToken` computed,
  `setRefreshToken(val)`, xoá `tokenRefresh` khỏi localStorage + reset ref
  trong `logOut()`.
- `src/services/auth.js` `handleLogin`: nối `tokenRefresh` xuyên suốt 3
  `.then()` (trước đây bị destructure ở bước đầu rồi rơi mất vì object trả
  về không mang theo), gọi `store.setRefreshToken(tokenRefresh)` ở bước
  cuối cùng nếu có giá trị.
- `src/services/axios.js`: thêm `instanceAxios.interceptors.response.use`
  — khi gặp `401` và có `refreshToken` trong localStorage và request chưa
  retry, gọi `POST auth/refresh` để đổi token mới, gắn lại header, replay
  request gốc; nếu refresh thất bại thì `authStore().logOut()`. Đúng theo
  code mẫu (Bước 1 + Bước 2) trong issue, chuyển sang code style của repo
  (dùng `subURL` pattern có sẵn, `authStore()` Pinia thay vì import khác).

## ⚠️ Giới hạn — cần backend
Interceptor gọi `POST {API}api/v1/auth/refresh` với `{ refreshToken }`.
Backend (`nodejs-resume-api-ts`, ngoài repo này) phải có endpoint này và
trả về `{ token }` mới. Không verify được endpoint có tồn tại/hoạt động
đúng shape hay không từ phiên này (giống caveat của
[issue #2](https://github.com/datvt243/vue-resume-web/issues/2)). Nếu
backend không có endpoint, interceptor sẽ catch lỗi và gọi `logOut()` —
hành vi fallback an toàn (không tệ hơn hiện trạng trước fix: vẫn logout khi
401, chỉ khác là có thử refresh trước).

## Build output (npm run build) — đọc lại nguyên văn
```
> vue-resume-web@0.0.0 build
> vite build
...
✓ built in 4.68s
```
Build xanh. TS diagnostic `'TOKEN' is declared but its value is never read`
trong `axios.js` là tiền tồn tại (biến `TOKEN` không dùng từ trước, chỉ có
trong block comment `headers`), không liên quan diff này. Build-only
evidence — không có test suite thật, không thể verify hành vi 401→refresh
thật vì cần backend + token hết hạn thật.

## Trạng thái
sealed_pending_verifier
