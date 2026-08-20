---
node: issue-low-batch-cleanup
worker: implementer
date: 2026-08-20
---

## Task
Operator: "fix tất cả các issue LOW, gom lại fix 1 lần trong 1 commit" —
fix toàn bộ 9 issue LOW severity đã tạo trước đó, gộp thành 1 diff/1 commit
thay vì 9 node riêng lẻ (deviation có chủ ý khỏi `SmallestDiff`
per-issue, theo yêu cầu trực tiếp của operator).

## Branch
`fix/low-severity-batch` (checkout từ `main` trước khi đổi file — đúng
`BranchBeforeCode`).

## Diff
| File | Issue | Why |
|---|---|---|
| `src/components/global/Dropdown.vue` | [#46](https://github.com/datvt243/vue-resume-web/issues/46) | Bỏ `ref: 'refDropdown'` khỏi object bind (không hoạt động), đặt `ref="refDropdown"` trực tiếp trên thẻ `<a>` |
| `src/components/veevalidate/part/FrmArray.vue` | [#47](https://github.com/datvt243/vue-resume-web/issues/47) | Import `FieldArray`, `Field` từ `vee-validate`; dùng `props.name` thay vì hardcode `"links"` |
| `src/components/veevalidate/part/FrmCheckbox.vue` | [#48](https://github.com/datvt243/vue-resume-web/issues/48) | `value="checkedValue"` → `:value="checkedValue"` |
| `src/config/regex.config.js` | [#49](https://github.com/datvt243/vue-resume-web/issues/49) | Sửa quantifier regex phone: `^(84\|0[3\|5\|7\|8\|9])+([0-9]{8})$` → `^(84\|0)(3\|5\|7\|8\|9)[0-9]{8}$` |
| `src/pages/_layouts/LayoutDefault.vue` | [#50](https://github.com/datvt243/vue-resume-web/issues/50), [#51](https://github.com/datvt243/vue-resume-web/issues/51) | Bỏ `:is-login="true"` (dead prop); đổi `$route.fullPath` → `$route.path` cho nhất quán với `getRouterName($route.path)` |
| `src/pages/_layouts/LayoutAuth.vue` | [#50](https://github.com/datvt243/vue-resume-web/issues/50) | Bỏ `:is-login="false"` (dead prop) |
| `src/models/experience.model.ts` | [#53](https://github.com/datvt243/vue-resume-web/issues/53) | Field `_id` tự định nghĩa (`yup.mixed()`) → dùng `defaultId` từ `@/types/model.type`, khớp pattern các model khác |
| `src/models/certificate.model.ts` | [#54](https://github.com/datvt243/vue-resume-web/issues/54) | Thêm `.trim()` cho `name` và `organization` |
| `src/models/generalInformation.modal.ts` → `src/models/generalInformation.model.ts` (git mv) | [#52](https://github.com/datvt243/vue-resume-web/issues/52) | Đổi tên khớp convention `*.model.ts` |
| `src/pages/dashboard/PageGeneralInformation.vue` | [#52](https://github.com/datvt243/vue-resume-web/issues/52) | Cập nhật import path theo tên file mới |

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
✓ built in 4.68s
```
Build xanh. Build-only evidence — không phải test tự động thật.

## Acceptance
| Criterion | Evidence |
|---|---|
| Cả 9 issue LOW đều có diff tương ứng | Bảng Diff ở trên, mỗi dòng trỏ đúng 1 issue |
| Build vẫn xanh sau khi đổi cả 9 chỗ | `✓ built in 4.68s` |
| Không có import path nào bị vỡ sau khi đổi tên file | Build xanh (nếu `PageGeneralInformation.vue` import sai path, Vite sẽ fail resolve — không fail) |
| `generalInformation.modal.ts` không còn tồn tại, không còn reference nào cũ | `git mv`, `grep -rn "generalInformation.modal" src/` → không còn kết quả (verify trước khi ghi note này) |

## Noticed, not done
- `experience.model.ts` vẫn còn import `formatDateToInput` và biến
  `_mesNumber` không dùng tới (dead code có sẵn từ trước, không thuộc scope
  issue #53 — không tự dọn).
- `certificate.model.ts` vẫn còn import `defaultLink` không dùng (dead code
  có sẵn từ trước, không thuộc scope issue #54).
- `FrmArray.vue` sau khi sửa vẫn là dead code (không có nơi nào
  import/dùng component này) — đúng phạm vi issue #47 chỉ yêu cầu sửa cho
  đúng nếu sau này được dùng, không yêu cầu wire nó vào đâu.

## Seal gate
Không chạm outward-facing (không commit/push/deploy/API thật) trong bước
này — chỉ sửa file local trên branch riêng. Seal gate: none (merge về
`main` sẽ cần approval riêng ở bước sau, qua `/ship`).

## Trạng thái
sealed_pending_verifier
