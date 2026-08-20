---
node: issue-5-xss-vhtml-toast
worker: implementer
date: 2026-08-20
---

## Task
Fix [issue #5](https://github.com/datvt243/vue-resume-web/issues/5) — XSS:
`Toasts.vue:44` render `v-html="props.content"` từ error message server,
không sanitize (OWASP A03:2021). Kết hợp `services/base.js` build message
bằng `<br />` HTML tag nối vào string.

## Diff
- `src/components/Toasts.vue`: `v-html="props.content"` → text
  interpolation `{{ props.content }}`, thêm `style="white-space: pre-line"`
  để giữ format xuống dòng (thay cho `<br />` cũ, vì message được join bằng
  `\n`).
- `src/services/base.js`: bỏ `<br />` khỏi `_message.push(...)` (không cần
  nữa vì `white-space: pre-line` đã render `\n` thành dòng mới, và tránh
  chuỗi có literal `<br />` hiện ra dạng text sau khi bỏ `v-html`).

Chọn Option 1 trong issue (bỏ `v-html`, không cần thêm dependency
DOMPurify) — diff nhỏ nhất, loại hoàn toàn vector XSS thay vì chỉ giảm rủi
ro qua sanitize.

Đã `grep -rn "v-html" src/` — còn 2 chỗ khác (`ItemTemplate.vue` render
CKEditor description, `Dropdown.vue` render `props.text` tự viết trong
code, không phải error message thô từ server) — ngoài phạm vi issue #5,
không sửa.

## Build output (npm run build) — đọc lại nguyên văn
```
> vue-resume-web@0.0.0 build
> vite build
...
✓ built in 4.55s
```
Build xanh. Có 4 TS diagnostic tiền tồn tại trong `base.js` (unused `key`,
`props`, `callback`, destructure) — không liên quan tới diff này, không sửa
(ngoài phạm vi issue #5). Build-only evidence — không có test suite thật.

## Trạng thái
sealed_pending_verifier
