---
node: issue-35-axios-network-error
worker: implementer
date: 2026-08-20
---

## Task
Fix [issue #35](https://github.com/datvt243/vue-resume-web/issues/35) —
`src/services/axios.js:65-67` reject `err.response?.data` (là `undefined`
khi lỗi network — offline/CORS/timeout). `base.js:76` và
`auth.js` (`handleRegister` catch) destructure thẳng giá trị reject đó →
`TypeError` không bắt được → spinner treo mãi, không có toast lỗi.

## Branch
`fix/issue-35-axios-network-error` (checkout từ `main` trước khi đổi file
— đúng `BranchBeforeCode`).

## Diff
`src/services/axios.js`:
```diff
- reject(err.response?.data)
+ reject(err.response?.data ?? { message: 'Lỗi kết nối, vui lòng thử lại', errors: {}, invalidToken: false })
```
Đúng cách fix đề xuất trong issue #35 — sửa tận gốc ở `_axios` để mọi nơi
consume (`base.js`, `auth.js`) luôn nhận được object có shape hợp lệ,
không cần sửa từng chỗ destructure. Không đổi gì khác — `base.js`/`auth.js`
giữ nguyên (đúng `SmallestDiff`).

## Command
```
npm run build
```
(từ repo root, đúng lệnh trong `doctrine/MEMORY.md` — không có lệnh test).

## Output (đọc lại nguyên văn)
```
> vue-resume-web@0.0.0 build
> vite build

vite v5.3.2 building for production...
transforming...
✓ 1339 modules transformed.
...
✓ built in 4.76s
```
Build xanh. Build-only evidence — không phải test tự động thật.

## Acceptance
| Criterion | Evidence |
|---|---|
| `_axios` không còn reject `undefined` khi lỗi mạng | Diff trên — luôn có fallback object khi `err.response` rỗng |
| `base.js`/`auth.js` không còn crash khi destructure | Fallback có đủ `message`/`errors`/`invalidToken` — đúng shape mà `_helper.error` (`base.js:76`) và `handleRegister` catch (`auth.js:124`) đang destructure |
| Build vẫn xanh sau khi đổi | `✓ built in 4.76s` ở trên |
| Diff nhỏ nhất, đúng scope issue #35 | Chỉ 1 dòng đổi trong `axios.js`, không sửa `base.js`/`auth.js` |

## Noticed, not done
Không có gì mới ngoài scope của issue #35 phát hiện trong lúc sửa.

## Seal gate
Không chạm outward-facing (không commit/push/deploy/API thật) trong bước
này — chỉ sửa file local trên branch riêng. Seal gate: none (merge về
`main` sẽ cần approval riêng ở bước sau).

## Trạng thái
sealed_pending_verifier
