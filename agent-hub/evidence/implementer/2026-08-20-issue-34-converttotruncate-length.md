---
node: issue-34-converttotruncate-length
worker: implementer
date: 2026-08-20
---

## Task
Fix [issue #34](https://github.com/datvt243/vue-resume-web/issues/34) —
`src/components/convert/part/toTruncate.js:12` gọi `value.length(25)` như
hàm (`.length` là số, không phải hàm) → `TypeError`, crash danh sách
Award/Experience (cột dùng `convertTo: 'truncate'`).

## Diff
`src/components/convert/part/toTruncate.js`:
```diff
- const _newVal = value.length(25)
+ const _newVal = value.length > 25 ? value.slice(0, 25) + '...' : value
```
Đúng cách fix đề xuất trong issue #34. Không đổi gì khác (không thêm guard
null/undefined — khớp idiom hiện có của `ConvertToText`/`ConvertToDate`
trong cùng thư mục, không có guard tương tự).

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
✓ built in 4.73s
```
Build xanh. Build-only evidence — không phải test tự động thật.

## Acceptance
| Criterion | Evidence |
|---|---|
| `.length` không còn bị gọi như hàm | Diff trên, `git diff` xác nhận dòng 12 đã đổi |
| Build vẫn xanh sau khi đổi | `✓ built in 4.73s` ở trên |
| Diff nhỏ nhất, đúng scope issue #34 | Chỉ 1 dòng đổi, không refactor thêm |

## Noticed, not done
Không có gì mới ngoài scope của issue #34 phát hiện trong lúc sửa.

## Seal gate
Không chạm outward-facing (không commit/push/deploy/API thật) trong bước
này — chỉ sửa file local. Seal gate: none.

## Trạng thái
sealed_pending_verifier
