---
node: issue-64-base-hide-finally
worker: implementer
date: 2026-08-20
---

## Task
Fix [issue #64](https://github.com/datvt243/vue-resume-web/issues/64) —
`src/services/base.ts` (`handleFrameFetch`, dòng 41-63): `toValue(loading)?.hide()`
nằm SAU khối `try/catch`, không phải trong `finally`. Nếu `action?.()`
throw thật (lỗi đồng bộ, hoặc `action` tương lai không tự `.catch()` bên
trong nữa), `catch` sẽ `throw new Error(...)` mới — spinner loading treo
vĩnh viễn vì `hide()` không bao giờ chạy tới.

## Branch
`fix/issue-64-base-hide-finally` (checkout từ `main` trước khi đổi file —
đúng `BranchBeforeCode`).

## Diff
`src/services/base.ts`: đưa `toValue(loading)?.hide()` vào `finally` (đảm
bảo luôn chạy dù `action?.()` thành công hay lỗi), bỏ outer `catch (err) {
throw new Error(...) }` — dead code (với code hiện tại, `action` trong
`handleBase` tự `.catch()` lỗi từ `_axios` nên không bao giờ thật sự throw
ra tới `handleFrameFetch`; nếu tương lai có throw thật, lỗi sẽ tự propagate
bình thường ra ngoài `handleFrameFetch`/`handleBase`, không cần wrap lại
thành `Error` mới gây khó debug hơn). Đúng khớp cách fix đề xuất trong
issue #64 (issue này do chính hub tự phát hiện trong lúc verify fix #15,
cùng pattern lỗi try/catch + .then/.catch, khác file).

## Command
```
npm run build
npm run lint
```

## Output (đọc lại nguyên văn)
```
> vue-resume-web@0.0.0 build
> vite build
...
✓ built in 4.80s
```
```
> vue-resume-web@0.0.0 lint
> eslint src --ext .js,.ts,.vue

(không có output — exit 0)
```
Build-only + lint-only evidence — không phải test runtime thật (không có
test suite trong dự án này).

## Acceptance
| Criterion | Evidence |
|---|---|
| `hide()` nằm trong `finally`, luôn chạy dù thành công hay lỗi | Diff trên |
| Không còn outer `catch` chết wrap lỗi thành `Error` mới | Đã xoá hẳn |
| Build vẫn xanh | `✓ built in 4.80s` |
| Lint vẫn sạch | exit 0 |

## Noticed, not done
Editor báo vài diagnostic TypeScript `implicit any`/`Property does not
exist` ở `base.ts` (dòng 12, 16, 24, 25, 41) — CÓ SẴN TỪ TRƯỚC khi tôi sửa
(hệ quả của migration #13 rename `.js`→`.ts`, chưa có type annotation
thật, không được `npm run lint`/`npm run build` phát hiện vì cả 2 đều
không chạy typecheck thật — xem `doctrine/MEMORY.md`). Không thuộc phạm vi
fix #64, không tự sửa thêm.

## Seal gate
Không chạm outward-facing (không commit/push/deploy/API thật) trong bước
này — chỉ sửa file local trên branch riêng. Seal gate: none (merge về
`main` sẽ cần approval riêng ở bước sau, qua `/ship`).

## Trạng thái
sealed_pending_verifier
