---
node: issue-high-36-37-batch
worker: implementer
date: 2026-08-20
---

## Task
Operator: "fix #36 và #37 luôn, gộp 1 commit" — fix 2 issue HIGH còn lại
(#36, #37), gộp thành 1 diff/1 commit (cùng pattern batch đã dùng cho LOW
`issue-low-batch-cleanup` và MEDIUM `issue-medium-batch-cleanup`).

## Branch
`fix/high-36-37-batch` (checkout từ `main` trước khi đổi file — đúng
`BranchBeforeCode`).

## Diff
| File | Issue | Why |
|---|---|---|
| `src/pages/auth/PageRegister.vue` | [#36](https://github.com/datvt243/vue-resume-web/issues/36) | Field `repassword`: thêm `.oneOf([yup.ref('password')], 'Mật khẩu nhập lại không khớp')`, sửa message `required` sai copy-paste ("Email là bắt buộc" → "Vui lòng nhập lại mật khẩu"). Cross-field `yup.ref` đã có tiền lệ dùng trong codebase (`defaultDateStartEnd` ở `model.type.ts` dùng `yup.ref('startDate')`), và `VeeForm.vue` build schema bằng `yup.object({...})` với mọi field cùng object nên `ref` hoạt động đúng. |
| `src/utilities/index.ts` | [#37](https://github.com/datvt243/vue-resume-web/issues/37) | `_m < 9` / `_d < 9` → `< 10` trong `getDate()` — khớp cách `FrmDatePicker.vue` tự implement `format()` riêng (đã dùng `< 10` đúng từ trước). |

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
✓ built in 4.80s
```
Build xanh. Build-only evidence — không phải test tự động thật.

## Acceptance
| Criterion | Evidence |
|---|---|
| repassword không khớp password → validation fail | `.oneOf([yup.ref('password')], ...)` thêm vào schema |
| Ngày/tháng = 9 được pad đúng `0` | `_m < 9`/`_d < 9` → `< 10` |
| Build vẫn xanh sau khi đổi cả 2 chỗ | `✓ built in 4.80s` |

## Noticed, not done
Không có gì mới ngoài scope của #36/#37 phát hiện trong lúc sửa.

## Seal gate
Không chạm outward-facing (không commit/push/deploy/API thật) trong bước
này — chỉ sửa file local trên branch riêng. Seal gate: none (merge về
`main` sẽ cần approval riêng ở bước sau, qua `/ship`).

## Trạng thái
sealed_pending_verifier
