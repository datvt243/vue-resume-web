---
node: issue-9-usehelper-reactive-loading
worker: implementer
date: 2026-08-20
---

## Task
Fix [issue #9](https://github.com/datvt243/vue-resume-web/issues/9) —
`useHelper.js:14` `toValue(refSpinner)` snapshot giá trị Ref một lần lúc
`setup()`, nếu `refSpinner.value` là `null` lúc đó thì `loading` mãi mãi
`null` → spinner không hiển thị.

## Diff
- `src/composables/useHelper.js`: trả về Ref `refSpinner` thay vì
  `toValue(refSpinner)` snapshot.
- `src/services/base.js` (`handleFrameFetch`, nơi thực sự gọi
  `loading.show()/.hide()`): unwrap bằng `toValue(loading)?.show()` /
  `toValue(loading)?.hide()` thay vì gọi trực tiếp trên Ref.
- `src/services/auth.js` (`handleRegister`): cùng root cause — `refSpinner`
  từ `inject('spinner')` truyền thẳng vào làm `loading`, code cũ gọi
  `loading.show()` / `loading?.hide()` trực tiếp trên Ref (không qua
  `.value`) — sẽ throw runtime error vì Ref không có method `.show`. Đổi
  sang `toValue(loading)?.show()` / `toValue(loading)?.hide()` cho nhất
  quán, đúng như issue yêu cầu "tất cả nơi dùng loading".
  `handleLogin` trong cùng file đã đúng từ trước (đã dùng `toValue`).

Đã `grep -rn "loading?.show\|loading?.hide\|loading\.show(\|loading\.hide("
src/` để tìm hết các nơi gọi trực tiếp — chỉ có 4 chỗ, cả 4 đã sửa.

## Build output (npm run build) — đọc lại nguyên văn
```
> vue-resume-web@0.0.0 build
> vite build
...
✓ built in 4.69s
```
Build xanh. Build-only evidence — không có test suite thật, không chạy
`npm run dev` để click qua UI xác nhận spinner hiện/ẩn trong phiên này.

## Trạng thái
sealed_pending_verifier
